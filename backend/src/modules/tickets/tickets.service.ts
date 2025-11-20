import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket, TicketStatus, TicketChannel } from '../../entities/ticket.entity';
import { ChannelInteraction, InteractionType } from '../../entities/channel-interaction.entity';
import { TicketStatusHistory } from '../../entities/ticket-status-history.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private ticketRepository: Repository<Ticket>,
    @InjectRepository(ChannelInteraction)
    private interactionRepository: Repository<ChannelInteraction>,
    @InjectRepository(TicketStatusHistory)
    private statusHistoryRepository: Repository<TicketStatusHistory>,
  ) {}

  async generateTicketNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `FC-${year}-${random}`;
  }

  async createTicketFromWhatsApp(data: {
    numero: string;
    mensaje: string;
    patient_id?: string;
  }): Promise<Ticket> {
    // Buscar ticket abierto existente
    const existingTicket = await this.findOpenTicketByNumber(data.numero);
    
    if (existingTicket) {
      // Agregar interacción al ticket existente
      await this.addInteraction(existingTicket.ticket_id, {
        tipo: InteractionType.MENSAJE,
        contenido: data.mensaje,
        numero_origen: data.numero,
      });
      return existingTicket;
    }

    // Crear nuevo ticket
    const ticket = this.ticketRepository.create({
      ticket_number: await this.generateTicketNumber(),
      channel: TicketChannel.WHATSAPP,
      description: data.mensaje,
      status: TicketStatus.CREADO,
      paciente_sin_perfil: !data.patient_id,
      patient_id: data.patient_id,
      fecha_hora_creacion_ticket: new Date(),
    });

    const savedTicket = await this.ticketRepository.save(ticket);

    // Registrar primera interacción
    await this.addInteraction(savedTicket.ticket_id, {
      tipo: InteractionType.MENSAJE,
      contenido: data.mensaje,
      numero_origen: data.numero,
    });

    // Registrar cambio de estado
    await this.recordStatusChange(
      savedTicket.ticket_id,
      TicketStatus.CREADO,
      TicketStatus.CREADO,
      'Sistema',
    );

    return savedTicket;
  }

  async createTicketManually(data: {
    channel: TicketChannel;
    description: string;
    patient_id?: string;
    observations?: string;
  }): Promise<Ticket> {
    const ticket = this.ticketRepository.create({
      ticket_number: await this.generateTicketNumber(),
      channel: data.channel,
      description: data.description,
      observations: data.observations,
      status: TicketStatus.CREADO,
      paciente_sin_perfil: !data.patient_id,
      patient_id: data.patient_id,
      fecha_hora_creacion_ticket: new Date(),
    });

    const savedTicket = await this.ticketRepository.save(ticket);

    // Registrar interacción inicial
    await this.addInteraction(savedTicket.ticket_id, {
      tipo: InteractionType.EVENTO,
      contenido: 'Ticket creado manualmente',
      metadata: { creado_por: 'operador' },
    });

    await this.recordStatusChange(
      savedTicket.ticket_id,
      TicketStatus.CREADO,
      TicketStatus.CREADO,
      'Sistema',
    );

    return savedTicket;
  }

  async createTicketFromCall(data: {
    numero: string;
    duracion_segundos: number;
    patient_id?: string;
  }): Promise<Ticket> {
    const ticket = this.ticketRepository.create({
      ticket_number: await this.generateTicketNumber(),
      channel: TicketChannel.TELEFONICO,
      status: TicketStatus.CREADO,
      paciente_sin_perfil: !data.patient_id,
      patient_id: data.patient_id,
      fecha_hora_creacion_ticket: new Date(),
    });

    const savedTicket = await this.ticketRepository.save(ticket);

    // Registrar interacción de llamada
    await this.addInteraction(savedTicket.ticket_id, {
      tipo: InteractionType.LLAMADA,
      contenido: 'Llamada telefónica',
      numero_origen: data.numero,
      duracion_llamada_segundos: data.duracion_segundos,
    });

    await this.recordStatusChange(
      savedTicket.ticket_id,
      TicketStatus.CREADO,
      TicketStatus.CREADO,
      'Sistema',
    );

    return savedTicket;
  }

  async findOpenTicketByNumber(numero: string): Promise<Ticket | null> {
    return this.ticketRepository
      .createQueryBuilder('ticket')
      .leftJoinAndSelect('ticket.patient', 'patient')
      .where('ticket.status != :status', { status: TicketStatus.CERRADO })
      .andWhere('ticket.status != :fusionado', { fusionado: TicketStatus.FUSIONADO })
      .andWhere(
        `EXISTS (
          SELECT 1 FROM channel_interactions ci 
          WHERE ci.ticket_id = ticket.ticket_id 
          AND ci.numero_origen = :numero
        )`,
        { numero },
      )
      .orderBy('ticket.fecha_hora_creacion_ticket', 'DESC')
      .getOne();
  }

  async addInteraction(
    ticket_id: string,
    data: {
      tipo: InteractionType;
      contenido: string;
      numero_origen?: string;
      numero_destino?: string;
      duracion_llamada_segundos?: number;
      metadata?: any;
    },
  ): Promise<ChannelInteraction> {
    const interaction = this.interactionRepository.create({
      ticket_id,
      ...data,
      fecha_hora: new Date(),
    });

    return this.interactionRepository.save(interaction);
  }

  async updateTicketStatus(
    ticket_id: string,
    newStatus: TicketStatus,
    usuario: string,
    motivo?: string,
  ): Promise<Ticket> {
    const ticket = await this.ticketRepository.findOne({
      where: { ticket_id },
    });

    if (!ticket) {
      throw new NotFoundException(`Ticket ${ticket_id} no encontrado`);
    }

    const oldStatus = ticket.status;
    ticket.status = newStatus;

    // Actualizar timestamps según el estado
    if (newStatus === TicketStatus.ASIGNADO_A_PRESTADOR && !ticket.fecha_hora_asignacion_prestador) {
      ticket.fecha_hora_asignacion_prestador = new Date();
    }
    if (newStatus === TicketStatus.CERRADO && !ticket.fecha_hora_cierre_ticket) {
      ticket.fecha_hora_cierre_ticket = new Date();
    }

    await this.ticketRepository.save(ticket);
    await this.recordStatusChange(ticket_id, oldStatus, newStatus, usuario, motivo);

    return ticket;
  }

  async recordStatusChange(
    ticket_id: string,
    estado_anterior: TicketStatus,
    estado_nuevo: TicketStatus,
    usuario: string,
    motivo?: string,
  ): Promise<TicketStatusHistory> {
    const history = this.statusHistoryRepository.create({
      ticket_id,
      estado_anterior,
      estado_nuevo,
      usuario,
      nombre_sistema: usuario === 'Sistema' ? 'Sistema' : 'Usuario',
      motivo,
    });

    return this.statusHistoryRepository.save(history);
  }

  async findAll(filters?: {
    status?: TicketStatus;
    channel?: TicketChannel;
    patient_id?: string;
  }): Promise<Ticket[]> {
    const query = this.ticketRepository
      .createQueryBuilder('ticket')
      .leftJoinAndSelect('ticket.patient', 'patient')
      .leftJoinAndSelect('ticket.prestador_asignado', 'provider')
      .orderBy('ticket.fecha_hora_creacion_ticket', 'DESC');

    if (filters?.status) {
      query.andWhere('ticket.status = :status', { status: filters.status });
    }
    if (filters?.channel) {
      query.andWhere('ticket.channel = :channel', { channel: filters.channel });
    }
    if (filters?.patient_id) {
      query.andWhere('ticket.patient_id = :patient_id', { patient_id: filters.patient_id });
    }

    return query.getMany();
  }

  async findOne(ticket_id: string): Promise<Ticket> {
    const ticket = await this.ticketRepository.findOne({
      where: { ticket_id },
      relations: ['patient', 'prestador_asignado', 'interactions', 'status_history'],
    });

    if (!ticket) {
      throw new NotFoundException(`Ticket ${ticket_id} no encontrado`);
    }

    return ticket;
  }

  async updateTicket(
    ticket_id: string,
    updates: {
      description?: string;
      observations?: string;
      patient_id?: string;
    },
  ): Promise<Ticket> {
    const ticket = await this.findOne(ticket_id);
    
    Object.assign(ticket, updates);
    
    return this.ticketRepository.save(ticket);
  }

  async mergeTickets(ticket_principal_id: string, tickets_secundarios_ids: string[]): Promise<Ticket> {
    const ticketPrincipal = await this.findOne(ticket_principal_id);

    for (const ticketId of tickets_secundarios_ids) {
      const ticketSecundario = await this.findOne(ticketId);
      
      // Mover interacciones
      await this.interactionRepository.update(
        { ticket_id: ticketId },
        { ticket_id: ticket_principal_id },
      );

      // Marcar como fusionado
      await this.updateTicketStatus(
        ticketId,
        TicketStatus.FUSIONADO,
        'Sistema',
        `Fusionado con ticket ${ticketPrincipal.ticket_number}`,
      );
    }

    return this.findOne(ticket_principal_id);
  }

  async assignProvider(
    ticket_id: string,
    provider_id: string,
    usuario: string,
    justificacion?: string,
    es_red?: boolean,
  ): Promise<Ticket> {
    const ticket = await this.findOne(ticket_id);

    // Si ya tenía un prestador asignado, registrar la reasignación
    if (ticket.prestador_asignado_id) {
      await this.addInteraction(ticket_id, {
        tipo: InteractionType.EVENTO,
        contenido: `Prestador reasignado de ${ticket.prestador_asignado_id} a ${provider_id}`,
        metadata: { 
          prestador_anterior: ticket.prestador_asignado_id,
          prestador_nuevo: provider_id,
          usuario,
          justificacion,
        },
      });
    }

    ticket.prestador_asignado_id = provider_id;
    
    // Si es prestador de red, guardar justificación obligatoria
    if (es_red && justificacion) {
      ticket.justificacion_asignacion = justificacion;
    }

    // Actualizar timestamp de asignación si es la primera vez
    if (!ticket.fecha_hora_asignacion_prestador) {
      ticket.fecha_hora_asignacion_prestador = new Date();
    }

    // Cambiar estado a Asignado_a_prestador si aún está en Creado o En_gestion
    if (ticket.status === TicketStatus.CREADO || ticket.status === TicketStatus.EN_GESTION) {
      await this.updateTicketStatus(
        ticket_id,
        TicketStatus.ASIGNADO_A_PRESTADOR,
        usuario,
        justificacion || 'Prestador asignado',
      );
    }

    return this.ticketRepository.save(ticket);
  }

  async reassignProvider(
    ticket_id: string,
    new_provider_id: string,
    usuario: string,
    motivo: string,
  ): Promise<Ticket> {
    return this.assignProvider(ticket_id, new_provider_id, usuario, motivo);
  }
}

