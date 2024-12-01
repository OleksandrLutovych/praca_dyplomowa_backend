export class DoctorCalendarEventsDto {
  events: {
    title: string;
    start: Date;
    end: Date;
  }[];
}
