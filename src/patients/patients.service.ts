import { Injectable } from '@nestjs/common';
import { Patient, Prisma } from '@prisma/client';
import { PatientsRepository } from './patients.repository';

@Injectable()
export class PatientsService {
  constructor(private readonly patientRepository: PatientsRepository) {}

  async create(data: Prisma.PatientCreateInput): Promise<Patient> {
    return this.patientRepository.create(data);
  }
}
