import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { DoctorSignUpDto, LoginDto, SignUpDto } from '../requests';
import * as bcrypt from 'bcrypt';
import { DoctorsService } from '../../doctors/doctors.service';
import { MailerService } from '@nestjs-modules/mailer';
import { ResetPasswordRequestDto } from '../requests/reset-password-request.dto';
import { ResetPasswordDto } from '../requests/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private doctorsService: DoctorsService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailerService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<{ status: HttpStatus }> {
    const { email, password, lastName, firstName } = signUpDto;

    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);

    const user = await this.usersService.createUser({
      password: hashedPassword,
      email,
      lastName,
      firstName,
      roles: {
        set: ['PATIENT'],
      },
    });

    await this.mailService.sendMail({
      to: email,
      subject: 'Żeby zalogować się do aplikacji, aktywuj konto',
      text: `Żeby zalogować się do aplikacji, aktywuj konto \n http://localhost:5173/activate-account/${user.id}`,
    });

    return {
      status: HttpStatus.OK,
    };
  }

  async doctorSignUp(
    signUpDto: DoctorSignUpDto,
  ): Promise<{ status: HttpStatus }> {
    const { email, password, lastName, firstName, education, proffesion } =
      signUpDto;

    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);

    const user = await this.usersService.createUser({
      password: hashedPassword,
      email,
      lastName,
      firstName,
      roles: {
        set: ['DOCTOR'],
      },
    });

    await this.mailService.sendMail({
      to: email,
      subject: 'Aktywacja konta',
      text: `Żeby zalogować się do aplikacji, aktywuj konto \n http://localhost:5173/activate-account/${user.id}`,
    });

    await this.doctorsService.create({
      user: {
        connect: { id: user.id },
      },
      education,
      proffesion,
    });

    return {
      status: HttpStatus.OK,
    };
  }

  async activateAccount(userId: string): Promise<{ status: HttpStatus }> {
    await this.usersService.updateUser({
      where: { id: Number(userId) },
      data: { isVerified: true },
    });

    console.log(userId);
    return {
      status: HttpStatus.OK,
    };
  }

  async resetPasswordRequest(
    dto: ResetPasswordRequestDto,
  ): Promise<{ status: HttpStatus }> {
    const email = dto.email;
    const user = await this.usersService.getUser({ email });

    const emailResponse = await this.mailService.sendMail({
      to: email,
      subject: 'Żądanie o resetowanie hasła',
      text: `Link do resetowania hasła \n http://localhost:5173/activate-account/${user.id}`,
    });

    return {
      status: emailResponse.status,
    };
  }

  async resetPassword(
    dto: ResetPasswordDto,
    id: string,
  ): Promise<{ status: HttpStatus }> {
    const password = dto.password;
    const user = await this.usersService.getUser({ id: Number(id) });

    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);

    await this.usersService.updateUser({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return {
      status: HttpStatus.OK,
    };
  }

  async signIn(loginDto: LoginDto): Promise<{ access_token: string }> {
    const { email, password } = loginDto;
    const user = await this.usersService.getUser({ email });

    const isPasswordMatching = await bcrypt.compare(password, user.password);
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.isVerified === false) {
      throw new UnauthorizedException('User is not verified');
    }

    const payload = { email: user.email, sub: user.id };
    const access_token = await this.jwtService.signAsync(payload);
    console.log(access_token);
    return {
      access_token,
    };
  }
}
