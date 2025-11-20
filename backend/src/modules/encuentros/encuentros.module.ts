import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EncuentrosController } from './encuentros.controller';
import { EncuentrosService } from './encuentros.service';
import { Encuentro } from '../../entities/encuentro.entity';
import { Evento } from '../../entities/evento.entity';
import { Ticket } from '../../entities/ticket.entity';
import { Provider } from '../../entities/provider.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Encuentro, Evento, Ticket, Provider])],
  controllers: [EncuentrosController],
  providers: [EncuentrosService],
  exports: [EncuentrosService],
})
export class EncuentrosModule {}

