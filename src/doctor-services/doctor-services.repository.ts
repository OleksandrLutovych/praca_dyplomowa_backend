import { Injectable } from '@nestjs/common';
import { DoctorService, Prisma } from '@prisma/client';
import { QueryPaginationDto } from 'src/common/dtos/query-pagination.dto';
import { paginate, paginateOutput, PaginateOutput } from 'src/common/paginator';
import { PrismaService } from 'src/prisma';

@Injectable()
export class DoctorServiceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(
    where: Prisma.DoctorServiceWhereUniqueInput,
  ): Promise<DoctorService | null> {
    return this.prisma.doctorService.findUnique({
      where,
    });
  }

  async findPaginated(
    query?: QueryPaginationDto,
  ): Promise<PaginateOutput<DoctorService>> {
    const [doctorServices, total] = await Promise.all([
      await this.prisma.doctorService.findMany({
        ...paginate(query),
      }),
      await this.prisma.doctor.count(),
    ]);

    return paginateOutput<DoctorService>(doctorServices, total, query);
  }

  async findMany(
    where: Prisma.DoctorServiceWhereInput,
  ): Promise<DoctorService[]> {
    return this.prisma.doctorService.findMany({
      where,
    });
  }

  async create(data: Prisma.DoctorServiceCreateInput): Promise<DoctorService> {
    return this.prisma.doctorService.create({
      data,
    });
  }

  async delete(
    where: Prisma.DoctorServiceWhereUniqueInput,
  ): Promise<DoctorService> {
    return this.prisma.doctorService.delete({
      where,
    });
  }
}
