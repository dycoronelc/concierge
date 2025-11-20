import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ConsultaPsicologica,
  TipoConsulta,
  ModalidadConsulta,
  EstadoConsulta,
} from '../../entities/consulta-psicologica.entity';
import {
  SesionPsicologica,
  TipoSesion,
  EstadoSesion,
} from '../../entities/sesion-psicologica.entity';
import {
  SeguimientoEmocional,
  EstadoAnimo,
} from '../../entities/seguimiento-emocional.entity';
import { FamiliarCuidador } from '../../entities/familiar-cuidador.entity';
import { Patient } from '../../entities/patient.entity';
import { User } from '../../entities/user.entity';

@Injectable()
export class PsicologiaService {
  constructor(
    @InjectRepository(ConsultaPsicologica)
    private consultaRepo: Repository<ConsultaPsicologica>,
    @InjectRepository(SesionPsicologica)
    private sesionRepo: Repository<SesionPsicologica>,
    @InjectRepository(SeguimientoEmocional)
    private seguimientoRepo: Repository<SeguimientoEmocional>,
    @InjectRepository(FamiliarCuidador)
    private familiarRepo: Repository<FamiliarCuidador>,
    @InjectRepository(Patient)
    private patientRepo: Repository<Patient>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  // ============================================
  // Consultas Psicológicas
  // ============================================

  async createConsulta(data: {
    patient_id: string;
    evento_id?: string;
    ticket_id?: string;
    psicologo_id?: string;
    tipo_consulta: string;
    modalidad: string;
    fecha_programada?: Date;
    disponibilidad_paciente?: string;
    motivo_consulta?: string;
    notas_previas?: string;
    creado_por_id: string;
  }): Promise<ConsultaPsicologica> {
    const patient = await this.patientRepo.findOne({ where: { patient_id: data.patient_id } });
    if (!patient) {
      throw new NotFoundException('Paciente no encontrado');
    }

    const creadoPor = await this.userRepo.findOne({ where: { user_id: data.creado_por_id } });
    if (!creadoPor) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const consulta = this.consultaRepo.create({
      patient_id: data.patient_id,
      evento_id: data.evento_id,
      ticket_id: data.ticket_id,
      psicologo_id: data.psicologo_id,
      tipo_consulta: data.tipo_consulta as TipoConsulta,
      modalidad: data.modalidad as ModalidadConsulta,
      fecha_programada: data.fecha_programada,
      disponibilidad_paciente: data.disponibilidad_paciente,
      motivo_consulta: data.motivo_consulta,
      notas_previas: data.notas_previas,
      estado: EstadoConsulta.SOLICITADA,
      creado_por_id: data.creado_por_id,
    });

    return await this.consultaRepo.save(consulta);
  }

  async findAllConsultas(params?: {
    patient_id?: string;
    psicologo_id?: string;
    estado?: string;
    tipo_consulta?: string;
  }): Promise<ConsultaPsicologica[]> {
    const query = this.consultaRepo
      .createQueryBuilder('consulta')
      .leftJoinAndSelect('consulta.patient', 'patient')
      .leftJoinAndSelect('consulta.psicologo', 'psicologo')
      .leftJoinAndSelect('consulta.creado_por', 'creado_por')
      .leftJoinAndSelect('consulta.evento', 'evento')
      .leftJoinAndSelect('consulta.ticket', 'ticket');

    const conditions: string[] = [];
    const queryParams: any = {};

    if (params?.patient_id) {
      conditions.push('consulta.patient_id = :patient_id');
      queryParams.patient_id = params.patient_id;
    }

    if (params?.psicologo_id) {
      conditions.push('consulta.psicologo_id = :psicologo_id');
      queryParams.psicologo_id = params.psicologo_id;
    }

    if (params?.estado) {
      conditions.push('consulta.estado = :estado');
      queryParams.estado = params.estado;
    }

    if (params?.tipo_consulta) {
      conditions.push('consulta.tipo_consulta = :tipo_consulta');
      queryParams.tipo_consulta = params.tipo_consulta;
    }

    if (conditions.length > 0) {
      query.where(conditions.join(' AND '), queryParams);
    }

    return await query.orderBy('consulta.fecha_solicitud', 'DESC').getMany();
  }

  async findOneConsulta(id: string): Promise<ConsultaPsicologica> {
    const consulta = await this.consultaRepo.findOne({
      where: { consulta_id: id },
      relations: ['patient', 'psicologo', 'creado_por', 'evento', 'ticket', 'sesiones'],
    });

    if (!consulta) {
      throw new NotFoundException('Consulta psicológica no encontrada');
    }

    return consulta;
  }

  async updateConsulta(id: string, updates: Partial<ConsultaPsicologica>): Promise<ConsultaPsicologica> {
    const consulta = await this.findOneConsulta(id);
    Object.assign(consulta, updates);
    return await this.consultaRepo.save(consulta);
  }

  // ============================================
  // Sesiones Psicológicas
  // ============================================

  async createSesion(data: {
    consulta_id: string;
    patient_id: string;
    psicologo_id: string;
    fecha_sesion: Date;
    duracion_minutos?: number;
    tipo_sesion?: string;
    participantes?: string[];
    resumen_sesion?: string;
    observaciones?: string;
    plan_tratamiento?: string;
    proxima_sesion_programada?: Date;
  }): Promise<SesionPsicologica> {
    const consulta = await this.consultaRepo.findOne({ where: { consulta_id: data.consulta_id } });
    if (!consulta) {
      throw new NotFoundException('Consulta psicológica no encontrada');
    }

    const patient = await this.patientRepo.findOne({ where: { patient_id: data.patient_id } });
    if (!patient) {
      throw new NotFoundException('Paciente no encontrado');
    }

    const psicologo = await this.userRepo.findOne({ where: { user_id: data.psicologo_id } });
    if (!psicologo) {
      throw new NotFoundException('Psicólogo no encontrado');
    }

    const sesion = this.sesionRepo.create({
      consulta_id: data.consulta_id,
      patient_id: data.patient_id,
      psicologo_id: data.psicologo_id,
      fecha_sesion: data.fecha_sesion,
      duracion_minutos: data.duracion_minutos || 60,
      tipo_sesion: (data.tipo_sesion as TipoSesion) || TipoSesion.INDIVIDUAL,
      participantes: data.participantes || [],
      resumen_sesion: data.resumen_sesion,
      observaciones: data.observaciones,
      plan_tratamiento: data.plan_tratamiento,
      proxima_sesion_programada: data.proxima_sesion_programada,
      estado: EstadoSesion.PROGRAMADA,
    });

    return await this.sesionRepo.save(sesion);
  }

  async findAllSesiones(params?: {
    consulta_id?: string;
    patient_id?: string;
    psicologo_id?: string;
    estado?: string;
    tipo_sesion?: string;
  }): Promise<SesionPsicologica[]> {
    const query = this.sesionRepo
      .createQueryBuilder('sesion')
      .leftJoinAndSelect('sesion.consulta', 'consulta')
      .leftJoinAndSelect('sesion.patient', 'patient')
      .leftJoinAndSelect('sesion.psicologo', 'psicologo');

    const conditions: string[] = [];
    const queryParams: any = {};

    if (params?.consulta_id) {
      conditions.push('sesion.consulta_id = :consulta_id');
      queryParams.consulta_id = params.consulta_id;
    }

    if (params?.patient_id) {
      conditions.push('sesion.patient_id = :patient_id');
      queryParams.patient_id = params.patient_id;
    }

    if (params?.psicologo_id) {
      conditions.push('sesion.psicologo_id = :psicologo_id');
      queryParams.psicologo_id = params.psicologo_id;
    }

    if (params?.estado) {
      conditions.push('sesion.estado = :estado');
      queryParams.estado = params.estado;
    }

    if (params?.tipo_sesion) {
      conditions.push('sesion.tipo_sesion = :tipo_sesion');
      queryParams.tipo_sesion = params.tipo_sesion;
    }

    if (conditions.length > 0) {
      query.where(conditions.join(' AND '), queryParams);
    }

    return await query.orderBy('sesion.fecha_sesion', 'DESC').getMany();
  }

  async findOneSesion(id: string): Promise<SesionPsicologica> {
    const sesion = await this.sesionRepo.findOne({
      where: { sesion_id: id },
      relations: ['consulta', 'patient', 'psicologo'],
    });

    if (!sesion) {
      throw new NotFoundException('Sesión psicológica no encontrada');
    }

    return sesion;
  }

  async updateSesion(id: string, updates: Partial<SesionPsicologica>): Promise<SesionPsicologica> {
    const sesion = await this.findOneSesion(id);
    Object.assign(sesion, updates);
    return await this.sesionRepo.save(sesion);
  }

  // ============================================
  // Seguimiento Emocional
  // ============================================

  async createSeguimientoEmocional(data: {
    patient_id: string;
    sesion_id?: string;
    estado_animo?: string;
    escala_ansiedad?: number;
    escala_depresion?: number;
    escala_estres?: number;
    sintomas?: string[];
    factores_estresantes?: string;
    apoyo_social?: string;
    observaciones?: string;
    registrado_por_id?: string;
  }): Promise<SeguimientoEmocional> {
    const patient = await this.patientRepo.findOne({ where: { patient_id: data.patient_id } });
    if (!patient) {
      throw new NotFoundException('Paciente no encontrado');
    }

    // Validar escalas (0-10)
    if (data.escala_ansiedad !== undefined && (data.escala_ansiedad < 0 || data.escala_ansiedad > 10)) {
      throw new BadRequestException('La escala de ansiedad debe estar entre 0 y 10');
    }
    if (data.escala_depresion !== undefined && (data.escala_depresion < 0 || data.escala_depresion > 10)) {
      throw new BadRequestException('La escala de depresión debe estar entre 0 y 10');
    }
    if (data.escala_estres !== undefined && (data.escala_estres < 0 || data.escala_estres > 10)) {
      throw new BadRequestException('La escala de estrés debe estar entre 0 y 10');
    }

    // Determinar si hay alerta crítica
    let alertaCritica = false;
    let motivoAlerta = '';

    if (
      data.escala_ansiedad !== undefined && data.escala_ansiedad >= 8 ||
      data.escala_depresion !== undefined && data.escala_depresion >= 8 ||
      data.escala_estres !== undefined && data.escala_estres >= 8 ||
      data.estado_animo === EstadoAnimo.MUY_NEGATIVO ||
      data.estado_animo === EstadoAnimo.DEPRIMIDO
    ) {
      alertaCritica = true;
      const motivos: string[] = [];
      if (data.escala_ansiedad !== undefined && data.escala_ansiedad >= 8) {
        motivos.push(`Ansiedad alta (${data.escala_ansiedad}/10)`);
      }
      if (data.escala_depresion !== undefined && data.escala_depresion >= 8) {
        motivos.push(`Depresión alta (${data.escala_depresion}/10)`);
      }
      if (data.escala_estres !== undefined && data.escala_estres >= 8) {
        motivos.push(`Estrés alto (${data.escala_estres}/10)`);
      }
      if (data.estado_animo === EstadoAnimo.MUY_NEGATIVO || data.estado_animo === EstadoAnimo.DEPRIMIDO) {
        motivos.push(`Estado de ánimo: ${data.estado_animo}`);
      }
      motivoAlerta = motivos.join(', ');
    }

    const seguimiento = this.seguimientoRepo.create({
      patient_id: data.patient_id,
      sesion_id: data.sesion_id,
      estado_animo: data.estado_animo as EstadoAnimo,
      escala_ansiedad: data.escala_ansiedad,
      escala_depresion: data.escala_depresion,
      escala_estres: data.escala_estres,
      sintomas: data.sintomas || [],
      factores_estresantes: data.factores_estresantes,
      apoyo_social: data.apoyo_social,
      observaciones: data.observaciones,
      alerta_critica: alertaCritica,
      motivo_alerta: motivoAlerta || null,
      registrado_por_id: data.registrado_por_id,
    });

    return await this.seguimientoRepo.save(seguimiento);
  }

  async findAllSeguimientosEmocionales(params?: {
    patient_id?: string;
    sesion_id?: string;
    alerta_critica?: boolean;
  }): Promise<SeguimientoEmocional[]> {
    try {
      const query = this.seguimientoRepo
        .createQueryBuilder('seguimiento')
        .leftJoinAndSelect('seguimiento.patient', 'patient')
        .leftJoinAndSelect('seguimiento.sesion', 'sesion')
        .leftJoinAndSelect('seguimiento.registrado_por', 'registrado_por');

      const conditions: string[] = [];
      const queryParams: any = {};

      if (params?.patient_id) {
        conditions.push('seguimiento.patient_id = :patient_id');
        queryParams.patient_id = params.patient_id;
      }

      if (params?.sesion_id) {
        conditions.push('seguimiento.sesion_id = :sesion_id');
        queryParams.sesion_id = params.sesion_id;
      }

      if (params?.alerta_critica !== undefined) {
        conditions.push('seguimiento.alerta_critica = :alerta_critica');
        queryParams.alerta_critica = params.alerta_critica === true || params.alerta_critica === 'true' || params.alerta_critica === 1;
      }

      if (conditions.length > 0) {
        query.where(conditions.join(' AND '), queryParams);
      }

      return await query.orderBy('seguimiento.fecha_registro', 'DESC').getMany();
    } catch (error) {
      console.error('Error en findAllSeguimientosEmocionales:', error);
      throw new BadRequestException(`Error al obtener seguimientos emocionales: ${error.message}`);
    }
  }

  async findOneSeguimientoEmocional(id: string): Promise<SeguimientoEmocional> {
    const seguimiento = await this.seguimientoRepo.findOne({
      where: { seguimiento_id: id },
      relations: ['patient', 'sesion', 'registrado_por'],
    });

    if (!seguimiento) {
      throw new NotFoundException('Seguimiento emocional no encontrado');
    }

    return seguimiento;
  }

  async getSeguimientosConAlertas(patient_id?: string): Promise<SeguimientoEmocional[]> {
    try {
      const seguimientos = await this.findAllSeguimientosEmocionales({ alerta_critica: true, patient_id });
      return seguimientos || [];
    } catch (error) {
      console.error('Error en getSeguimientosConAlertas:', error);
      throw new BadRequestException(`Error al obtener seguimientos con alertas: ${error.message}`);
    }
  }

  // ============================================
  // Familiares y Cuidadores
  // ============================================

  async createFamiliar(data: {
    patient_id: string;
    nombre: string;
    apellido?: string;
    relacion?: string;
    telefono?: string;
    email?: string;
    direccion?: string;
    es_cuidador_principal?: boolean;
    puede_participar_sesiones?: boolean;
    notas?: string;
  }): Promise<FamiliarCuidador> {
    const patient = await this.patientRepo.findOne({ where: { patient_id: data.patient_id } });
    if (!patient) {
      throw new NotFoundException('Paciente no encontrado');
    }

    const familiar = this.familiarRepo.create({
      patient_id: data.patient_id,
      nombre: data.nombre,
      apellido: data.apellido,
      relacion: data.relacion,
      telefono: data.telefono,
      email: data.email,
      direccion: data.direccion,
      es_cuidador_principal: data.es_cuidador_principal || false,
      puede_participar_sesiones: data.puede_participar_sesiones !== undefined ? data.puede_participar_sesiones : true,
      notas: data.notas,
    });

    return await this.familiarRepo.save(familiar);
  }

  async findAllFamiliares(patient_id: string): Promise<FamiliarCuidador[]> {
    return await this.familiarRepo.find({
      where: { patient_id },
      order: { es_cuidador_principal: 'DESC', nombre: 'ASC' },
    });
  }

  async findOneFamiliar(id: string): Promise<FamiliarCuidador> {
    const familiar = await this.familiarRepo.findOne({
      where: { familiar_id: id },
      relations: ['patient'],
    });

    if (!familiar) {
      throw new NotFoundException('Familiar/cuidador no encontrado');
    }

    return familiar;
  }

  async updateFamiliar(id: string, updates: Partial<FamiliarCuidador>): Promise<FamiliarCuidador> {
    const familiar = await this.findOneFamiliar(id);
    Object.assign(familiar, updates);
    return await this.familiarRepo.save(familiar);
  }

  async deleteFamiliar(id: string): Promise<void> {
    const familiar = await this.findOneFamiliar(id);
    await this.familiarRepo.remove(familiar);
  }
}

