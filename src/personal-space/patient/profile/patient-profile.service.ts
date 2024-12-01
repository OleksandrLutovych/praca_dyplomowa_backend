import { Injectable } from '@nestjs/common';
import { PatientsRepository } from 'src/patients/patients.repository';
import { PatientProfileDataDto } from './dtos/patient-profile-data.dto';

@Injectable()
export class PatientProfileService {
  constructor(private readonly patientRepository: PatientsRepository) {}

  async getData(userId: number): Promise<PatientProfileDataDto | null> {
    const patient = await this.patientRepository.getWithUser(userId);

    const response: PatientProfileDataDto = {
      personalData: {
        name: patient.user.firstName,
        lastName: patient.user.lastName,
      },
      contactData: {
        email: patient.user.email,
        phone: patient.phone,
      },
      age: patient.age,
      address: patient.address,
      pesel: patient.pesel,
    };
    return response;
  }
}
