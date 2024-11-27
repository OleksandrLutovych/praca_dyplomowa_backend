import { Injectable } from '@nestjs/common';
import { Patient } from '@prisma/client';
import { PatientsRepository } from 'src/patients/patients.repository';

@Injectable()
export class PatientProfileService {
  constructor(private readonly patientRepository: PatientsRepository) {}

  async getData(userId: number): Promise<Patient | null> {
    const patient = await this.patientRepository.getByUserId(userId);
    console.log(patient);
    return patient;
  }

  // async updateBaseData() {}

  // async createService(doctorId: number, data: DoctorServiceCreateDto) {
  //   await this.doctorServicesRepository.create({
  //     doctor: {
  //       connect: {
  //         id: doctorId,
  //       },
  //     },
  //     ...data,
  //   });
  // }

  // async updateService() {}

  // async deleteService() {}

  // async archiveAccount() {}
}
