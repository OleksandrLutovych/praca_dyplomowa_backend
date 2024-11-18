import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DoctorService } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { DoctorServicesService } from './doctor-services.service';
import { DoctorServiceCreateDto } from './dtos/doctor-services-create.dto';

@Controller('api/doctor-services')
@ApiTags('api/doctor-services')
export class DoctorServiceController {
  constructor(private readonly doctorService: DoctorServicesService) {}

  @UseGuards(JwtAuthGuard)
  @Get('')
  getManyByDoctorId(@Request() req): Promise<DoctorService[]> {
    const userId = req.user.sub;

    return this.doctorService.getManyByDoctorId(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('')
  create(@Request() req, @Body() dto: DoctorServiceCreateDto): Promise<void> {
    const userId = req.user.sub;

    return this.doctorService.create(userId, dto);
  }
}
