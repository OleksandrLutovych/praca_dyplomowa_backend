import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, SignUpDto } from './requests';

@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService,
  ) {
  }

  @Post('/sign-up')
  signUp(@Body() signUpDto: SignUpDto): Promise<{ access_token: string }> {
    return this.authService.signUp(signUpDto);
  }

  @Post('/sign-in')
  signIn(@Body() loginDto: LoginDto): Promise<{ access_token: string }> {
    return this.authService.signIn(loginDto);
  }
}