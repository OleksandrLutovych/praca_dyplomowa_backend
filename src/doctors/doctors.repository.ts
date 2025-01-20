import { Injectable } from '@nestjs/common';
import { Doctor, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma';
import { paginate, paginateOutput, PaginateOutput } from 'src/common/paginator';
import { QueryPaginationDto } from 'src/common/dtos/query-pagination.dto';

@Injectable()
export class DoctorsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(
    where: Prisma.DoctorWhereUniqueInput,
  ): Promise<
    (Doctor & { user: { firstName: string; lastName: string } }) | null
  > {
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
  async findByUserId(
    userId: number,
  ): Promise<
    (Doctor & { user: { firstName: string; lastName: string } }) | null
  > {
    return this.prisma.doctor.findFirst({
      where: {
        userId,
      },
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

  async findMany(query?: QueryPaginationDto): Promise<PaginateOutput<Doctor>> {
    const [doctors, total] = await Promise.all([
      await this.prisma.doctor.findMany({
        ...paginate(query),
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
          DoctorService: {
            select: {
              service: true,
              price: true,
            },
          },
        },
      }),
      await this.prisma.doctor.count(),
    ]);

    return paginateOutput<Doctor>(doctors, total, query);
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
