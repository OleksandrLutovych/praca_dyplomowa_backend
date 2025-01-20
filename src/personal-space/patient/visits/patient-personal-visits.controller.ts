import { Controller, Get, UseGuards } from '@nestjs/common';
import { PatientPersonalVisitsService } from './patient-personal-visits.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RolesCheck } from 'src/decorators/roles.decorator';
import { Roles } from '@prisma/client';
import { AuthGuard } from 'src/auth/guards/auth-auth.guard';

@Controller('api/patient-personal-visits')
@ApiTags('api/patient-personal-visits')
export class PatientPersonalVisitsController {
  constructor(private readonly service: PatientPersonalVisitsService) {}

  @RolesCheck(Roles.PATIENT)
  @UseGuards(AuthGuard)
  @Get('')
  @ApiOkResponse()
  getAll(userId) {
    return this.service.getAll(userId);
  }
}
