import {
  DoctorService,
  VisitStatus,
  VisitSubType,
  VisitType,
} from '@prisma/client';

export class PatientPersonalVisitDto {
  id: number;
  date: Date;
  doctor: {
    user: {
      firstName: string;
      lastName: string;
    };
    proffesion: string;
  };
  place: string;
  type: VisitType;
  subType: VisitSubType;
  createdAt: Date;
  service: DoctorService;
  status: VisitStatus;
}
