import { DoctorService } from '@prisma/client';

export class DoctorDto {
  id: number;
  user: {
    firstName: string;
    lastName: string;
  };
  proffesion: string;
  services: DoctorService[];
  rating: number;
  isAvailable: boolean;
  closestAvailableDate: Date;
}
