import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnfermeriaController } from './enfermeria.controller';
import { EnfermeriaService } from './enfermeria.service';
import { ServicioEnfermeria } from '../../entities/servicio-enfermeria.entity';
import { AdministracionMedicamento } from '../../entities/administracion-medicamento.entity';
import { Patient } from '../../entities/patient.entity';
import { User } from '../../entities/user.entity';
import { Ticket } from '../../entities/ticket.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ServicioEnfermeria,
      AdministracionMedicamento,
      Patient,
      User,
      Ticket,
    ]),
  ],
  controllers: [EnfermeriaController],
  providers: [EnfermeriaService],
  exports: [EnfermeriaService],
})
export class EnfermeriaModule {}

