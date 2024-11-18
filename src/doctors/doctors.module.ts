import { Module } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { DoctorsRepository } from './doctors.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { DoctorsController } from './doctors.controller';
import { VisitsModule } from 'src/visits/visits.module';
import { DoctorServiceRepository } from 'src/doctor-services/doctor-services.repository';

@Module({
  controllers: [DoctorsController],
  imports: [PrismaModule, VisitsModule],
  providers: [DoctorsService, DoctorsRepository, DoctorServiceRepository],
  exports: [DoctorsService, DoctorsRepository],
})
export class DoctorsModule {}
