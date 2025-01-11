import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '@prisma/client';
import { AuthGuard } from 'src/auth/guards/auth-auth.guard';
import { RolesCheck } from 'src/decorators/roles.decorator';
import { UserId } from 'src/decorators/user-id.decorator';
import { DoctorConsultsService } from './doctor-consults.service';

@Controller('api/doctor-upcoming-consults')
@ApiTags('api/doctor-upcoming-consults')
export class DoctorUpcomingConsultsController {
  constructor(private readonly service: DoctorConsultsService) {}

  @RolesCheck(Roles.DOCTOR)
  @UseGuards(AuthGuard)
  @Get('')
  @ApiOkResponse()
  getMany(@UserId() userId: number) {
    return this.service.getUpcoming(userId);
  }
}
