import { Module } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { DoctorsRepository } from './doctors.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { DoctorsController } from './doctors.controller';
import { VisitsModule } from 'src/visits/visits.module';
import { DoctorServiceRepository } from 'src/doctor-services/doctor-services.repository';
import { VisitsRepository } from 'src/visits/visits.repository';
import { PatientsRepository } from 'src/patients/patients.repository';

@Module({
  controllers: [DoctorsController],
  imports: [PrismaModule, VisitsModule],
  providers: [
    DoctorsService,
    DoctorsRepository,
    DoctorServiceRepository,
    PatientsRepository,
    VisitsRepository,
  ],
  exports: [DoctorsService, DoctorsRepository],
})
export class DoctorsModule {}
