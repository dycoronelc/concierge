import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstudiosController } from './estudios.controller';
import { EstudiosService } from './estudios.service';
import { SolicitudEstudio } from '../../entities/solicitud-estudio.entity';
import { ResultadoEstudio } from '../../entities/resultado-estudio.entity';
import { Patient } from '../../entities/patient.entity';
import { User } from '../../entities/user.entity';
import { Evento } from '../../entities/evento.entity';
import { Ticket } from '../../entities/ticket.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SolicitudEstudio,
      ResultadoEstudio,
      Patient,
      User,
      Evento,
      Ticket,
    ]),
  ],
  controllers: [EstudiosController],
  providers: [EstudiosService],
  exports: [EstudiosService],
})
export class EstudiosModule {}

