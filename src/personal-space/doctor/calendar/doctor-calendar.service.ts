import { Injectable } from '@nestjs/common';
import { VisitsRepository } from 'src/visits/visits.repository';
import { DoctorCalendarEventsDto } from './dtos/doctor-calendar-events.dto';

@Injectable()
export class DoctorCalendarService {
  constructor(private readonly visitRepository: VisitsRepository) {}

  async getMany(userId: number): Promise<DoctorCalendarEventsDto | null> {
    const visits =
      await this.visitRepository.findAllByDoctorIdWithService(userId);

    if (!visits) {
      return null;
    }

    const events = visits.map((visit) => ({
      id: visit.id,
      title: visit.service.service,
      start: visit.date,
      end: visit.date,
      status: visit.status,
    }));

    return {
      events,
    };
  }
}
