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
import { EnfermeriaService } from './enfermeria.service';

@Controller('enfermeria')
@UseGuards(JwtAuthGuard)
export class EnfermeriaController {
  constructor(private readonly enfermeriaService: EnfermeriaService) {}

  @Post('servicios')
  async createServicio(@Body() data: any, @Request() req) {
    return await this.enfermeriaService.createServicio({
      ...data,
      creado_por_id: req.user.user_id,
    });
  }

  @Get('servicios')
  async findAll(@Query() params: any) {
    return await this.enfermeriaService.findAll(params);
  }

  @Get('servicios/:id')
  async findOne(@Param('id') id: string) {
    return await this.enfermeriaService.findOne(id);
  }

  @Put('servicios/:id/asignar')
  async asignarEnfermero(
    @Param('id') id: string,
    @Body() data: { enfermero_id: string },
  ) {
    return await this.enfermeriaService.asignarEnfermero(id, data.enfermero_id);
  }

  @Put('servicios/:id/completar')
  async completarVisita(
    @Param('id') id: string,
    @Body() data: { notas: string },
  ) {
    return await this.enfermeriaService.completarVisita(id, data.notas);
  }

  @Post('medicamentos')
  async registrarMedicamento(@Body() data: any, @Request() req) {
    return await this.enfermeriaService.registrarMedicamento({
      ...data,
      responsable_id: req.user.user_id,
    });
  }

  @Get('medicamentos/patient/:patient_id')
  async getMedicamentosPorPaciente(@Param('patient_id') patient_id: string) {
    return await this.enfermeriaService.getMedicamentosPorPaciente(patient_id);
  }
}

