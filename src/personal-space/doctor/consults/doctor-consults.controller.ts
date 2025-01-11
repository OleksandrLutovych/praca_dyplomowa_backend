import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '@prisma/client';
import { AuthGuard } from 'src/auth/guards/auth-auth.guard';
import { RolesCheck } from 'src/decorators/roles.decorator';
import { UserId } from 'src/decorators/user-id.decorator';
import { DoctorConsultsService } from './doctor-consults.service';

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
  @Post(':id/close')
  @ApiOkResponse()
  close(@UserId() userId: number, @Param('id', ParseIntPipe) id) {
    return this.service.get(userId, id);
  }
}
