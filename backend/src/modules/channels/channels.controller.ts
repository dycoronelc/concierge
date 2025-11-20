import { Controller, Post, Body } from '@nestjs/common';
import { ChannelsService } from './channels.service';

@Controller('channels')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Post('webhook/whatsapp')
  async whatsappWebhook(@Body() data: any) {
    return this.channelsService.handleWhatsAppWebhook(data);
  }

  @Post('webhook/call')
  async callWebhook(@Body() data: any) {
    return this.channelsService.handleCallWebhook(data);
  }
}

