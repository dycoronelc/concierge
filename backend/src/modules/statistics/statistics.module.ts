import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import { Ticket } from '../../entities/ticket.entity';
import { Patient } from '../../entities/patient.entity';
import { Evento } from '../../entities/evento.entity';
import { Encuentro } from '../../entities/encuentro.entity';
import { ServicioEnfermeria } from '../../entities/servicio-enfermeria.entity';
import { SolicitudTransporte } from '../../entities/solicitud-transporte.entity';
import { SolicitudEstudio } from '../../entities/solicitud-estudio.entity';
import { ICD10 } from '../../entities/icd10.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Ticket,
      Patient,
      Evento,
      Encuentro,
      ServicioEnfermeria,
      SolicitudTransporte,
      SolicitudEstudio,
      ICD10,
    ]),
  ],
  controllers: [StatisticsController],
  providers: [StatisticsService],
  exports: [StatisticsService],
})
export class StatisticsModule {}
