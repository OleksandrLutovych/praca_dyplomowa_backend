import { Module } from '@nestjs/common';
import { DoctorServiceRepository } from './doctor-services.repository';
import { DoctorServicesService } from './doctor-services.service';
import { DoctorServiceController } from './doctor-services.controller';
import { DoctorsRepository } from 'src/doctors/doctors.repository';

@Module({
  controllers: [DoctorServiceController],
  providers: [
    DoctorServiceRepository,
    DoctorServicesService,
    DoctorsRepository,
  ],
  exports: [DoctorServicesService],
  imports: [],
})
export class DoctorServicesModule {}
