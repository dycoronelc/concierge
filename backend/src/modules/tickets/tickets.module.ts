import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { Ticket } from '../../entities/ticket.entity';
import { ChannelInteraction } from '../../entities/channel-interaction.entity';
import { TicketStatusHistory } from '../../entities/ticket-status-history.entity';
import { Patient } from '../../entities/patient.entity';
import { Provider } from '../../entities/provider.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Ticket,
      ChannelInteraction,
      TicketStatusHistory,
      Patient,
      Provider,
    ]),
  ],
  controllers: [TicketsController],
  providers: [TicketsService],
  exports: [TicketsService],
})
export class TicketsModule {}

