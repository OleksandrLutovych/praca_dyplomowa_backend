import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { DoctorProfileService } from './doctor-profile.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { DoctorProfileDataDto } from 'src/doctors/dtos/doctor-profile-data.dto';

@Controller('api/doctor-profile')
@ApiTags('api/doctor-profile')
export class DoctorProfileController {
  constructor(private readonly doctorProfileService: DoctorProfileService) {}

  @UseGuards(JwtAuthGuard)
  @Get('')
  @ApiOkResponse()
  getData(@Request() req): Promise<DoctorProfileDataDto> {
    const doctorId = req.user.sub;
    return this.doctorProfileService.getData(doctorId);
  }
}
