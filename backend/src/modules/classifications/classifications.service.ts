import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket, TicketCategory } from '../../entities/ticket.entity';

@Injectable()
export class ClassificationsService {
  constructor(
    @InjectRepository(Ticket)
    private ticketRepository: Repository<Ticket>,
  ) {}

  // Clasificación automática simple (MVP)
  // En producción, esto se reemplazaría con un servicio de ML
  async classifyTicket(
    ticket_id: string,
    description: string,
  ): Promise<{ categoria: TicketCategory; confianza: number; requiere_validacion: boolean }> {
    const umbralConfianza = 0.7;
    
    // Lógica simple de clasificación basada en palabras clave
    const categoria = this.simpleClassification(description);
    const confianza = this.calculateConfidence(description, categoria);
    const requiere_validacion = confianza < umbralConfianza;

    // Actualizar ticket
    await this.ticketRepository.update(ticket_id, {
      categoria_solicitud: categoria,
      nivel_confianza_clasificacion: confianza,
      requiere_validacion_manual: requiere_validacion,
      justificacion_clasificacion: {
        metodo: 'simple_keywords',
        palabras_clave_encontradas: this.extractKeywords(description, categoria),
      } as any,
    });

    return { categoria, confianza, requiere_validacion };
  }

  private simpleClassification(description: string): TicketCategory {
    const desc = description.toLowerCase();

    // Urgencia
    if (
      desc.includes('urgencia') ||
      desc.includes('emergencia') ||
      desc.includes('accidente') ||
      desc.includes('dolor agudo')
    ) {
      return TicketCategory.URGENCIA;
    }

    // Quirúrgica
    if (
      desc.includes('cirugia') ||
      desc.includes('quirurgico') ||
      desc.includes('operacion') ||
      desc.includes('intervencion')
    ) {
      return TicketCategory.QUIRURGICA;
    }

    // Hospitalaria
    if (
      desc.includes('hospital') ||
      desc.includes('internacion') ||
      desc.includes('ingreso')
    ) {
      return TicketCategory.HOSPITALARIA;
    }

    // Por defecto: Ambulatoria
    return TicketCategory.AMBULATORIA;
  }

  private calculateConfidence(description: string, categoria: TicketCategory): number {
    const desc = description.toLowerCase();
    let matches = 0;
    let totalKeywords = 0;

    const keywords = {
      [TicketCategory.URGENCIA]: ['urgencia', 'emergencia', 'accidente', 'dolor agudo'],
      [TicketCategory.QUIRURGICA]: ['cirugia', 'quirurgico', 'operacion', 'intervencion'],
      [TicketCategory.HOSPITALARIA]: ['hospital', 'internacion', 'ingreso'],
      [TicketCategory.AMBULATORIA]: ['consulta', 'medico', 'examen', 'control'],
    };

    const categoriaKeywords = keywords[categoria] || [];
    totalKeywords = categoriaKeywords.length;

    categoriaKeywords.forEach((keyword) => {
      if (desc.includes(keyword)) {
        matches++;
      }
    });

    // Calcular confianza basada en matches
    const baseConfidence = matches / totalKeywords;
    // Ajustar según longitud de descripción
    const lengthFactor = Math.min(description.length / 100, 1);
    
    return Math.min(baseConfidence * 0.8 + lengthFactor * 0.2, 0.95);
  }

  private extractKeywords(description: string, categoria: TicketCategory): string[] {
    const desc = description.toLowerCase();
    const found: string[] = [];

    const keywords = {
      [TicketCategory.URGENCIA]: ['urgencia', 'emergencia', 'accidente', 'dolor agudo'],
      [TicketCategory.QUIRURGICA]: ['cirugia', 'quirurgico', 'operacion', 'intervencion'],
      [TicketCategory.HOSPITALARIA]: ['hospital', 'internacion', 'ingreso'],
      [TicketCategory.AMBULATORIA]: ['consulta', 'medico', 'examen', 'control'],
    };

    (keywords[categoria] || []).forEach((keyword) => {
      if (desc.includes(keyword)) {
        found.push(keyword);
      }
    });

    return found;
  }

  async updateClassification(
    ticket_id: string,
    categoria: TicketCategory,
    usuario: string,
    motivo?: string,
  ): Promise<Ticket> {
    const ticket = await this.ticketRepository.findOne({ where: { ticket_id } });
    
    if (!ticket) {
      throw new Error(`Ticket ${ticket_id} no encontrado`);
    }

    ticket.categoria_solicitud = categoria;
    ticket.requiere_validacion_manual = false;
    
    // Guardar historial de cambios
    if (ticket.justificacion_clasificacion) {
      ticket.justificacion_clasificacion.historial_cambios = [
        ...(ticket.justificacion_clasificacion.historial_cambios || []),
        {
          categoria_anterior: ticket.categoria_solicitud,
          categoria_nueva: categoria,
          usuario,
          motivo,
          fecha_hora: new Date(),
        },
      ];
    }

    return this.ticketRepository.save(ticket);
  }
}

