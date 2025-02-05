import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PatientPersonalVisitsService } from './patient-personal-visits.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RolesCheck } from 'src/decorators/roles.decorator';
import { Roles } from '@prisma/client';
import { AuthGuard } from 'src/auth/guards/auth-auth.guard';
import { FeedbackVisit } from './dtos/feedback-visit.dto';

@Controller('api/patient-personal-visits')
@ApiTags('api/patient-personal-visits')
export class PatientPersonalVisitsController {
  constructor(private readonly service: PatientPersonalVisitsService) {}

  @RolesCheck(Roles.PATIENT)
  @UseGuards(AuthGuard)
  @Get('')
  @ApiOkResponse()
  getAll(@Request() req) {
    const userId = req.user.sub;
    return this.service.getAll(userId);
  }

  @RolesCheck(Roles.PATIENT)
  @UseGuards(AuthGuard)
  @Get(':id')
  @ApiOkResponse()
  getById(@Request() req, @Param() params) {
    const userId = Number(req.user.sub);
    const id = Number(params.id);

    return this.service.getById(id, userId);
  }

  @RolesCheck(Roles.PATIENT)
  @UseGuards(AuthGuard)
  @Post(':id/approve')
  @ApiOkResponse()
  approve(@Request() req, @Param() params) {
    const userId = Number(req.user.sub);
    const id = Number(params.id);

    return this.service.aproveVisit(id, userId);
  }

  @RolesCheck(Roles.PATIENT)
  @UseGuards(AuthGuard)
  @Post(':id/cancel')
  @ApiOkResponse()
  cancel(@Request() req, @Param() params) {
    const userId = Number(req.user.sub);
    const id = Number(params.id);

    return this.service.cancelVisit(id, userId);
  }

  @RolesCheck(Roles.PATIENT)
  @UseGuards(AuthGuard)
  @Post(':id/feedback')
  @ApiOkResponse()
  feedback(@Request() req, @Param() params, @Body() dto: FeedbackVisit) {
    const userId = Number(req.user.sub);
    const id = Number(params.id);

    return this.service.feedback(id, userId, dto);
  }
}
