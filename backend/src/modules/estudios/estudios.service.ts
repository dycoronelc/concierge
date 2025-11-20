import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SolicitudEstudio, EstadoSolicitudEstudio, TipoEstudio } from '../../entities/solicitud-estudio.entity';
import { ResultadoEstudio } from '../../entities/resultado-estudio.entity';
import { Patient } from '../../entities/patient.entity';
import { User } from '../../entities/user.entity';
import { Evento } from '../../entities/evento.entity';

@Injectable()
export class EstudiosService {
  constructor(
    @InjectRepository(SolicitudEstudio)
    private solicitudEstudioRepo: Repository<SolicitudEstudio>,
    @InjectRepository(ResultadoEstudio)
    private resultadoEstudioRepo: Repository<ResultadoEstudio>,
    @InjectRepository(Patient)
    private patientRepo: Repository<Patient>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Evento)
    private eventoRepo: Repository<Evento>,
  ) {}

  async createSolicitud(data: {
    patient_id: string;
    evento_id?: string;
    ticket_id?: string;
    tipo_estudio: string;
    nombre_estudio: string;
    descripcion?: string;
    toma_domicilio: boolean;
    fecha_programada?: Date;
    requiere_consentimiento?: boolean;
    solicitado_por_id: string;
  }): Promise<SolicitudEstudio> {
    const patient = await this.patientRepo.findOne({ where: { patient_id: data.patient_id } });
    if (!patient) {
      throw new NotFoundException('Paciente no encontrado');
    }

    if (data.evento_id) {
      const evento = await this.eventoRepo.findOne({ where: { evento_id: data.evento_id } });
      if (!evento) {
        throw new NotFoundException('Evento no encontrado');
      }
    }

    const solicitadoPor = await this.userRepo.findOne({ where: { user_id: data.solicitado_por_id } });
    if (!solicitadoPor) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const solicitud = this.solicitudEstudioRepo.create({
      patient_id: data.patient_id,
      evento_id: data.evento_id,
      ticket_id: data.ticket_id,
      tipo_estudio: data.tipo_estudio as TipoEstudio,
      nombre_estudio: data.nombre_estudio,
      descripcion: data.descripcion,
      toma_domicilio: data.toma_domicilio,
      fecha_programada: data.fecha_programada,
      requiere_consentimiento: data.requiere_consentimiento || false,
      solicitado_por_id: data.solicitado_por_id,
      estado: EstadoSolicitudEstudio.SOLICITADO,
    });

    return await this.solicitudEstudioRepo.save(solicitud);
  }

  async findAll(params?: { patient_id?: string; evento_id?: string; estado?: string }): Promise<SolicitudEstudio[]> {
    const query = this.solicitudEstudioRepo.createQueryBuilder('solicitud')
      .leftJoinAndSelect('solicitud.patient', 'patient')
      .leftJoinAndSelect('solicitud.evento', 'evento')
      .leftJoinAndSelect('solicitud.tecnico_asignado', 'tecnico')
      .leftJoinAndSelect('solicitud.solicitado_por', 'solicitado_por');

    if (params?.patient_id) {
      query.where('solicitud.patient_id = :patient_id', { patient_id: params.patient_id });
    }

    if (params?.evento_id) {
      query.andWhere('solicitud.evento_id = :evento_id', { evento_id: params.evento_id });
    }

    if (params?.estado) {
      query.andWhere('solicitud.estado = :estado', { estado: params.estado });
    }

    return await query.orderBy('solicitud.created_at', 'DESC').getMany();
  }

  async findOne(id: string): Promise<SolicitudEstudio> {
    const solicitud = await this.solicitudEstudioRepo.findOne({
      where: { solicitud_id: id },
      relations: ['patient', 'evento', 'tecnico_asignado', 'solicitado_por', 'ticket'],
    });

    if (!solicitud) {
      throw new NotFoundException('Solicitud de estudio no encontrada');
    }

    return solicitud;
  }

  async asignarTecnico(solicitud_id: string, tecnico_id: string): Promise<SolicitudEstudio> {
    const solicitud = await this.findOne(solicitud_id);
    const tecnico = await this.userRepo.findOne({ where: { user_id: tecnico_id } });

    if (!tecnico) {
      throw new NotFoundException('Técnico no encontrado');
    }

    solicitud.tecnico_asignado_id = tecnico_id;
    solicitud.estado = EstadoSolicitudEstudio.PROGRAMADO;

    return await this.solicitudEstudioRepo.save(solicitud);
  }

  async registrarTomaMuestra(solicitud_id: string, cadena_custodia: string): Promise<SolicitudEstudio> {
    const solicitud = await this.findOne(solicitud_id);
    solicitud.estado = EstadoSolicitudEstudio.EN_PROCESO;
    solicitud.fecha_toma_muestra = new Date();
    solicitud.cadena_custodia = cadena_custodia;

    return await this.solicitudEstudioRepo.save(solicitud);
  }

  async registrarResultado(data: {
    solicitud_estudio_id: string;
    evento_id?: string;
    resultado_texto?: string;
    resultado_json?: string;
    archivo_resultado_url?: string;
    fecha_resultado?: Date;
    revisado_por_id?: string;
    requiere_seguimiento?: boolean;
    notas_medicas?: string;
  }): Promise<ResultadoEstudio> {
    const solicitud = await this.findOne(data.solicitud_estudio_id);

    if (data.evento_id) {
      const evento = await this.eventoRepo.findOne({ where: { evento_id: data.evento_id } });
      if (!evento) {
        throw new NotFoundException('Evento no encontrado');
      }
    }

    const resultado = this.resultadoEstudioRepo.create({
      ...data,
      fecha_resultado: data.fecha_resultado || new Date(),
    });

    const resultadoGuardado = await this.resultadoEstudioRepo.save(resultado);

    // Actualizar estado de la solicitud
    solicitud.estado = EstadoSolicitudEstudio.COMPLETADO;
    await this.solicitudEstudioRepo.save(solicitud);

    return resultadoGuardado;
  }

  async getResultadosPorEvento(evento_id: string): Promise<ResultadoEstudio[]> {
    return await this.resultadoEstudioRepo.find({
      where: { evento_id },
      relations: ['solicitud_estudio', 'revisado_por'],
      order: { fecha_resultado: 'DESC' },
    });
  }

  async getResultadosPorPaciente(patient_id: string): Promise<ResultadoEstudio[]> {
    const solicitudes = await this.solicitudEstudioRepo.find({
      where: { patient_id },
      select: ['solicitud_id'],
    });

    const solicitudIds = solicitudes.map(s => s.solicitud_id);

    if (solicitudIds.length === 0) {
      return [];
    }

    return await this.resultadoEstudioRepo
      .createQueryBuilder('resultado')
      .leftJoinAndSelect('resultado.solicitud_estudio', 'solicitud')
      .leftJoinAndSelect('resultado.evento', 'evento')
      .leftJoinAndSelect('resultado.revisado_por', 'revisado_por')
      .where('resultado.solicitud_estudio_id IN (:...ids)', { ids: solicitudIds })
      .orderBy('resultado.fecha_resultado', 'DESC')
      .getMany();
  }
}

