import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { DoctorService, Visit } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ListResponse } from 'src/common/dtos/list-response.dto';
import { QueryPaginationDto } from 'src/common/dtos/query-pagination.dto';
import { CreateVisitDto } from 'src/visits/dtos/create-visit.dto';
import { VisitsService } from 'src/visits/visits.service';
import { DoctorsService } from './doctors.service';
import { DoctorDto } from './dtos/doctor.dto';

@Controller('api/doctors')
@ApiTags('api/doctors')
export class DoctorsController {
  constructor(
    private readonly doctorService: DoctorsService,
    private readonly visitService: VisitsService,
  ) {}

  @Get('')
  @ApiOkResponse()
  getMany(
    @Query() query: QueryPaginationDto,
  ): Promise<ListResponse<DoctorDto>> {
    console.log(query);
    return this.doctorService.getMany(query);
  }

  @Get(':id')
  @ApiOkResponse()
  getOne(@Param() params): Promise<any> {
    const { id } = params;
    return this.doctorService.get({ id: Number(id) });
  }

  @Get(':id/services')
  @ApiOkResponse()
  getServices(@Param('id') id: string): Promise<DoctorService[]> {
    return this.doctorService.getServices(Number(id));
  }

  @Get(':id/available-times')
  @ApiOkResponse()
  getAvailableTimes(@Param('id') id: string): Promise<any> {
    return this.doctorService.getAvailableTime(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/visits')
  @ApiOkResponse()
  create(
    @Body() data: CreateVisitDto,
    @Param() params,
    @Request() req,
  ): Promise<
    Visit & {
      doctor: { user: { firstName: string; lastName: string } };
      service: { service: string; price: number; recomendation: string };
    }
  > {
    const { id } = params;
    const patientId = req.user.sub;

    return this.doctorService.createVisit(data, Number(id), Number(patientId));
  }
}
