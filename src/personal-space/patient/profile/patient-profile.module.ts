import { Module } from '@nestjs/common';
import { PatientProfileController } from './patient-profile.controller';
import { PatientProfileService } from './patient-profile.service';
import { PatientsRepository } from 'src/patients/patients.repository';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [PatientProfileService, PatientsRepository, JwtService],
  controllers: [PatientProfileController],
  imports: [],
})
export class PatientProfileModule {}
