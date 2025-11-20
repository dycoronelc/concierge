import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EvaluacionNutricional, NivelActividadFisica } from '../../entities/evaluacion-nutricional.entity';
import { PlanNutricional, EstadoPlanNutricional, FrecuenciaRecordatorios } from '../../entities/plan-nutricional.entity';
import { SeguimientoNutricional, NivelEnergia, AdherenciaPlan } from '../../entities/seguimiento-nutricional.entity';
import { Patient } from '../../entities/patient.entity';
import { User } from '../../entities/user.entity';

@Injectable()
export class NutricionService {
  constructor(
    @InjectRepository(EvaluacionNutricional)
    private evaluacionRepo: Repository<EvaluacionNutricional>,
    @InjectRepository(PlanNutricional)
    private planRepo: Repository<PlanNutricional>,
    @InjectRepository(SeguimientoNutricional)
    private seguimientoRepo: Repository<SeguimientoNutricional>,
    @InjectRepository(Patient)
    private patientRepo: Repository<Patient>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  // ============================================
  // Evaluaciones Nutricionales
  // ============================================

  async createEvaluacion(data: {
    patient_id: string;
    evento_id?: string;
    ticket_id?: string;
    nutriologo_asignado_id?: string;
    peso_kg?: number;
    talla_cm?: number;
    imc?: number;
    circunferencia_cintura_cm?: number;
    porcentaje_grasa_corporal?: number;
    nivel_actividad_fisica?: string;
    alergias_alimentarias?: string[];
    restricciones_dieteticas?: string[];
    preferencias_alimentarias?: string[];
    enfermedades_cronicas?: string[];
    medicamentos_actuales?: string[];
    objetivos_nutricionales?: string;
    notas_evaluacion?: string;
    reportes_previos_urls?: string[];
    evaluado_por_id: string;
  }): Promise<EvaluacionNutricional> {
    const patient = await this.patientRepo.findOne({ where: { patient_id: data.patient_id } });
    if (!patient) {
      throw new NotFoundException('Paciente no encontrado');
    }

    const evaluadoPor = await this.userRepo.findOne({ where: { user_id: data.evaluado_por_id } });
    if (!evaluadoPor) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Calcular IMC si se proporciona peso y talla
    let imcCalculado = data.imc;
    if (data.peso_kg && data.talla_cm && !imcCalculado) {
      const tallaMetros = data.talla_cm / 100;
      imcCalculado = parseFloat((data.peso_kg / (tallaMetros * tallaMetros)).toFixed(2));
    }

    const evaluacion = this.evaluacionRepo.create({
      patient_id: data.patient_id,
      evento_id: data.evento_id,
      ticket_id: data.ticket_id,
      nutriologo_asignado_id: data.nutriologo_asignado_id,
      peso_kg: data.peso_kg,
      talla_cm: data.talla_cm,
      imc: imcCalculado,
      circunferencia_cintura_cm: data.circunferencia_cintura_cm,
      porcentaje_grasa_corporal: data.porcentaje_grasa_corporal,
      nivel_actividad_fisica: data.nivel_actividad_fisica as NivelActividadFisica,
      alergias_alimentarias: data.alergias_alimentarias || [],
      restricciones_dieteticas: data.restricciones_dieteticas || [],
      preferencias_alimentarias: data.preferencias_alimentarias || [],
      enfermedades_cronicas: data.enfermedades_cronicas || [],
      medicamentos_actuales: data.medicamentos_actuales || [],
      objetivos_nutricionales: data.objetivos_nutricionales,
      notas_evaluacion: data.notas_evaluacion,
      reportes_previos_urls: data.reportes_previos_urls || [],
      evaluado_por_id: data.evaluado_por_id,
    });

    return await this.evaluacionRepo.save(evaluacion);
  }

  async findAllEvaluaciones(params?: { patient_id?: string; evento_id?: string }): Promise<EvaluacionNutricional[]> {
    const query = this.evaluacionRepo
      .createQueryBuilder('evaluacion')
      .leftJoinAndSelect('evaluacion.patient', 'patient')
      .leftJoinAndSelect('evaluacion.nutriologo_asignado', 'nutriologo')
      .leftJoinAndSelect('evaluacion.evaluado_por', 'evaluado_por')
      .leftJoinAndSelect('evaluacion.evento', 'evento');

    if (params?.patient_id) {
      query.where('evaluacion.patient_id = :patient_id', { patient_id: params.patient_id });
    }

    if (params?.evento_id) {
      query.andWhere('evaluacion.evento_id = :evento_id', { evento_id: params.evento_id });
    }

    return await query.orderBy('evaluacion.fecha_evaluacion', 'DESC').getMany();
  }

  async findOneEvaluacion(id: string): Promise<EvaluacionNutricional> {
    const evaluacion = await this.evaluacionRepo.findOne({
      where: { evaluacion_id: id },
      relations: ['patient', 'nutriologo_asignado', 'evaluado_por', 'evento', 'ticket'],
    });

    if (!evaluacion) {
      throw new NotFoundException('Evaluación nutricional no encontrada');
    }

    return evaluacion;
  }

  // ============================================
  // Planes Nutricionales
  // ============================================

  async createPlan(data: {
    evaluacion_id: string;
    patient_id: string;
    nutriologo_asignado_id: string;
    nombre_plan: string;
    descripcion?: string;
    fecha_inicio: Date;
    fecha_fin?: Date;
    calorias_diarias?: number;
    proteinas_g?: number;
    carbohidratos_g?: number;
    grasas_g?: number;
    fibra_g?: number;
    plan_semanal?: any;
    recomendaciones?: string[];
    notificaciones_habilitadas?: boolean;
    frecuencia_recordatorios?: string;
    creado_por_id: string;
  }): Promise<PlanNutricional> {
    const evaluacion = await this.evaluacionRepo.findOne({ where: { evaluacion_id: data.evaluacion_id } });
    if (!evaluacion) {
      throw new NotFoundException('Evaluación nutricional no encontrada');
    }

    const patient = await this.patientRepo.findOne({ where: { patient_id: data.patient_id } });
    if (!patient) {
      throw new NotFoundException('Paciente no encontrado');
    }

    const nutriologo = await this.userRepo.findOne({ where: { user_id: data.nutriologo_asignado_id } });
    if (!nutriologo) {
      throw new NotFoundException('Nutriólogo no encontrado');
    }

    const creadoPor = await this.userRepo.findOne({ where: { user_id: data.creado_por_id } });
    if (!creadoPor) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const plan = this.planRepo.create({
      evaluacion_id: data.evaluacion_id,
      patient_id: data.patient_id,
      nutriologo_asignado_id: data.nutriologo_asignado_id,
      nombre_plan: data.nombre_plan,
      descripcion: data.descripcion,
      fecha_inicio: data.fecha_inicio,
      fecha_fin: data.fecha_fin,
      calorias_diarias: data.calorias_diarias,
      proteinas_g: data.proteinas_g,
      carbohidratos_g: data.carbohidratos_g,
      grasas_g: data.grasas_g,
      fibra_g: data.fibra_g,
      plan_semanal: data.plan_semanal,
      recomendaciones: data.recomendaciones || [],
      estado: EstadoPlanNutricional.ACTIVO,
      notificaciones_habilitadas: data.notificaciones_habilitadas ?? true,
      frecuencia_recordatorios: (data.frecuencia_recordatorios as FrecuenciaRecordatorios) || FrecuenciaRecordatorios.DIARIO,
      creado_por_id: data.creado_por_id,
    });

    return await this.planRepo.save(plan);
  }

  async findAllPlanes(params?: { patient_id?: string; estado?: string; evaluacion_id?: string }): Promise<PlanNutricional[]> {
    const query = this.planRepo
      .createQueryBuilder('plan')
      .leftJoinAndSelect('plan.patient', 'patient')
      .leftJoinAndSelect('plan.nutriologo_asignado', 'nutriologo')
      .leftJoinAndSelect('plan.evaluacion', 'evaluacion')
      .leftJoinAndSelect('plan.creado_por', 'creado_por');

    if (params?.patient_id) {
      query.where('plan.patient_id = :patient_id', { patient_id: params.patient_id });
    }

    if (params?.estado) {
      query.andWhere('plan.estado = :estado', { estado: params.estado });
    }

    if (params?.evaluacion_id) {
      query.andWhere('plan.evaluacion_id = :evaluacion_id', { evaluacion_id: params.evaluacion_id });
    }

    return await query.orderBy('plan.fecha_inicio', 'DESC').getMany();
  }

  async findOnePlan(id: string): Promise<PlanNutricional> {
    const plan = await this.planRepo.findOne({
      where: { plan_id: id },
      relations: ['patient', 'nutriologo_asignado', 'evaluacion', 'creado_por', 'seguimientos'],
    });

    if (!plan) {
      throw new NotFoundException('Plan nutricional no encontrado');
    }

    return plan;
  }

  async updatePlan(id: string, updates: Partial<PlanNutricional>): Promise<PlanNutricional> {
    const plan = await this.findOnePlan(id);
    Object.assign(plan, updates);
    return await this.planRepo.save(plan);
  }

  async updatePlanEstado(id: string, estado: EstadoPlanNutricional): Promise<PlanNutricional> {
    const plan = await this.findOnePlan(id);
    plan.estado = estado;
    return await this.planRepo.save(plan);
  }

  // ============================================
  // Seguimiento Nutricional
  // ============================================

  async createSeguimiento(data: {
    plan_id: string;
    patient_id: string;
    fecha_seguimiento?: Date;
    peso_kg?: number;
    sintomas?: string[];
    nivel_energia?: string;
    adherencia_plan?: string;
    observaciones?: string;
    registrado_por_id?: string;
  }): Promise<SeguimientoNutricional> {
    const plan = await this.planRepo.findOne({ where: { plan_id: data.plan_id } });
    if (!plan) {
      throw new NotFoundException('Plan nutricional no encontrado');
    }

    const patient = await this.patientRepo.findOne({ where: { patient_id: data.patient_id } });
    if (!patient) {
      throw new NotFoundException('Paciente no encontrado');
    }

    // Verificar si hay retroceso (peso aumenta significativamente o adherencia baja)
    let alertaRetroceso = false;
    let motivoAlerta = '';

    if (data.peso_kg && plan.evaluacion) {
      const evaluacion = await this.evaluacionRepo.findOne({ where: { evaluacion_id: plan.evaluacion_id } });
      if (evaluacion && evaluacion.peso_kg) {
        const diferenciaPeso = data.peso_kg - evaluacion.peso_kg;
        // Si el objetivo es bajar de peso y subió más de 2kg, alerta
        if (diferenciaPeso > 2) {
          alertaRetroceso = true;
          motivoAlerta = `Aumento de peso significativo: +${diferenciaPeso.toFixed(2)} kg`;
        }
      }
    }

    if (data.adherencia_plan === AdherenciaPlan.BAJA) {
      alertaRetroceso = true;
      motivoAlerta = motivoAlerta
        ? `${motivoAlerta}. Adherencia al plan: Baja`
        : 'Adherencia al plan: Baja';
    }

    const seguimiento = this.seguimientoRepo.create({
      plan_id: data.plan_id,
      patient_id: data.patient_id,
      fecha_seguimiento: data.fecha_seguimiento || new Date(),
      peso_kg: data.peso_kg,
      sintomas: data.sintomas || [],
      nivel_energia: data.nivel_energia as NivelEnergia,
      adherencia_plan: data.adherencia_plan as AdherenciaPlan,
      observaciones: data.observaciones,
      alerta_retroceso: alertaRetroceso,
      motivo_alerta: motivoAlerta || null,
      registrado_por_id: data.registrado_por_id,
    });

    return await this.seguimientoRepo.save(seguimiento);
  }

  async findAllSeguimientos(params?: { plan_id?: string; patient_id?: string; alerta_retroceso?: boolean }): Promise<SeguimientoNutricional[]> {
    try {
      const query = this.seguimientoRepo
        .createQueryBuilder('seguimiento')
        .leftJoinAndSelect('seguimiento.plan', 'plan')
        .leftJoinAndSelect('seguimiento.patient', 'patient')
        .leftJoinAndSelect('seguimiento.registrado_por', 'registrado_por');

      const conditions: string[] = [];
      const queryParams: any = {};

      if (params?.plan_id) {
        conditions.push('seguimiento.plan_id = :plan_id');
        queryParams.plan_id = params.plan_id;
      }

      if (params?.patient_id) {
        conditions.push('seguimiento.patient_id = :patient_id');
        queryParams.patient_id = params.patient_id;
      }

      if (params?.alerta_retroceso !== undefined) {
        conditions.push('seguimiento.alerta_retroceso = :alerta_retroceso');
        queryParams.alerta_retroceso = params.alerta_retroceso === true;
      }

      if (conditions.length > 0) {
        query.where(conditions.join(' AND '), queryParams);
      }

      return await query.orderBy('seguimiento.fecha_seguimiento', 'DESC').getMany();
    } catch (error) {
      console.error('Error en findAllSeguimientos:', error);
      throw new BadRequestException(`Error al obtener seguimientos: ${error.message}`);
    }
  }

  async findOneSeguimiento(id: string): Promise<SeguimientoNutricional> {
    const seguimiento = await this.seguimientoRepo.findOne({
      where: { seguimiento_id: id },
      relations: ['plan', 'patient', 'registrado_por'],
    });

    if (!seguimiento) {
      throw new NotFoundException('Seguimiento nutricional no encontrado');
    }

    return seguimiento;
  }

  async getSeguimientosConAlertas(patient_id?: string): Promise<SeguimientoNutricional[]> {
    try {
      const seguimientos = await this.findAllSeguimientos({ alerta_retroceso: true, patient_id });
      return seguimientos || [];
    } catch (error) {
      console.error('Error en getSeguimientosConAlertas:', error);
      throw new BadRequestException(`Error al obtener seguimientos con alertas: ${error.message}`);
    }
  }
}

