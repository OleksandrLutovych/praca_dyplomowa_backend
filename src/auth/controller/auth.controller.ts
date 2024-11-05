import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { DoctorSignUpDto, LoginDto, SignUpDto } from '../requests';
import { ResetPasswordRequestDto } from '../requests/reset-password-request.dto';
import { ResetPasswordDto } from '../requests/reset-password.dto';
import { TokenResponseDto } from '../response';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@Controller('api/auth')
@ApiTags('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-up')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('/sign-in')
  @ApiOkResponse({ type: TokenResponseDto })
  signIn(@Body() loginDto: LoginDto): Promise<TokenResponseDto> {
    return this.authService.signIn(loginDto);
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

  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  logout(@Req() req) {
    const { user } = req;
    return this.authService.logout(user.sub);
  }

  @UseGuards(AuthGuard('refresh'))
  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@Req() req) {
    // return this.authService.refresh(req.user);
  }
}
