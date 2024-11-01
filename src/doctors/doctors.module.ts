import { Module } from '@nestjs/common';
import { DoctorsService } from './doctors.service';

@Module({
  controllers: [],
  providers: [DoctorsService],
  exports: [DoctorsService],
})
export class DoctorsModule {}
