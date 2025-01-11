export class CreateScheduleDto {
  schedule: {
    start: Date;
    end: Date;
  }[];
  durationInMinutes: number;
}
