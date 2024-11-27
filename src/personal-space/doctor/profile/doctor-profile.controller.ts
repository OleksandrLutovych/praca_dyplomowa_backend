import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '@prisma/client';
import { RolesCheck } from 'src/decorators/roles.decorator';
import { DoctorProfileDataDto } from 'src/doctors/dtos/doctor-profile-data.dto';
import { DoctorProfileService } from './doctor-profile.service';
import { AuthGuard } from 'src/auth/guards/auth-auth.guard';

@Controller('api/doctor-profile')
@ApiTags('api/doctor-profile')
export class DoctorProfileController {
  constructor(private readonly doctorProfileService: DoctorProfileService) {}

  @RolesCheck(Roles.DOCTOR)
  @UseGuards(AuthGuard)
  @Get('')
  @ApiOkResponse()
  getData(@Request() req): Promise<DoctorProfileDataDto> {
    const doctorId = req.user.sub;

    const response = this.doctorProfileService.getData(doctorId);
    return response;
  }
}
