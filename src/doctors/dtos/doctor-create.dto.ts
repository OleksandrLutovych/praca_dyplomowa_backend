import { DoctorSpeciality } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';

export class CreateDoctorDto {
  @IsNotEmpty()
  proffesion: DoctorSpeciality;

  @IsNotEmpty()
  education: string;

  @IsNotEmpty()
  about: string;
}
