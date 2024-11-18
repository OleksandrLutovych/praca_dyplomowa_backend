import { Module } from '@nestjs/common';
import { DoctorProfileService } from './doctor-profile.service';
import { DoctorProfileController } from './doctor-profile.controller';
import { DoctorServicesModule } from 'src/doctor-services/doctor-services.module';
import { DoctorsModule } from 'src/doctors/doctors.module';
import { DoctorServiceRepository } from 'src/doctor-services/doctor-services.repository';
import { DoctorsRepository } from 'src/doctors/doctors.repository';

@Module({
  providers: [DoctorProfileService, DoctorServiceRepository, DoctorsRepository],
  controllers: [DoctorProfileController],
  imports: [DoctorServicesModule, DoctorsModule],
})
export class DoctorProfileModule {}
