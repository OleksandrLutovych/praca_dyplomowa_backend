import { Module } from '@nestjs/common';
import { DoctorConsultsController } from './doctor-consults.controller';
import { DoctorConsultsService } from './doctor-consults.service';
import { JwtService } from '@nestjs/jwt';
import { VisitsRepository } from 'src/visits/visits.repository';
import { DoctorsRepository } from 'src/doctors/doctors.repository';
import { PrismaClient } from '@prisma/client';
import { DoctorUpcomingConsultsController } from './doctor-upcoming-consult.controller';

@Module({
  providers: [
    DoctorConsultsService,
    JwtService,
    VisitsRepository,
    DoctorsRepository,
    PrismaClient,
  ],
  controllers: [DoctorConsultsController, DoctorUpcomingConsultsController],
})
export class DoctorConsultsModule {}
