import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '@prisma/client';
import { AuthGuard } from 'src/auth/guards/auth-auth.guard';
import { RolesCheck } from 'src/decorators/roles.decorator';
import { DoctorCalendarService } from './doctor-calendar.service';
import { DoctorCalendarEventsDto } from './dtos/doctor-calendar-events.dto';

@Controller('api/doctor-calendar')
@ApiTags('api/doctor-calendar')
export class DoctorCalendarController {
  constructor(private readonly doctorCalendarService: DoctorCalendarService) {}

  @RolesCheck(Roles.DOCTOR)
  @UseGuards(AuthGuard)
  @Get('')
  @ApiOkResponse()
  getData(@Request() req): Promise<DoctorCalendarEventsDto | null> {
    const doctorUserId = req.user.sub;

    const response = this.doctorCalendarService.getMany(doctorUserId);
    return response;
  }
}
