import { Injectable, Logger } from '@nestjs/common';
import { TicketsService } from '../tickets/tickets.service';

export interface TwoChatWebhookPayload {
  event?: string;
  message?: {
    id?: string;
    from?: string;
    to?: string;
    text?: string;
    type?: string;
    timestamp?: number;
    media_url?: string;
  };
  contact?: {
    phone?: string;
    name?: string;
  };
  // Otros campos que pueda enviar 2chat
  [key: string]: any;
}

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  constructor(private readonly ticketsService: TicketsService) {}

  async processTwoChatWebhook(payload: TwoChatWebhookPayload): Promise<{
    success: boolean;
    ticketCreated?: boolean;
    message?: string;
  }> {
    try {
      // Extraer información del mensaje
      const messageText = payload.message?.text || payload.text || '';
      const fromNumber = payload.message?.from || payload.contact?.phone || payload.from || '';
      const eventType = payload.event || 'message';

      this.logger.log(
        `Webhook recibido - Evento: ${eventType}, From: ${fromNumber}, Text: ${messageText.substring(0, 50)}...`,
      );

      // Solo procesar mensajes entrantes
      if (eventType !== 'message' && eventType !== 'message.received') {
        return {
          success: true,
          message: `Evento ${eventType} ignorado`,
        };
      }

      // Verificar que el mensaje comience con #fc
      const trimmedMessage = messageText.trim();
      if (!trimmedMessage.toLowerCase().startsWith('#fc')) {
        this.logger.debug(`Mensaje no comienza con #fc, ignorado`);
        return {
          success: true,
          message: 'Mensaje no comienza con #fc',
        };
      }

      // Extraer el mensaje sin el hashtag
      const ticketMessage = trimmedMessage.substring(3).trim();
      
      if (!ticketMessage) {
        this.logger.warn(`Mensaje con #fc pero sin contenido`);
        return {
          success: false,
          message: 'Mensaje vacío después de #fc',
        };
      }

      // Normalizar el número de teléfono (remover caracteres especiales, mantener solo dígitos y +)
      const normalizedNumber = this.normalizePhoneNumber(fromNumber);

      if (!normalizedNumber) {
        this.logger.error(`No se pudo extraer número de teléfono del payload`);
        return {
          success: false,
          message: 'Número de teléfono no válido',
        };
      }

      // Crear ticket automáticamente
      this.logger.log(`Creando ticket automático para número: ${normalizedNumber}`);
      
      const ticket = await this.ticketsService.createTicketFromWhatsApp({
        numero: normalizedNumber,
        mensaje: ticketMessage,
      });

      this.logger.log(`Ticket creado exitosamente: ${ticket.ticket_number}`);

      return {
        success: true,
        ticketCreated: true,
        message: `Ticket ${ticket.ticket_number} creado exitosamente`,
      };
    } catch (error) {
      this.logger.error(`Error procesando webhook de 2chat:`, error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }

  /**
   * Normaliza un número de teléfono
   * Remueve espacios, guiones, paréntesis y otros caracteres especiales
   * Mantiene solo dígitos y el signo + al inicio
   */
  private normalizePhoneNumber(phone: string): string | null {
    if (!phone) return null;

    // Remover espacios y caracteres especiales, mantener solo dígitos y +
    let normalized = phone.replace(/[\s\-\(\)\.]/g, '');

    // Si no comienza con +, agregarlo si parece ser un número internacional
    if (!normalized.startsWith('+')) {
      // Si tiene más de 10 dígitos, probablemente es internacional
      if (normalized.length > 10) {
        normalized = '+' + normalized;
      }
    }

    // Validar que tenga al menos 10 dígitos
    const digitsOnly = normalized.replace(/\D/g, '');
    if (digitsOnly.length < 10) {
      return null;
    }

    return normalized;
  }
}

