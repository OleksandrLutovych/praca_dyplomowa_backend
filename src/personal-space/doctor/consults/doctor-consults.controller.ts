import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '@prisma/client';
import { AuthGuard } from 'src/auth/guards/auth-auth.guard';
import { RolesCheck } from 'src/decorators/roles.decorator';
import { UserId } from 'src/decorators/user-id.decorator';
import { DoctorConsultsService } from './doctor-consults.service';
import { FinishConsultDto } from './dtos/finish-consult.dto';

@Controller('api/doctor-consults')
@ApiTags('api/doctor-consults')
export class DoctorConsultsController {
  constructor(private readonly service: DoctorConsultsService) {}

  @RolesCheck(Roles.DOCTOR)
  @UseGuards(AuthGuard)
  @Get(':id')
  @ApiOkResponse()
  get(@UserId() userId: number, @Param('id', ParseIntPipe) id) {
    return this.service.get(userId, id);
  }

  @RolesCheck(Roles.DOCTOR)
  @UseGuards(AuthGuard)
  @Patch(':id/finish')
  @ApiOkResponse()
  finish(@UserId() userId: number, @Param('id') id) {
    const parseId = Number(id);
    return this.service.finish(userId, parseId);
  }

  @RolesCheck(Roles.DOCTOR)
  @UseGuards(AuthGuard)
  @Post(':id/recomendations')
  @ApiOkResponse()
  recomendations(
    @UserId() userId: number,
    @Param('id') id,
    @Body() dto: FinishConsultDto,
  ) {
    const parseId = Number(id);

    return this.service.recomendations(userId, parseId, dto);
  }
}
