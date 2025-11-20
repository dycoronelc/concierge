import { Module } from '@nestjs/common';
import { ChannelsController } from './channels.controller';
import { ChannelsService } from './channels.service';
import { TicketsModule } from '../tickets/tickets.module';

@Module({
  imports: [TicketsModule],
  controllers: [ChannelsController],
  providers: [ChannelsService],
})
export class ChannelsModule {}

