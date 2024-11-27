import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { UserWithoutSensitiveFields } from './users.interface';

@Controller('api/users')
@ApiTags('api/users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('')
  get(@Request() req): Promise<UserWithoutSensitiveFields | null> {
    const userId = req.user.sub;
    return this.userService.getData(Number(userId));
  }
}
