import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { Doctor, Prisma } from '@prisma/client';

@Injectable()
export class DoctorsService {
  constructor(private prisma: PrismaService) {}

  async get(
    doctorWhereUniqueInput: Prisma.DoctorWhereUniqueInput,
  ): Promise<Doctor | null> {
    return this.prisma.doctor.findUnique({
      where: doctorWhereUniqueInput,
    });
  }

  async getAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.DoctorWhereUniqueInput;
    where?: Prisma.DoctorWhereInput;
    orderBy?: Prisma.DoctorOrderByWithRelationInput;
  }): Promise<Doctor[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.doctor.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async create(data: Prisma.DoctorCreateInput): Promise<Doctor> {
    return this.prisma.doctor.create({
      data,
    });
  }

  async update(params: {
    where: Prisma.DoctorWhereUniqueInput;
    data: Prisma.DoctorUpdateInput;
  }): Promise<Doctor> {
    const { where, data } = params;
    return this.prisma.doctor.update({
      data,
      where,
    });
  }

  async delete(where: Prisma.DoctorWhereUniqueInput): Promise<Doctor> {
    return this.prisma.doctor.delete({
      where,
    });
  }
}
