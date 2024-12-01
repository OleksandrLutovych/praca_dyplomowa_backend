import { Injectable } from '@nestjs/common';
import { Patient, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma';

@Injectable()
export class PatientsRepository {
  constructor(private prisma: PrismaService) {}

  async get(
    patientWhereUniqueInput: Prisma.PatientWhereUniqueInput,
  ): Promise<Patient | null> {
    return this.prisma.patient.findUnique({
      where: patientWhereUniqueInput,
    });
  }

  async getByUserId(userId: number): Promise<Patient | null> {
    return this.prisma.patient.findFirst({
      where: {
        userId,
      },
    });
  }

  async getWithUser(
    userId: number,
  ): Promise<
    | (Patient & {
        user: { firstName: string; lastName: string; email: string };
      })
    | null
  > {
    return this.prisma.patient.findFirst({
      where: {
        userId,
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  async getAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.PatientWhereUniqueInput;
    where?: Prisma.PatientWhereInput;
    orderBy?: Prisma.PatientOrderByWithRelationInput;
  }): Promise<Patient[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.patient.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async create(data: Prisma.PatientCreateInput): Promise<Patient> {
    return this.prisma.patient.create({
      data,
    });
  }

  async update(params: {
    where: Prisma.PatientWhereUniqueInput;
    data: Prisma.PatientUpdateInput;
  }): Promise<Patient> {
    const { where, data } = params;
    return this.prisma.patient.update({
      data,
      where,
    });
  }

  async delete(where: Prisma.PatientWhereUniqueInput): Promise<Patient> {
    return this.prisma.patient.delete({
      where,
    });
  }
}
