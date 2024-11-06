import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { DoctorsService } from './doctors.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { QueryPaginationDto } from 'src/common/dtos/query-pagination.dto';
import { PaginateOutput } from 'src/common/paginator';
import { Doctor } from '@prisma/client';

@Controller('api/doctors')
@ApiTags('api/doctors')
export class DoctorsController {
  constructor(private readonly doctorService: DoctorsService) {}

  @Get('')
  @ApiOkResponse()
  getMany(@Query() query: QueryPaginationDto): Promise<PaginateOutput<Doctor>> {
    return this.doctorService.getMany(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOkResponse()
  getOne(@Param() params): Promise<any> {
    const { id } = params;
    return this.doctorService.get({ id: Number(id) });
  }
}
