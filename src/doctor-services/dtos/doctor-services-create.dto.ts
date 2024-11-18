import { IsNotEmpty } from 'class-validator';

export class DoctorServiceCreateDto {
  @IsNotEmpty()
  service: string;

  @IsNotEmpty()
  price: number;

  recomendation: string;
}
