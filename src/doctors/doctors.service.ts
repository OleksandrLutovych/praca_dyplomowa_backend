import { Injectable } from '@nestjs/common';
import { Doctor, Prisma } from '@prisma/client';
import { DoctorsRepository } from './doctors.repository';

@Injectable()
export class DoctorsService {
  constructor(private readonly doctorRepository: DoctorsRepository) {}

  async get(params: Prisma.DoctorWhereUniqueInput): Promise<Doctor | null> {
    return this.doctorRepository.findOne(params);
  }

  async getMany(): Promise<Doctor[]> {
    return this.doctorRepository.findMany({
      where: {
        user: {
          isVerified: true,
        },
      },
    });
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
