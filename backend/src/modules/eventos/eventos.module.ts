import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventosController } from './eventos.controller';
import { EventosService } from './eventos.service';
import { Evento } from '../../entities/evento.entity';
import { Patient } from '../../entities/patient.entity';
import { ICD10 } from '../../entities/icd10.entity';
import { Encuentro } from '../../entities/encuentro.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Evento, Patient, ICD10, Encuentro]),
  ],
  controllers: [EventosController],
  providers: [EventosService],
  exports: [EventosService],
})
export class EventosModule {}

