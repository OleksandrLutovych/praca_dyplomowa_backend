import { Injectable } from '@nestjs/common';
import { Visit } from '@prisma/client';
import { QueryPaginationDto } from 'src/common/dtos/query-pagination.dto';
import { PaginateOutput } from 'src/common/paginator';
import { VisitsRepository } from './visits.repository';

@Injectable()
export class VisitsService {
  constructor(private readonly visitsRepository: VisitsRepository) {}

  async get(id: number): Promise<Visit | null> {
    return this.visitsRepository.findOne({ id });
  }

  async getMany(query?: QueryPaginationDto): Promise<PaginateOutput<Visit>> {
    const doctors = await this.visitsRepository.findMany(query);

    return doctors;
  }
}
