import { DoctorService } from '@prisma/client';

export class DoctorDto {
  id: number;
  user: {
    firstName: string;
    lastName: string;
  };
  proffesion: string;
  services: DoctorService[];
  ranking: number;
  isAvailable: boolean;
  closestAvailableDate: Date;
  comments?: { author: string; message: string; date: Date }[];
}
