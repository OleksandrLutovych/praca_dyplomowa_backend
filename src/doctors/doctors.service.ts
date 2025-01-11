import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Doctor, DoctorService, Prisma, Visit } from '@prisma/client';
import {
  eachDayOfInterval,
  eachHourOfInterval,
  endOfMonth,
  isEqual,
} from 'date-fns';
import { QueryPaginationDto } from 'src/common/dtos/query-pagination.dto';
import { PaginateOutput } from 'src/common/paginator';
import { DoctorServiceRepository } from 'src/doctor-services/doctor-services.repository';
import { PatientsRepository } from 'src/patients/patients.repository';
import { CreateVisitDto } from 'src/visits/dtos/create-visit.dto';
import { VisitsRepository } from 'src/visits/visits.repository';
import { DoctorsRepository } from './doctors.repository';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class DoctorsService {
  constructor(
    private readonly doctorRepository: DoctorsRepository,
    private readonly doctorServiceRepository: DoctorServiceRepository,
    private readonly visitRepository: VisitsRepository,
    private readonly patientRepository: PatientsRepository,
    private readonly mailService: MailerService,
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
      date: dto.date,
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

    console.log(doctor);
    const dateInterval = eachDayOfInterval({
      start: new Date(),
      end: endOfMonth(new Date()),
    });

    const hourInterval = dateInterval.flatMap((day) =>
      eachHourOfInterval({
        start: new Date(day.setHours(9)),
        end: new Date(day.setHours(16)),
      }),
    );

    const visits = await this.visitRepository.findAllByDoctorId(doctor.id);
    const bookedTimes = visits.map((visit) => new Date(visit.date));

    const availableHours = hourInterval.filter(
      (hour) => !bookedTimes.some((booked) => isEqual(hour, booked)),
    );

    return availableHours;
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
