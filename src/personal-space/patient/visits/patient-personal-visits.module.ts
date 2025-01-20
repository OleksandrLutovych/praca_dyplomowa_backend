import { Module } from '@nestjs/common';
import { PatientPersonalVisitsController } from './patient-personal-visits.controller';
import { PatientPersonalVisitsService } from './patient-personal-visits.service';
import { PrismaClient } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [PatientPersonalVisitsController],
  providers: [PatientPersonalVisitsService, PrismaClient, JwtService],
  imports: [],
})
export class PatientPersonalVisitsModule {}
