import { VisitSubType, VisitType } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';

export class CreateVisitDto {
  @IsNotEmpty()
  serviceId: number;

  @IsNotEmpty()
  date: Date;

  @IsNotEmpty()
  type: VisitType;

  @IsNotEmpty()
  subType: VisitSubType;

  @IsNotEmpty()
  place: string;
}
