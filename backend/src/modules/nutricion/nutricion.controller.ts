import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NutricionService } from './nutricion.service';
import { EvaluacionNutricional } from '../../entities/evaluacion-nutricional.entity';
import { PlanNutricional, EstadoPlanNutricional } from '../../entities/plan-nutricional.entity';
import { SeguimientoNutricional } from '../../entities/seguimiento-nutricional.entity';

@Controller('nutricion')
@UseGuards(JwtAuthGuard)
export class NutricionController {
  constructor(private readonly nutricionService: NutricionService) {}

  // ============================================
  // Evaluaciones Nutricionales
  // ============================================

  @Post('evaluaciones')
  async createEvaluacion(@Body() data: any): Promise<EvaluacionNutricional> {
    return await this.nutricionService.createEvaluacion(data);
  }

  @Get('evaluaciones')
  async findAllEvaluaciones(
    @Query('patient_id') patient_id?: string,
    @Query('evento_id') evento_id?: string,
  ): Promise<EvaluacionNutricional[]> {
    return await this.nutricionService.findAllEvaluaciones({ patient_id, evento_id });
  }

  @Get('evaluaciones/:id')
  async findOneEvaluacion(@Param('id') id: string): Promise<EvaluacionNutricional> {
    return await this.nutricionService.findOneEvaluacion(id);
  }

  // ============================================
  // Planes Nutricionales
  // ============================================

  @Post('planes')
  async createPlan(@Body() data: any): Promise<PlanNutricional> {
    return await this.nutricionService.createPlan(data);
  }

  @Get('planes')
  async findAllPlanes(
    @Query('patient_id') patient_id?: string,
    @Query('estado') estado?: string,
    @Query('evaluacion_id') evaluacion_id?: string,
  ): Promise<PlanNutricional[]> {
    return await this.nutricionService.findAllPlanes({ patient_id, estado, evaluacion_id });
  }

  @Get('planes/:id')
  async findOnePlan(@Param('id') id: string): Promise<PlanNutricional> {
    return await this.nutricionService.findOnePlan(id);
  }

  @Put('planes/:id')
  async updatePlan(@Param('id') id: string, @Body() updates: any): Promise<PlanNutricional> {
    return await this.nutricionService.updatePlan(id, updates);
  }

  @Put('planes/:id/estado')
  async updatePlanEstado(
    @Param('id') id: string,
    @Body('estado') estado: EstadoPlanNutricional,
  ): Promise<PlanNutricional> {
    return await this.nutricionService.updatePlanEstado(id, estado);
  }

  // ============================================
  // Seguimiento Nutricional
  // ============================================

  @Post('seguimientos')
  async createSeguimiento(@Body() data: any): Promise<SeguimientoNutricional> {
    return await this.nutricionService.createSeguimiento(data);
  }

  @Get('seguimientos')
  async findAllSeguimientos(
    @Query('plan_id') plan_id?: string,
    @Query('patient_id') patient_id?: string,
    @Query('alerta_retroceso') alerta_retroceso?: string,
  ): Promise<SeguimientoNutricional[]> {
    // Convertir string a boolean si viene como query param
    let alertaRetrocesoBool: boolean | undefined = undefined;
    if (alerta_retroceso !== undefined && alerta_retroceso !== '') {
      alertaRetrocesoBool = alerta_retroceso === 'true' || alerta_retroceso === '1';
    }
    
    return await this.nutricionService.findAllSeguimientos({
      plan_id,
      patient_id,
      alerta_retroceso: alertaRetrocesoBool,
    });
  }

  @Get('seguimientos/:id')
  async findOneSeguimiento(@Param('id') id: string): Promise<SeguimientoNutricional> {
    return await this.nutricionService.findOneSeguimiento(id);
  }

  @Get('seguimientos/alertas')
  async getSeguimientosConAlertas(@Query('patient_id') patient_id?: string): Promise<SeguimientoNutricional[]> {
    return await this.nutricionService.getSeguimientosConAlertas(patient_id);
  }
}

