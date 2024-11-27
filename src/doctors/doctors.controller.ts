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
import { DoctorsService } from './doctors.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { QueryPaginationDto } from 'src/common/dtos/query-pagination.dto';
import { PaginateOutput } from 'src/common/paginator';
import { Doctor, DoctorService, Visit } from '@prisma/client';
import { CreateVisitDto } from 'src/visits/dtos/create-visit.dto';
import { VisitsService } from 'src/visits/visits.service';

@Controller('api/doctors')
@ApiTags('api/doctors')
export class DoctorsController {
  constructor(
    private readonly doctorService: DoctorsService,
    private readonly visitService: VisitsService,
  ) {}

  @Get('')
  @ApiOkResponse()
  getMany(@Query() query: QueryPaginationDto): Promise<PaginateOutput<Doctor>> {
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

  @UseGuards(JwtAuthGuard)
  @Post(':id/visits')
  @ApiOkResponse()
  create(
    @Body() data: CreateVisitDto,
    @Param() params,
    @Request() req,
  ): Promise<Visit> {
    const { id } = params;
    const patientId = req.user.sub;

    console.log(id, patientId);
    return this.doctorService.createVisit(data, Number(id), Number(patientId));
  }
}
