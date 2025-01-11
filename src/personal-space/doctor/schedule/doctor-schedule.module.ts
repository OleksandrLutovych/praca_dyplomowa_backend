import { Module } from '@nestjs/common';
import { DoctorScheduleController } from './doctor-schedule.controller';
import { PrismaClient } from '@prisma/client';
import { DoctorScheduleService } from './doctor-schedule.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [PrismaClient, DoctorScheduleService, JwtService],
  controllers: [DoctorScheduleController],
})
export class DoctorScheduleModule {}
