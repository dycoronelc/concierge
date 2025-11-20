import { Injectable } from '@nestjs/common';
import { TicketsService } from '../tickets/tickets.service';

@Injectable()
export class ChannelsService {
  constructor(private ticketsService: TicketsService) {}

  // Webhook para recibir eventos de 2chat.co
  async handleWhatsAppWebhook(data: any) {
    // Estructura esperada de 2chat.co
    const { from, message, timestamp } = data;

    return this.ticketsService.createTicketFromWhatsApp({
      numero: from,
      mensaje: message,
    });
  }

  async handleCallWebhook(data: any) {
    // Estructura esperada de 2chat.co para llamadas
    const { from, duration, timestamp } = data;

    return this.ticketsService.createTicketFromCall({
      numero: from,
      duracion_segundos: duration,
    });
  }
}

