import { Module } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { DoctorsRepository } from './doctors.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { DoctorsController } from './doctors.controller';

@Module({
  controllers: [DoctorsController],
  imports: [PrismaModule],
  providers: [DoctorsService, DoctorsRepository],
  exports: [DoctorsService],
})
export class DoctorsModule {}
