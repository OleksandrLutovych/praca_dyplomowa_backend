import { DoctorsRepository } from 'src/doctors/doctors.repository';
import { Injectable } from '@nestjs/common';
import { DoctorServiceCreateDto } from './dtos/doctor-services-create.dto';
import { DoctorServiceRepository } from './doctor-services.repository';
import { DoctorService } from '@prisma/client';

@Injectable()
export class DoctorServicesService {
  constructor(
    private readonly doctorServicesRepository: DoctorServiceRepository,
    private readonly doctorsRepository: DoctorsRepository,
  ) {}

  async getManyByDoctorId(userId: number): Promise<DoctorService[]> {
    const doctorId = (await this.doctorsRepository.findByUserId(userId)).id;

    const doctorServices = this.doctorServicesRepository.findMany({
      doctorId,
    });

    return doctorServices;
  }

  async create(userId: number, data: DoctorServiceCreateDto): Promise<void> {
    const doctorId = (await this.doctorsRepository.findByUserId(userId)).id;
    this.doctorServicesRepository.create({
      doctor: {
        connect: {
          id: doctorId,
        },
      },
      ...data,
    });
  }

  async update() {}

  async delete() {}
}
