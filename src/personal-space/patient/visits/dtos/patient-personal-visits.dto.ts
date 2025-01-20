import { VisitSubType, VisitType } from '@prisma/client';

export class PatientPersonalVisitDto {
  id: number;
  date: Date;
  doctor: {
    firstName: string;
    lastName: string;
    proffesion: string;
  };
  place: string;
  type: VisitType;
  subType: VisitSubType;
  createdAt: Date;
}
