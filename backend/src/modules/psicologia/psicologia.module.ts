import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PsicologiaService } from './psicologia.service';
import { PsicologiaController } from './psicologia.controller';
import { ConsultaPsicologica } from '../../entities/consulta-psicologica.entity';
import { SesionPsicologica } from '../../entities/sesion-psicologica.entity';
import { SeguimientoEmocional } from '../../entities/seguimiento-emocional.entity';
import { FamiliarCuidador } from '../../entities/familiar-cuidador.entity';
import { Patient } from '../../entities/patient.entity';
import { User } from '../../entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ConsultaPsicologica,
      SesionPsicologica,
      SeguimientoEmocional,
      FamiliarCuidador,
      Patient,
      User,
    ]),
  ],
  controllers: [PsicologiaController],
  providers: [PsicologiaService],
  exports: [PsicologiaService],
})
export class PsicologiaModule {}

