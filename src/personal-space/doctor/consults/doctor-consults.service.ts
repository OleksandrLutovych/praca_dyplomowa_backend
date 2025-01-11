import { DoctorsRepository } from 'src/doctors/doctors.repository';
import { VisitsRepository } from './../../../visits/visits.repository';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { addDays } from 'date-fns';

@Injectable()
export class DoctorConsultsService {
  constructor(
    private readonly visitsRepository: VisitsRepository,
    private readonly doctorRepository: DoctorsRepository,
    private readonly prisma: PrismaClient,
  ) {}

  async get(userId: number, id: number) {
    const doctor = await this.doctorRepository.findByUserId(userId);

    if (!doctor) {
      throw new HttpException(
        'Wystąpił błąd z kontem. Skontaktuj się z administratorem.',
        HttpStatus.CONFLICT,
      );
    }

    const visit = await this.visitsRepository.findOneByDoctorIdAndId(
      doctor.id,
      id,
    );

    if (!visit) {
      throw new HttpException('Wizyta nie istnieje.', HttpStatus.NOT_FOUND);
    }

    return visit;
  }

  async getUpcoming(userId: number) {
    const doctor = await this.doctorRepository.findByUserId(userId);

    if (!doctor) {
      throw new HttpException(
        'Wystąpił błąd z kontem. Skontaktuj się z administratorem.',
        HttpStatus.CONFLICT,
      );
    }

    const visits = await this.prisma.visit.findMany({
      where: {
        doctorId: doctor.id,
        date: {
          gte: new Date(),
          lte: addDays(new Date(), 2),
        },
      },
      include: {
        service: {
          select: {
            service: true,
          },
        },
      },
    });

    const events = visits.map((visit) => ({
      id: visit.id,
      title: visit.service.service,
      start: visit.date,
      end: visit.date,
    }));

    return {
      events,
    };
  }
}
