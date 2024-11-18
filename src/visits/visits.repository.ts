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

  async create(data: Prisma.VisitCreateInput): Promise<Visit> {
    return this.prisma.visit.create({
      data,
    });
  }

  async delete(where: Prisma.VisitWhereUniqueInput): Promise<Visit> {
    return this.prisma.visit.delete({
      where,
    });
  }
}
