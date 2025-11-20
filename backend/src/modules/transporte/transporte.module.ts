import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransporteController } from './transporte.controller';
import { TransporteService } from './transporte.service';
import { SolicitudTransporte } from '../../entities/solicitud-transporte.entity';
import { Vehiculo } from '../../entities/vehiculo.entity';
import { Patient } from '../../entities/patient.entity';
import { User } from '../../entities/user.entity';
import { Ticket } from '../../entities/ticket.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SolicitudTransporte,
      Vehiculo,
      Patient,
      User,
      Ticket,
    ]),
  ],
  controllers: [TransporteController],
  providers: [TransporteService],
  exports: [TransporteService],
})
export class TransporteModule {}

