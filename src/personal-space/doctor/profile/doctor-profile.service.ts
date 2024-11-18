import { Injectable } from '@nestjs/common';
import { DoctorServiceRepository } from 'src/doctor-services/doctor-services.repository';
import { DoctorServiceCreateDto } from 'src/doctor-services/dtos/doctor-services-create.dto';
import { DoctorsRepository } from 'src/doctors/doctors.repository';
import { DoctorProfileDataDto } from 'src/doctors/dtos/doctor-profile-data.dto';

@Injectable()
export class DoctorProfileService {
  constructor(
    private readonly doctorRepository: DoctorsRepository,
    private readonly doctorServicesRepository: DoctorServiceRepository,
  ) {}

  async getData(userId: number): Promise<DoctorProfileDataDto | null> {
    const doctorId = (await this.doctorRepository.findByUserId(userId)).id;
    const personalData = await this.doctorRepository.findByUserId(userId);

    const services = await this.doctorServicesRepository.findMany({
      doctorId,
    });

    const response: DoctorProfileDataDto = {
      personalData: {
        name: personalData.user.firstName,
        lastName: personalData.user.lastName,
      },
      professionalData: {
        about: personalData.about,
        education: personalData.education,
        proffesion: personalData.proffesion,
      },
      contactData: {
        email: '',
        phone: '',
      },
      services,
    };

    return response;
  }

  async updateBaseData() {}

  async createService(doctorId: number, data: DoctorServiceCreateDto) {
    await this.doctorServicesRepository.create({
      doctor: {
        connect: {
          id: doctorId,
        },
      },
      ...data,
    });
  }

  async updateService() {}

  async deleteService() {}

  async archiveAccount() {}
}
