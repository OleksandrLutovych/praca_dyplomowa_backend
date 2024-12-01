import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '@prisma/client';
import { AuthGuard } from 'src/auth/guards/auth-auth.guard';
import { RolesCheck } from 'src/decorators/roles.decorator';
import { PatientProfileDataDto } from './dtos/patient-profile-data.dto';
import { PatientProfileService } from './patient-profile.service';

@Controller('api/patient-profile')
@ApiTags('api/patient-profile')
export class PatientProfileController {
  constructor(private readonly patientProfileService: PatientProfileService) {}

  @RolesCheck(Roles.PATIENT)
  @UseGuards(AuthGuard)
  @Get('')
  @ApiOkResponse()
  getData(@Request() req): Promise<PatientProfileDataDto | null> {
    const userId = req.user.sub;

    const response = this.patientProfileService.getData(userId);
    return response;
  }
}
