import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  Doctor,
  DoctorService,
  Prisma,
  PrismaClient,
  Visit,
} from '@prisma/client';
import {
  addHours,
  addMinutes,
  eachDayOfInterval,
  endOfMonth,
  format,
  getHours,
  getMinutes,
  isSameDay,
  isSameMinute,
} from 'date-fns';
import { QueryPaginationDto } from 'src/common/dtos/query-pagination.dto';
import { PaginateOutput } from 'src/common/paginator';
import { DoctorServiceRepository } from 'src/doctor-services/doctor-services.repository';
import { PatientsRepository } from 'src/patients/patients.repository';
import { CreateVisitDto } from 'src/visits/dtos/create-visit.dto';
import { VisitsRepository } from 'src/visits/visits.repository';
import { DoctorsRepository } from './doctors.repository';
import { DoctorAvailableTimeDto } from './dtos/doctor-available-time.dto';

@Injectable()
export class DoctorsService {
  constructor(
    private readonly doctorRepository: DoctorsRepository,
    private readonly doctorServiceRepository: DoctorServiceRepository,
    private readonly visitRepository: VisitsRepository,
    private readonly patientRepository: PatientsRepository,
    private readonly mailService: MailerService,
    private readonly prisma: PrismaClient,
  ) {}

  async get(params: Prisma.DoctorWhereUniqueInput): Promise<Doctor | null> {
    return this.doctorRepository.findOne(params);
  }

  async getMany(query?: QueryPaginationDto): Promise<PaginateOutput<Doctor>> {
    const doctors = await this.doctorRepository.findMany(query);

    return doctors;
  }

  async getServices(doctorId: number): Promise<DoctorService[]> {
    const services = await this.doctorServiceRepository.findMany({
      doctorId,
    });

    return services;
  }

  async createVisit(
    dto: CreateVisitDto,
    doctorId: number,
    userId: number,
  ): Promise<
    Visit & {
      doctor: { user: { firstName: string; lastName: string } };
      service: { service: string; price: number; recomendation: string };
    }
  > {
    const patient = await this.patientRepository.getByUserIdWithData(userId);

    if (!patient) {
      throw new HttpException(
        {
          status: 404,
          error: 'Pacjent nie istnieje. Skontaktuj się z administratorem.',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const newVisit = await this.visitRepository.create({
      type: dto.type,
      service: {
        connect: {
          id: dto.serviceId,
        },
      },
      doctor: {
        connect: {
          id: doctorId,
        },
      },
      patient: {
        connect: {
          id: patient.id,
        },
      },
      place: dto.place,
      date: addHours(new Date(dto.date), 1),
      subType: dto.subType,
    });

    await this.mailService.sendMail({
      to: patient.user.email,
      from: 'Aplikacja do rejestracji wizyt <',
      subject: 'Rekomendacje dotyczace wizyty',
      html: `
      <h1>Witaj ${patient.user.firstName} ${patient.user.lastName}</h1>
      <p>Twoja wizyta zostala zarejestrowana</p>
      <p>Typ wizyty: ${newVisit.type}</p>
      <p>Podtyp wizyty: ${newVisit.subType}</p>
      <p>Data wizyty: ${newVisit.date}</p>
      <p>Miejsce wizyty: ${newVisit.place}</p>
      <p>Usługa: ${newVisit.service.service}</p>
      <p>Cena: ${newVisit.service.price}</p>
      <p>Rekomendacje dotyczace wizyty:</p>
      <ul>
        <li>${newVisit.service.recomendation}</li>
      </ul>
      `,
    });

    return newVisit;
  }

  async getAvailableTime(userId: number) {
    const doctor = await this.doctorRepository.findOne({
      id: userId,
    });

    if (!doctor) {
      throw new HttpException(
        {
          status: 404,
          error: 'Lekarz nie istnieje. Skontaktuj się z administratorem.',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const doctorId = doctor.id;
    const today = new Date();

    const dateInterval = eachDayOfInterval({
      start: today,
      end: endOfMonth(today),
    }).map((date) => addHours(date, 1));

    const visits = await this.prisma.visit.findMany({
      where: {
        doctorId,
        date: {
          gte: dateInterval[0],
          lte: dateInterval[dateInterval.length - 1],
        },
      },
    });

    const doctorSchedule = await this.prisma.defaultSchedule.findMany({
      where: {
        doctorId,
      },
    });

    const response: DoctorAvailableTimeDto[] = dateInterval.map((date) => {
      const dayOfWeek = date.getDay();

      const scheduleForDay = doctorSchedule.find(
        (schedule) => schedule.dayOfWeek === dayOfWeek,
      );

      if (!scheduleForDay) {
        return {
          date: date.toISOString(),
          availableTimes: [],
        };
      }

      const busyTimes = visits
        .filter((visit) => visit.date.toDateString() === date.toDateString())
        .map((visit) => visit.date.toISOString());

      const availableTimes: string[] = [];
      let currentTime = new Date(scheduleForDay.start);

      while (currentTime < scheduleForDay.end) {
        const x = addHours(date, getHours(currentTime));
        const y = addMinutes(x, getMinutes(currentTime));

        const isTimeBusy = busyTimes.some(
          (busyTime) => isSameDay(busyTime, y) && isSameMinute(busyTime, y),
        );

        if (!isTimeBusy) {
          availableTimes.push(format(currentTime, 'HH:mm'));
        }

        currentTime = new Date(
          currentTime.getTime() + scheduleForDay.duration * 60000,
        );
      }

      return {
        date: date.toISOString(),
        availableTimes,
      };
    });

    return response;
  }

  async create(data: Prisma.DoctorCreateInput): Promise<Doctor> {
    return this.doctorRepository.create(data);
  }

  async update(params: {
    where: Prisma.DoctorWhereUniqueInput;
    data: Prisma.DoctorUpdateInput;
  }): Promise<Doctor> {
    const { where, data } = params;
    return this.doctorRepository.update({ where, data });
  }

  async delete(id: Prisma.DoctorWhereUniqueInput): Promise<Doctor> {
    return this.doctorRepository.delete(id);
  }
}
