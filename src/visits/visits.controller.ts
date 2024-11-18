import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Visit } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { QueryPaginationDto } from 'src/common/dtos/query-pagination.dto';
import { PaginateOutput } from 'src/common/paginator';
import { VisitsService } from './visits.service';

@Controller('api/visits')
@ApiTags('api/visits')
export class VisitsController {
  constructor(private readonly visitService: VisitsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('')
  @ApiOkResponse()
  getMany(@Query() query: QueryPaginationDto): Promise<PaginateOutput<Visit>> {
    return this.visitService.getMany(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOkResponse()
  getOne(@Param() params): Promise<any> {
    const { id } = params;
    return this.visitService.get(Number(id));
  }
}
