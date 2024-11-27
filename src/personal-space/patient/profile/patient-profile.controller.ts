import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Patient, Roles } from '@prisma/client';
import { RolesCheck } from 'src/decorators/roles.decorator';
import { PatientProfileService } from './patient-profile.service';
import { AuthGuard } from 'src/auth/guards/auth-auth.guard';

@Controller('api/patient-profile')
@ApiTags('api/patient-profile')
export class PatientProfileController {
  constructor(private readonly patientProfileService: PatientProfileService) {}

  @RolesCheck(Roles.PATIENT)
  @UseGuards(AuthGuard)
  @Get('')
  @ApiOkResponse()
  getData(@Request() req): Promise<Patient> {
    const userId = req.user.sub;

    const response = this.patientProfileService.getData(userId);
    return response;
  }
}
