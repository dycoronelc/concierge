import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { EventosService } from './eventos.service';
import { Evento, EstadoEvento, SeveridadEvento } from '../../entities/evento.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('eventos')
@UseGuards(JwtAuthGuard)
export class EventosController {
  constructor(private readonly eventosService: EventosService) {}

  @Post()
  async create(
    @Body() data: {
      patient_id: string;
      diagnostico_icd_id?: string;
      severidad?: SeveridadEvento;
      categoria?: string;
      diagnostico_preliminar?: boolean;
      notas_clinicas?: string;
    },
    @Request() req: any,
  ): Promise<Evento> {
    return this.eventosService.create({
      ...data,
      creado_por: req.user?.username || 'Usuario',
    });
  }

  @Get()
  async findAll(
    @Query('patient_id') patient_id?: string,
    @Query('estado_evento') estado_evento?: EstadoEvento,
    @Query('diagnostico_icd_id') diagnostico_icd_id?: string,
  ): Promise<Evento[]> {
    return this.eventosService.findAll({ patient_id, estado_evento, diagnostico_icd_id });
  }

  @Get('historial/:patient_id')
  async getHistorialClinico(@Param('patient_id') patient_id: string): Promise<Evento[]> {
    return this.eventosService.getHistorialClinico(patient_id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Evento> {
    return this.eventosService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updates: {
      diagnostico_icd_id?: string;
      severidad?: SeveridadEvento;
      categoria?: string;
      estado_evento?: EstadoEvento;
      validado_por?: string;
      diagnostico_preliminar?: boolean;
      notas_clinicas?: string;
    },
    @Request() req: any,
  ): Promise<Evento> {
    if (updates.validado_por === undefined && updates.diagnostico_preliminar === false) {
      updates.validado_por = req.user?.username || 'Usuario';
    }
    return this.eventosService.update(id, updates);
  }

  @Put(':id/close')
  async closeEvento(
    @Param('id') id: string,
    @Body() data: { motivo?: string },
    @Request() req: any,
  ): Promise<Evento> {
    return this.eventosService.closeEvento(id, req.user?.username || 'Usuario', data.motivo);
  }
}

