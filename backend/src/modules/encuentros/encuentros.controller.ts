import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EncuentrosService } from './encuentros.service';
import { Encuentro, TipoEncuentro, EstadoEncuentro } from '../../entities/encuentro.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('encuentros')
@UseGuards(JwtAuthGuard)
export class EncuentrosController {
  constructor(private readonly encuentrosService: EncuentrosService) {}

  @Post()
  async create(
    @Body() data: {
      evento_id: string;
      ticket_id?: string;
      prestador_id?: string;
      tipo_encuentro: TipoEncuentro;
      fecha_programada?: string;
      notas?: string;
    },
  ): Promise<Encuentro> {
    return this.encuentrosService.create({
      ...data,
      fecha_programada: data.fecha_programada ? new Date(data.fecha_programada) : undefined,
    });
  }

  @Get()
  async findAll(
    @Query('evento_id') evento_id?: string,
    @Query('ticket_id') ticket_id?: string,
    @Query('prestador_id') prestador_id?: string,
    @Query('estado') estado?: EstadoEncuentro,
  ): Promise<Encuentro[]> {
    return this.encuentrosService.findAll({ evento_id, ticket_id, prestador_id, estado });
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Encuentro> {
    return this.encuentrosService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updates: {
      prestador_id?: string;
      tipo_encuentro?: TipoEncuentro;
      estado?: EstadoEncuentro;
      fecha_programada?: string;
      fecha_real?: string;
      resultado?: string;
      notas?: string;
    },
  ): Promise<Encuentro> {
    return this.encuentrosService.update(id, {
      ...updates,
      fecha_programada: updates.fecha_programada ? new Date(updates.fecha_programada) : undefined,
      fecha_real: updates.fecha_real ? new Date(updates.fecha_real) : undefined,
    });
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    await this.encuentrosService.delete(id);
    return { message: 'Encuentro eliminado correctamente' };
  }
}

