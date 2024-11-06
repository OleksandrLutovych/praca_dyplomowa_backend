import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { DoctorsService } from './doctors.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('api/doctors')
@ApiTags('api/doctors')
export class DoctorsController {
  constructor(private readonly doctorService: DoctorsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('')
  @ApiOkResponse()
  getMany() {
    return this.doctorService.getMany();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOkResponse()
  getOne(@Param() params): Promise<any> {
    const { id } = params;
    return this.doctorService.get({ id: Number(id) });
  }
}
