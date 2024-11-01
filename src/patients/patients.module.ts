import { Module } from '@nestjs/common';
import { PatientsService } from './patients.service';

@Module({
  controllers: [],
  providers: [PatientsService],
  exports: [PatientsService],
})
export class PatientsModule {}
