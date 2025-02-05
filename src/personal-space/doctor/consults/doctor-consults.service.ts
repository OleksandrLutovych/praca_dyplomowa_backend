import { DoctorsRepository } from 'src/doctors/doctors.repository';
import { VisitsRepository } from './../../../visits/visits.repository';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient, VisitStatus } from '@prisma/client';
import { addDays } from 'date-fns';
import { FinishConsultDto } from './dtos/finish-consult.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class DoctorConsultsService {
  constructor(
    private readonly visitsRepository: VisitsRepository,
    private readonly doctorRepository: DoctorsRepository,
    private readonly prisma: PrismaClient,
    private readonly mailService: MailerService,
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

  async recomendations(userId: number, id: number, dto: FinishConsultDto) {
    const { finishRecomendations } = dto;

    const doctor = await this.doctorRepository.findByUserId(userId);

    const visit = await this.prisma.visit.findUnique({
      where: {
        id,
      },
      select: {
        patient: {
          include: {
            user: {
              select: {
                email: true,
              },
            },
          },
        },
      },
    });

    const patientEmail = visit.patient.user.email;

    const response = await this.prisma.visit.update({
      where: {
        id,
      },
      data: {
        finishRecomendations,
      },
    });

    await this.mailService.sendMail({
      to: patientEmail,
      subject: 'Zalecenia po wizycie',
      html: `
      <div class="container">
        <h1>Dziękujemy za skorzystania z naszego serwisu!</h1>
        <p>Poniżej znajdziesz zalecenia od lekarza ${doctor.user.firstName} ${doctor.user.lastName}</p>
        <p>${finishRecomendations}</p>
    </div>`,
    });

    return response;
  }

  async finish(userId: number, id: number) {
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

    if (visit.status === VisitStatus.FINISHED) {
      throw new HttpException(
        'Wizyta została już zakończona.',
        HttpStatus.CONFLICT,
      );
    }

    const response = await this.prisma.visit.update({
      where: {
        id,
      },
      data: {
        status: VisitStatus.FINISHED,
        finishedAt: new Date(),
      },
    });

    return response;
  }
}
