import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateScheduleDto } from './dtos/create-schedule.dto';
import {
  eachDayOfInterval,
  endOfWeek,
  getDay,
  getHours,
  setHours,
  startOfWeek,
} from 'date-fns';

@Injectable()
export class DoctorScheduleService {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateScheduleDto, userId: number) {
    const { durationInMinutes, start, end } = data;

    const doctor = await this.prisma.doctor.findFirst({
      where: {
        userId,
      },
    });

    const doctorId = doctor.id;

    const existingEvent = await this.prisma.defaultSchedule.findFirst({
      where: {
        doctorId,
        dayOfWeek: getDay(start),
      },
    });

    if (existingEvent) {
      throw new HttpException(
        'Schedule already exists for this day',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.prisma.defaultSchedule.create({
      data: {
        doctorId,
        start,
        end,
        duration: durationInMinutes,
        dayOfWeek: getDay(start),
      },
    });

    return null;
  }

  async update(data: CreateScheduleDto, userId: number, id: number) {
    const { durationInMinutes, start, end } = data;

    const doctor = await this.prisma.doctor.findFirst({
      where: {
        userId,
      },
    });

    const doctorId = doctor.id;

    await this.prisma.defaultSchedule.update({
      where: {
        id,
      },
      data: {
        doctorId,
        start,
        end,
        duration: durationInMinutes,
        dayOfWeek: getDay(start),
      },
    });

    return null;
  }

  async get(userId: number, start: string, end: string): Promise<any> {
    const doctor = await this.prisma.doctor.findFirst({
      where: {
        userId,
      },
    });

    const doctorId = doctor.id;
    console.log(start, end);
    const doctorSchedule = await this.prisma.defaultSchedule.findMany({
      where: {
        doctorId,
      },
    });

    if (!start || !end) {
      const days = eachDayOfInterval({
        start: startOfWeek(new Date()),
        end: endOfWeek(new Date()),
      });

      const result = days
        .map((date) => {
          const dayOfWeek = getDay(date);
          const scheduleForDay = doctorSchedule.find(
            (schedule) => schedule.dayOfWeek === dayOfWeek,
          );

          if (!scheduleForDay) {
            return null;
          }

          return {
            ...scheduleForDay,
            start: setHours(date, getHours(scheduleForDay.start)),
            end: setHours(date, getHours(scheduleForDay.end)),
          };
        })
        .filter((x) => x !== null);

      return result;
    }
    const days = eachDayOfInterval({ start, end });

    const result = days
      .map((date) => {
        const dayOfWeek = getDay(date);
        const scheduleForDay = doctorSchedule.find(
          (schedule) => schedule.dayOfWeek === dayOfWeek,
        );

        if (!scheduleForDay) {
          return null;
        }

        return {
          ...scheduleForDay,
          start: setHours(date, getHours(scheduleForDay.start)),
          end: setHours(date, getHours(scheduleForDay.end)),
        };
      })
      .filter((x) => x !== null);
    return result;
  }
}
