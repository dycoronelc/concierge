import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassificationsController } from './classifications.controller';
import { ClassificationsService } from './classifications.service';
import { Ticket } from '../../entities/ticket.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket])],
  controllers: [ClassificationsController],
  providers: [ClassificationsService],
  exports: [ClassificationsService],
})
export class ClassificationsModule {}

