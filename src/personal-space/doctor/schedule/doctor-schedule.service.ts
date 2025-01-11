import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateScheduleDto } from './dtos/create-schedule.dto';
import { getDay } from 'date-fns';

@Injectable()
export class DoctorScheduleService {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateScheduleDto, userId: number) {
    const { durationInMinutes, schedule } = data;

    const doctor = await this.prisma.doctor.findFirst({
      where: {
        userId,
      },
    });

    const doctorId = doctor.id;

    const scheduleDb = await this.prisma.defaultSchedule.findMany({
      where: { doctorId },
    });

    const existingSchedule = [];

    if (scheduleDb.length >= schedule.length) {
      throw new HttpException('Schedule already exists', HttpStatus.CONFLICT);
    }

    for (const { start, end } of schedule) {
      console.log(start, end);
      const dayOfweek = getDay(start);

      if (scheduleDb.some((s) => s.dayOfWeek === dayOfweek)) {
        existingSchedule.push({ start, end });
        continue;
      }

      await this.createSchedule(doctorId, start, end, durationInMinutes);
    }

    const doctorSchedule = await this.prisma.defaultSchedule.findMany({
      where: {
        doctorId,
      },
    });

    console.log(existingSchedule);

    return doctorSchedule;
  }

  async createSchedule(
    doctorId: number,
    start: Date,
    end: Date,
    durationInMinutes: number,
  ) {
    return await this.prisma.defaultSchedule.create({
      data: {
        doctorId,
        start,
        end,
        duration: durationInMinutes,
        dayOfWeek: getDay(start),
      },
    });
  }

  async get(userId: number): Promise<any> {
    const doctor = await this.prisma.doctor.findFirst({
      where: {
        userId,
      },
    });

    const doctorId = doctor.id;

    const doctorSchedule = await this.prisma.defaultSchedule.findMany({
      where: {
        doctorId,
      },
    });

    console.log(doctorSchedule);

    return doctorSchedule;
  }
}
