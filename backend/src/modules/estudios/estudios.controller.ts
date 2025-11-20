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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EstudiosService } from './estudios.service';

@Controller('estudios')
@UseGuards(JwtAuthGuard)
export class EstudiosController {
  constructor(private readonly estudiosService: EstudiosService) {}

  @Post('solicitudes')
  async createSolicitud(@Body() data: any, @Request() req) {
    return await this.estudiosService.createSolicitud({
      ...data,
      solicitado_por_id: req.user.user_id,
    });
  }

  @Get('solicitudes')
  async findAll(@Query() params: any) {
    return await this.estudiosService.findAll(params);
  }

  @Get('solicitudes/:id')
  async findOne(@Param('id') id: string) {
    return await this.estudiosService.findOne(id);
  }

  @Put('solicitudes/:id/asignar')
  async asignarTecnico(
    @Param('id') id: string,
    @Body() data: { tecnico_id: string },
  ) {
    return await this.estudiosService.asignarTecnico(id, data.tecnico_id);
  }

  @Put('solicitudes/:id/toma-muestra')
  async registrarTomaMuestra(
    @Param('id') id: string,
    @Body() data: { cadena_custodia: string },
  ) {
    return await this.estudiosService.registrarTomaMuestra(id, data.cadena_custodia);
  }

  @Post('resultados')
  async registrarResultado(@Body() data: any, @Request() req) {
    return await this.estudiosService.registrarResultado({
      ...data,
      revisado_por_id: req.user.user_id,
    });
  }

  @Get('resultados/evento/:evento_id')
  async getResultadosPorEvento(@Param('evento_id') evento_id: string) {
    return await this.estudiosService.getResultadosPorEvento(evento_id);
  }

  @Get('resultados/patient/:patient_id')
  async getResultadosPorPaciente(@Param('patient_id') patient_id: string) {
    return await this.estudiosService.getResultadosPorPaciente(patient_id);
  }
}

