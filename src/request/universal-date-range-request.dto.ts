import { IsDate } from 'class-validator';

export class UniversalDateRangeRequestDto {
  @IsDate()
  start: Date;

  @IsDate()
  end: Date;
}
