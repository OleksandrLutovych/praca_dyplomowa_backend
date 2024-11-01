import { IsEmail, IsNotEmpty } from 'class-validator';

export class SignUpDto {

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

}