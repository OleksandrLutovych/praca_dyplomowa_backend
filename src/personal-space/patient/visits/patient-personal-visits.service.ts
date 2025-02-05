import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient, VisitStatus } from '@prisma/client';
import { getHours, setHours } from 'date-fns';
import { PatientPersonalVisitDto } from './dtos/patient-personal-visits.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { FeedbackVisit } from './dtos/feedback-visit.dto';

@Injectable()
export class PatientPersonalVisitsService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly mailService: MailerService,
  ) {}

  async getAll(userId: number): Promise<PatientPersonalVisitDto[] | null> {
    const patient = await this.prisma.patient.findFirst({
      where: {
        userId,
      },
    });
    const visits = await this.prisma.visit.findMany({
      where: {
        patientId: patient.id,
      },
      include: {
        doctor: {
          select: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
            proffesion: true,
          },
        },
        service: true,
      },
    });

    const response: PatientPersonalVisitDto[] = visits.map((visit) => {
      return {
        id: visit.id,
        date: setHours(visit.date, getHours(visit.date) - 1),
        doctor: {
          user: {
            firstName: visit.doctor.user.firstName,
            lastName: visit.doctor.user.lastName,
          },
          proffesion: visit.doctor.proffesion,
        },
        place: visit.place,
        type: visit.type,
        subType: visit.subType,
        createdAt: visit.createdAt,
        service: visit.service,
        status: visit.status,
        finishRecomendations: visit.finishRecomendations,
      };
    });

    return response;
  }

  async getById(
    id: number,
    userId: number,
  ): Promise<PatientPersonalVisitDto | null> {
    const patient = await this.prisma.patient.findFirst({
      where: {
        userId,
      },
    });
    if (!patient) {
      return null;
    }

    const visit = await this.prisma.visit.findFirst({
      where: {
        id,
        patientId: patient.id,
      },
      include: {
        doctor: {
          select: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
            proffesion: true,
          },
        },
        service: true,
      },
    });
    const response: PatientPersonalVisitDto = {
      id: visit.id,
      date: setHours(visit.date, getHours(visit.date) - 1),
      doctor: {
        user: {
          firstName: visit.doctor.user.firstName,
          lastName: visit.doctor.user.lastName,
        },
        proffesion: visit.doctor.proffesion,
      },
      place: visit.place,
      type: visit.type,
      subType: visit.subType,
      createdAt: visit.createdAt,
      service: visit.service,
      status: visit.status,
      finishRecomendations: visit.finishRecomendations,
    };

    return response;
  }
  async aproveVisit(id: number, userId: number): Promise<boolean> {
    const patient = await this.prisma.patient.findFirst({
      where: {
        userId,
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    if (!patient) {
      return false;
    }

    const visit = await this.prisma.visit.findFirst({
      where: {
        id,
        patientId: patient.id,
      },
      include: {
        doctor: {
          select: {
            user: {
              select: {
                email: true,
              },
            },
          },
        },
      },
    });

    if (!visit) {
      return false;
    }

    await this.prisma.visit.update({
      where: {
        id,
      },
      data: {
        status: VisitStatus.ACCEPTED,
      },
    });

    await this.mailService.sendMail({
      to: patient.user.email,
      subject: 'Zmiana statusu wizyty',
      html: `
      <div class="container">
        <h1>Uwaga, status wizyty nr. ${visit.id} został zmieniony!</h1>
        <p>Również będziesz widział to w koncie osobistym w zakładce moje wizyty.</p>
    </div>`,
    });

    await this.mailService.sendMail({
      to: visit.doctor.user.email,
      subject: 'Zmiana statusu wizyty',
      html: `
      <div class="container">
        <h1>Uwaga, status wizyty nr. ${visit.id} został zmieniony!</h1>
        <p>Również będziesz widział to w koncie osobistym w zakładce moje wizyty.</p>
    </div>`,
    });

    return true;
  }

  async cancelVisit(id: number, userId: number): Promise<boolean> {
    const patient = await this.prisma.patient.findFirst({
      where: {
        userId,
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });
    if (!patient) {
      return false;
    }

    const visit = await this.prisma.visit.findFirst({
      where: {
        id,
        patientId: patient.id,
      },
      include: {
        doctor: {
          select: {
            user: {
              select: {
                email: true,
              },
            },
          },
        },
      },
    });

    if (!visit) {
      return false;
    }

    await this.prisma.visit.update({
      where: {
        id,
      },
      data: {
        status: VisitStatus.CANCELED,
      },
    });

    await this.mailService.sendMail({
      to: patient.user.email,
      subject: 'Zmiana statusu wizyty',
      html: `
      <div class="container">
        <h1>Uwaga, status wizyty nr. ${visit.id} został zmieniony!</h1>
        <p>Również będziesz widział to w koncie osobistym w zakładce moje wizyty.</p>
    </div>`,
    });

    await this.mailService.sendMail({
      to: visit.doctor.user.email,
      subject: 'Zmiana statusu wizyty',
      html: `
      <div class="container">
        <h1>Uwaga, status wizyty nr. ${visit.id} został zmieniony!</h1>
        <p>Również będziesz widział to w koncie osobistym w zakładce moje wizyty.</p>
    </div>`,
    });

    return true;
  }

  async feedback(id: number, userId: number, dto: FeedbackVisit) {
    const { comment, ranking } = dto;
    const patient = await this.prisma.patient.findFirst({
      where: {
        userId,
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    if (!patient) {
      throw new HttpException(
        'Wystąpił błąd z kontem pacjenta. Skontaktuj się z administratorem.',
        HttpStatus.CONFLICT,
      );
    }

    const visit = await this.prisma.visit.findFirst({
      where: {
        id,
        patientId: patient.id,
      },
      include: {
        doctor: {
          select: {
            user: {
              select: {
                email: true,
              },
            },
            rating: true,
          },
        },
      },
    });

    if (!visit) {
      throw new HttpException(
        'Wystąpił błąd z wizytą. Skontaktuj się z administratorem.',
        HttpStatus.CONFLICT,
      );
    }

    const response = await this.prisma.visit.update({
      where: {
        id,
      },
      data: {
        comment,
        ranking,
      },
    });

    return response;
  }
}
