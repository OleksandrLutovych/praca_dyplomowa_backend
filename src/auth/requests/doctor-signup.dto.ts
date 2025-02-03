import { IsEmail, IsNotEmpty } from 'class-validator';

export class DoctorSignUpDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;
}
