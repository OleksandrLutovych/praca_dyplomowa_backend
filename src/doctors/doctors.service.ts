import { Injectable } from '@nestjs/common';
import { Doctor, DoctorService, Prisma } from '@prisma/client';
import { DoctorsRepository } from './doctors.repository';
import { QueryPaginationDto } from 'src/common/dtos/query-pagination.dto';
import { PaginateOutput } from 'src/common/paginator';
import { DoctorServiceRepository } from 'src/doctor-services/doctor-services.repository';

@Injectable()
export class DoctorsService {
  constructor(
    private readonly doctorRepository: DoctorsRepository,
    private readonly doctorServiceRepository: DoctorServiceRepository,
  ) {}

  async get(params: Prisma.DoctorWhereUniqueInput): Promise<Doctor | null> {
    return this.doctorRepository.findOne(params);
  }

  async getMany(query?: QueryPaginationDto): Promise<PaginateOutput<Doctor>> {
    const doctors = await this.doctorRepository.findMany(query);

    return doctors;
  }

  async getServices(doctorId: number): Promise<DoctorService[]> {
    const services = await this.doctorServiceRepository.findMany({
      doctorId,
    });

    return services;
  }

  async create(data: Prisma.DoctorCreateInput): Promise<Doctor> {
    return this.doctorRepository.create(data);
  }

  async update(params: {
    where: Prisma.DoctorWhereUniqueInput;
    data: Prisma.DoctorUpdateInput;
  }): Promise<Doctor> {
    const { where, data } = params;
    return this.doctorRepository.update({ where, data });
  }

  async delete(id: Prisma.DoctorWhereUniqueInput): Promise<Doctor> {
    return this.doctorRepository.delete(id);
  }
}
