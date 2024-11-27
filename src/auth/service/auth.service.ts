import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { DoctorSignUpDto, LoginDto, SignUpDto } from '../requests';
import * as bcrypt from 'bcrypt';
import { DoctorsService } from '../../doctors/doctors.service';
import { MailerService } from '@nestjs-modules/mailer';
import { ResetPasswordRequestDto } from '../requests/reset-password-request.dto';
import { ResetPasswordDto } from '../requests/reset-password.dto';
import { TokenResponseDto } from '../response';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly doctorsService: DoctorsService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailerService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<{ status: HttpStatus }> {
    const { email, password, lastName, firstName } = signUpDto;

    const userExists = await this.usersService.getUser({ email });

    if (userExists) {
      throw new UnauthorizedException('User already exists');
    }

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

    const userExists = await this.usersService.getUser({ email });

    if (userExists) {
      throw new UnauthorizedException('User already exists');
    }

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

  async signIn(loginDto: LoginDto): Promise<TokenResponseDto> {
    const { email, password } = loginDto;
    const user = await this.usersService.getUser({ email });

    const isPasswordMatching = await bcrypt.compare(password, user.password);
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.isVerified === false) {
      throw new UnauthorizedException('User is not verified');
    }

    const payload = { email: user.email, sub: user.id, roles: user.roles };
    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });

    await this.usersService.updateUser({
      where: { id: user.id },
      data: { refreshToken },
    });

    const tokenResponse: TokenResponseDto = {
      accessToken,
      refreshToken,
    };
    return tokenResponse;
  }

  async logout(userId: number): Promise<{ status: HttpStatus }> {
    await this.usersService.updateUser({
      where: { id: userId },
      data: { refreshToken: null },
    });

    return {
      status: HttpStatus.OK,
    };
  }

  // async refresh(payload): Promise<TokenResponseDto> {
  //
  // }

  async validateUser(dto: LoginDto): Promise<any> {
    const { email, password } = dto;
    const user = await this.usersService.getUser({ email });

    if (!user) {
      return null;
    }

    const isPasswordMatching = await bcrypt.compare(password, user.password);

    if (!isPasswordMatching) {
      return null;
    }

    return user;
  }
}
