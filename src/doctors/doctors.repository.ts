import { Injectable } from '@nestjs/common';
import { Doctor, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma';

@Injectable()
export class DoctorsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(where: Prisma.DoctorWhereUniqueInput): Promise<Doctor | null> {
    return this.prisma.doctor.findUnique({
      where,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async findMany(params: {
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
