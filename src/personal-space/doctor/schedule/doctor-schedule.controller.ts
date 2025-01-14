import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '@prisma/client';
import { AuthGuard } from 'src/auth/guards/auth-auth.guard';
import { RolesCheck } from 'src/decorators/roles.decorator';
import { UserId } from 'src/decorators/user-id.decorator';
import { DoctorScheduleService } from './doctor-schedule.service';
import { CreateScheduleDto } from './dtos/create-schedule.dto';

@Controller('api/doctor-schedule')
@ApiTags('api/doctor-schedule')
export class DoctorScheduleController {
  constructor(private readonly doctorScheduleService: DoctorScheduleService) {}

  @RolesCheck(Roles.DOCTOR)
  @UseGuards(AuthGuard)
  @Get('')
  @ApiOkResponse()
  get(
    @UserId() userId: number,
    @Query('start') start: string,
    @Query('end') end: string,
  ): Promise<any | null> {
    const response = this.doctorScheduleService.get(userId, start, end);
    return response;
  }

  @RolesCheck(Roles.DOCTOR)
  @UseGuards(AuthGuard)
  @Post('')
  @ApiOkResponse()
  create(
    @UserId() userId: number,
    @Body() dto: CreateScheduleDto,
  ): Promise<any | null> {
    const response = this.doctorScheduleService.create(dto, userId);
    return response;
  }

  @RolesCheck(Roles.DOCTOR)
  @UseGuards(AuthGuard)
  @Patch(':id')
  @ApiOkResponse()
  update(
    @UserId() userId: number,
    @Body() dto: CreateScheduleDto,
    @Param('id') id: number,
  ): Promise<any | null> {
    const response = this.doctorScheduleService.update(dto, userId, Number(id));
    return response;
  }
}
