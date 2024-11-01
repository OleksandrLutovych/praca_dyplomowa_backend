import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { DoctorSignUpDto, LoginDto, SignUpDto } from '../requests';
import { ResetPasswordRequestDto } from '../requests/reset-password-request.dto';
import { ResetPasswordDto } from '../requests/reset-password.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-up')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('/doctor-sign-up')
  doctorSignUp(@Body() signUpDto: DoctorSignUpDto) {
    return this.authService.doctorSignUp(signUpDto);
  }

  @Get('/activate-account/:id')
  activateAccount(@Param('id') id: string) {
    return this.authService.activateAccount(id);
  }

  @Post('/reset-password')
  resetPasswordRequest(@Body() dto: ResetPasswordRequestDto) {
    return this.authService.resetPasswordRequest(dto);
  }

  @Post('/reset-password/:id')
  resetPassword(@Body() dto: ResetPasswordDto, @Param('id') id: string) {
    return this.authService.resetPassword(dto, id);
  }

  @Post('/sign-in')
  signIn(@Body() loginDto: LoginDto): Promise<{ access_token: string }> {
    return this.authService.signIn(loginDto);
  }
}
