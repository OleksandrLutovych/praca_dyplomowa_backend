export class DoctorCalendarEventsDto {
  events: {
    id: number;
    title: string;
    start: Date;
    end: Date;
  }[];
}
