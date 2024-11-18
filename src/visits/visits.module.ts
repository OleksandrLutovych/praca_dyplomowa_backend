import { Module } from '@nestjs/common';
import { VisitsController } from './visits.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { VisitsService } from './visits.service';
import { VisitsRepository } from './visits.repository';

@Module({
  controllers: [VisitsController],
  imports: [PrismaModule],
  providers: [VisitsService, VisitsRepository],
  exports: [VisitsService],
})
export class VisitsModule {}
