import { IsNotEmpty } from 'class-validator';

export class CreatePatientDto {
  @IsNotEmpty()
  age: string;

  @IsNotEmpty()
  pesel: string;

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  phone: string;
}
