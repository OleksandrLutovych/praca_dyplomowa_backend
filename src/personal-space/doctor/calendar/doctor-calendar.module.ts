import { Module } from '@nestjs/common';
import { DoctorCalendarController } from './doctor-calendar.controller';
import { DoctorCalendarService } from './doctor-calendar.service';
import { VisitsRepository } from 'src/visits/visits.repository';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [DoctorCalendarController],
  providers: [DoctorCalendarService, VisitsRepository, JwtService],
})
export class DoctorCalendarModule {}
