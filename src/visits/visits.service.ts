import { Injectable } from '@nestjs/common';
import { Visit } from '@prisma/client';
import { QueryPaginationDto } from 'src/common/dtos/query-pagination.dto';
import { PaginateOutput } from 'src/common/paginator';
import { CreateVisitDto } from './dtos/create-visit.dto';
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

  // async create(
  //   data: CreateVisitDto,
  //   doctorId: number,
  //   patientId: number,
  // ): Promise<Visit> {
  //   console.log(data, doctorId, patientId);
  //   return this.visitsRepository.create({
  //     startDate: data.date,
  //     type: data.type,
  //     subType: data.subType,
  //     endDate: data.date,
  //     place: data.place,
  //     doctor: {
  //       connect: {
  //         id: doctorId,
  //       },
  //     },
  //     patient: {
  //       connect: {
  //         id: patientId,
  //       },
  //     },
  //   });
  // }
}
