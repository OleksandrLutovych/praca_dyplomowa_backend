import { Injectable } from '@nestjs/common';
import { Prisma, Visit } from '@prisma/client';
import { QueryPaginationDto } from 'src/common/dtos/query-pagination.dto';
import { paginate, paginateOutput, PaginateOutput } from 'src/common/paginator';
import { PrismaService } from 'src/prisma';

@Injectable()
export class VisitsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(where: Prisma.VisitWhereUniqueInput): Promise<Visit | null> {
    return this.prisma.visit.findUnique({
      where,
    });
  }

  async findMany(query?: QueryPaginationDto): Promise<PaginateOutput<Visit>> {
    const [visits, total] = await Promise.all([
      await this.prisma.visit.findMany({
        ...paginate(query),
      }),
      await this.prisma.doctor.count(),
    ]);

    return paginateOutput<Visit>(visits, total, query);
  }

  async findAllByDoctorId(doctorId: number): Promise<Visit[]> {
    return this.prisma.visit.findMany({
      where: {
        doctorId,
      },
    });
  }

  async findAllByDoctorIdWithService(
    doctorId: number,
  ): Promise<(Visit & { service: { service: string } })[]> {
    return this.prisma.visit.findMany({
      where: {
        doctor: {
          userId: doctorId,
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
  }

  async findOneByDoctorIdAndId(doctorId: number, id: number) {
    return this.prisma.visit.findFirst({
      where: {
        id,
        doctorId,
      },
      include: {
        patient: {
          select: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        service: {
          select: {
            service: true,
            price: true,
            recomendation: true,
          },
        },
      },
    });
  }

  async create(data: Prisma.VisitCreateInput): Promise<
    Visit & {
      doctor: { user: { firstName: string; lastName: string } };
      service: { service: string; price: number; recomendation: string };
    }
  > {
    return this.prisma.visit.create({
      data,
      include: {
        doctor: {
          select: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        service: {
          select: {
            service: true,
            price: true,
            recomendation: true,
          },
        },
      },
    });
  }

  async delete(where: Prisma.VisitWhereUniqueInput): Promise<Visit> {
    return this.prisma.visit.delete({
      where,
    });
  }
}
