import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PatientPersonalVisitDto } from './dtos/patient-personal-visits.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class PatientPersonalVisitsService {
  constructor(private readonly prisma: PrismaClient) {}

  async getAll(userId: number): Promise<PatientPersonalVisitDto[] | null> {
    const visits = await this.prisma.visit.findMany({
      where: {
        patientId: userId,
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
      },
    });

    const response: PatientPersonalVisitDto[] = visits.map((visit) => {
      return plainToClass(PatientPersonalVisitDto, visit);
      return {
        id: visit.id,
        date: visit.date,
        doctor: {
          firstName: visit.doctor.user.firstName,
          lastName: visit.doctor.user.lastName,
          proffesion: visit.doctor.proffesion,
        },
        place: visit.place,
        type: visit.type,
        subType: visit.subType,
        createdAt: visit.createdAt,
      };
    });

    return response;
  }
}
