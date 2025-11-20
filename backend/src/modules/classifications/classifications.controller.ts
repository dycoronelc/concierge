import { Controller, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ClassificationsService } from './classifications.service';
import { TicketCategory } from '../../entities/ticket.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('classifications')
@UseGuards(JwtAuthGuard)
export class ClassificationsController {
  constructor(private readonly classificationsService: ClassificationsService) {}

  @Post(':ticket_id')
  async classify(
    @Param('ticket_id') ticket_id: string,
    @Body() data: { description: string },
  ) {
    return this.classificationsService.classifyTicket(ticket_id, data.description);
  }

  @Put(':ticket_id')
  async updateClassification(
    @Param('ticket_id') ticket_id: string,
    @Body() data: {
      categoria: TicketCategory;
      usuario: string;
      motivo?: string;
    },
  ) {
    return this.classificationsService.updateClassification(
      ticket_id,
      data.categoria,
      data.usuario,
      data.motivo,
    );
  }
}

