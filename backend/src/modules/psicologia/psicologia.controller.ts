import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PsicologiaService } from './psicologia.service';
import { ConsultaPsicologica } from '../../entities/consulta-psicologica.entity';
import { SesionPsicologica } from '../../entities/sesion-psicologica.entity';
import { SeguimientoEmocional } from '../../entities/seguimiento-emocional.entity';
import { FamiliarCuidador } from '../../entities/familiar-cuidador.entity';

@Controller('psicologia')
@UseGuards(JwtAuthGuard)
export class PsicologiaController {
  constructor(private readonly psicologiaService: PsicologiaService) {}

  // ============================================
  // Consultas Psicológicas
  // ============================================

  @Post('consultas')
  async createConsulta(@Body() data: any): Promise<ConsultaPsicologica> {
    return await this.psicologiaService.createConsulta(data);
  }

  @Get('consultas')
  async findAllConsultas(
    @Query('patient_id') patient_id?: string,
    @Query('psicologo_id') psicologo_id?: string,
    @Query('estado') estado?: string,
    @Query('tipo_consulta') tipo_consulta?: string,
  ): Promise<ConsultaPsicologica[]> {
    return await this.psicologiaService.findAllConsultas({ patient_id, psicologo_id, estado, tipo_consulta });
  }

  @Get('consultas/:id')
  async findOneConsulta(@Param('id') id: string): Promise<ConsultaPsicologica> {
    return await this.psicologiaService.findOneConsulta(id);
  }

  @Put('consultas/:id')
  async updateConsulta(@Param('id') id: string, @Body() updates: any): Promise<ConsultaPsicologica> {
    return await this.psicologiaService.updateConsulta(id, updates);
  }

  // ============================================
  // Sesiones Psicológicas
  // ============================================

  @Post('sesiones')
  async createSesion(@Body() data: any): Promise<SesionPsicologica> {
    return await this.psicologiaService.createSesion(data);
  }

  @Get('sesiones')
  async findAllSesiones(
    @Query('consulta_id') consulta_id?: string,
    @Query('patient_id') patient_id?: string,
    @Query('psicologo_id') psicologo_id?: string,
    @Query('estado') estado?: string,
    @Query('tipo_sesion') tipo_sesion?: string,
  ): Promise<SesionPsicologica[]> {
    return await this.psicologiaService.findAllSesiones({ consulta_id, patient_id, psicologo_id, estado, tipo_sesion });
  }

  @Get('sesiones/:id')
  async findOneSesion(@Param('id') id: string): Promise<SesionPsicologica> {
    return await this.psicologiaService.findOneSesion(id);
  }

  @Put('sesiones/:id')
  async updateSesion(@Param('id') id: string, @Body() updates: any): Promise<SesionPsicologica> {
    return await this.psicologiaService.updateSesion(id, updates);
  }

  // ============================================
  // Seguimiento Emocional
  // ============================================

  @Post('seguimientos')
  async createSeguimiento(@Body() data: any): Promise<SeguimientoEmocional> {
    return await this.psicologiaService.createSeguimientoEmocional(data);
  }

  @Get('seguimientos')
  async findAllSeguimientos(
    @Query('patient_id') patient_id?: string,
    @Query('sesion_id') sesion_id?: string,
    @Query('alerta_critica') alerta_critica?: string,
  ): Promise<SeguimientoEmocional[]> {
    // Convertir string a boolean si viene como query param
    let alertaCriticaBool: boolean | undefined = undefined;
    if (alerta_critica !== undefined && alerta_critica !== '') {
      alertaCriticaBool = alerta_critica === 'true' || alerta_critica === '1';
    }
    
    return await this.psicologiaService.findAllSeguimientosEmocionales({
      patient_id,
      sesion_id,
      alerta_critica: alertaCriticaBool,
    });
  }

  @Get('seguimientos/:id')
  async findOneSeguimiento(@Param('id') id: string): Promise<SeguimientoEmocional> {
    return await this.psicologiaService.findOneSeguimientoEmocional(id);
  }

  @Get('seguimientos/alertas')
  async getSeguimientosConAlertas(@Query('patient_id') patient_id?: string): Promise<SeguimientoEmocional[]> {
    return await this.psicologiaService.getSeguimientosConAlertas(patient_id);
  }

  // ============================================
  // Familiares y Cuidadores
  // ============================================

  @Post('familiares')
  async createFamiliar(@Body() data: any): Promise<FamiliarCuidador> {
    return await this.psicologiaService.createFamiliar(data);
  }

  @Get('familiares')
  async findAllFamiliares(@Query('patient_id') patient_id: string): Promise<FamiliarCuidador[]> {
    return await this.psicologiaService.findAllFamiliares(patient_id);
  }

  @Get('familiares/:id')
  async findOneFamiliar(@Param('id') id: string): Promise<FamiliarCuidador> {
    return await this.psicologiaService.findOneFamiliar(id);
  }

  @Put('familiares/:id')
  async updateFamiliar(@Param('id') id: string, @Body() updates: any): Promise<FamiliarCuidador> {
    return await this.psicologiaService.updateFamiliar(id, updates);
  }

  @Delete('familiares/:id')
  async deleteFamiliar(@Param('id') id: string): Promise<void> {
    return await this.psicologiaService.deleteFamiliar(id);
  }
}

