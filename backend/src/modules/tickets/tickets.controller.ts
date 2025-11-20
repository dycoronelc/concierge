import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { Ticket, TicketStatus, TicketChannel } from '../../entities/ticket.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('tickets')
@UseGuards(JwtAuthGuard)
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post('whatsapp')
  async createFromWhatsApp(@Body() data: {
    numero: string;
    mensaje: string;
    patient_id?: string;
  }): Promise<Ticket> {
    return this.ticketsService.createTicketFromWhatsApp(data);
  }

  @Post('call')
  async createFromCall(@Body() data: {
    numero: string;
    duracion_segundos: number;
    patient_id?: string;
  }): Promise<Ticket> {
    return this.ticketsService.createTicketFromCall(data);
  }

  @Post()
  async createManually(@Body() data: {
    channel: TicketChannel;
    description: string;
    patient_id?: string;
    observations?: string;
  }): Promise<Ticket> {
    return this.ticketsService.createTicketManually(data);
  }

  @Get()
  async findAll(
    @Query('status') status?: TicketStatus,
    @Query('channel') channel?: TicketChannel,
    @Query('patient_id') patient_id?: string,
  ): Promise<Ticket[]> {
    return this.ticketsService.findAll({ status, channel, patient_id });
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Ticket> {
    return this.ticketsService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updates: {
      description?: string;
      observations?: string;
      patient_id?: string;
    },
  ): Promise<Ticket> {
    return this.ticketsService.updateTicket(id, updates);
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() data: {
      status: TicketStatus;
      usuario: string;
      motivo?: string;
    },
  ): Promise<Ticket> {
    return this.ticketsService.updateTicketStatus(
      id,
      data.status,
      data.usuario,
      data.motivo,
    );
  }

  @Post(':id/merge')
  async mergeTickets(
    @Param('id') ticket_principal_id: string,
    @Body() data: { tickets_secundarios_ids: string[] },
  ): Promise<Ticket> {
    return this.ticketsService.mergeTickets(
      ticket_principal_id,
      data.tickets_secundarios_ids,
    );
  }

  @Post(':id/assign-provider')
  async assignProvider(
    @Param('id') ticket_id: string,
    @Body() data: {
      provider_id: string;
      usuario: string;
      justificacion?: string;
      es_red?: boolean;
    },
  ): Promise<Ticket> {
    return this.ticketsService.assignProvider(
      ticket_id,
      data.provider_id,
      data.usuario,
      data.justificacion,
      data.es_red,
    );
  }

  @Post(':id/reassign-provider')
  async reassignProvider(
    @Param('id') ticket_id: string,
    @Body() data: {
      new_provider_id: string;
      usuario: string;
      motivo: string;
    },
  ): Promise<Ticket> {
    return this.ticketsService.reassignProvider(
      ticket_id,
      data.new_provider_id,
      data.usuario,
      data.motivo,
    );
  }
}

