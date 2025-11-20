import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServicioEnfermeria, EstadoServicioEnfermeria, TipoCuidadoEnfermeria } from '../../entities/servicio-enfermeria.entity';
import { AdministracionMedicamento } from '../../entities/administracion-medicamento.entity';
import { Patient } from '../../entities/patient.entity';
import { User } from '../../entities/user.entity';

@Injectable()
export class EnfermeriaService {
  constructor(
    @InjectRepository(ServicioEnfermeria)
    private servicioEnfermeriaRepo: Repository<ServicioEnfermeria>,
    @InjectRepository(AdministracionMedicamento)
    private administracionMedicamentoRepo: Repository<AdministracionMedicamento>,
    @InjectRepository(Patient)
    private patientRepo: Repository<Patient>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async createServicio(data: {
    patient_id: string;
    ticket_id?: string;
    tipo_cuidado: string;
    descripcion?: string;
    fecha_programada?: Date;
    creado_por_id: string;
  }): Promise<ServicioEnfermeria> {
    const patient = await this.patientRepo.findOne({ where: { patient_id: data.patient_id } });
    if (!patient) {
      throw new NotFoundException('Paciente no encontrado');
    }

    const creadoPor = await this.userRepo.findOne({ where: { user_id: data.creado_por_id } });
    if (!creadoPor) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const servicio = this.servicioEnfermeriaRepo.create({
      patient_id: data.patient_id,
      ticket_id: data.ticket_id,
      tipo_cuidado: data.tipo_cuidado as TipoCuidadoEnfermeria,
      descripcion: data.descripcion,
      fecha_programada: data.fecha_programada,
      creado_por_id: data.creado_por_id,
      estado: EstadoServicioEnfermeria.SOLICITADO,
    });

    return await this.servicioEnfermeriaRepo.save(servicio);
  }

  async findAll(params?: { patient_id?: string; estado?: string }): Promise<ServicioEnfermeria[]> {
    const query = this.servicioEnfermeriaRepo.createQueryBuilder('servicio')
      .leftJoinAndSelect('servicio.patient', 'patient')
      .leftJoinAndSelect('servicio.enfermero_asignado', 'enfermero')
      .leftJoinAndSelect('servicio.creado_por', 'creado_por');

    if (params?.patient_id) {
      query.where('servicio.patient_id = :patient_id', { patient_id: params.patient_id });
    }

    if (params?.estado) {
      query.andWhere('servicio.estado = :estado', { estado: params.estado });
    }

    return await query.orderBy('servicio.created_at', 'DESC').getMany();
  }

  async findOne(id: string): Promise<ServicioEnfermeria> {
    const servicio = await this.servicioEnfermeriaRepo.findOne({
      where: { servicio_id: id },
      relations: ['patient', 'enfermero_asignado', 'creado_por', 'ticket'],
    });

    if (!servicio) {
      throw new NotFoundException('Servicio de enfermería no encontrado');
    }

    return servicio;
  }

  async asignarEnfermero(servicio_id: string, enfermero_id: string): Promise<ServicioEnfermeria> {
    const servicio = await this.findOne(servicio_id);
    const enfermero = await this.userRepo.findOne({ where: { user_id: enfermero_id } });

    if (!enfermero) {
      throw new NotFoundException('Enfermero no encontrado');
    }

    servicio.enfermero_asignado_id = enfermero_id;
    servicio.estado = EstadoServicioEnfermeria.ASIGNADO;

    return await this.servicioEnfermeriaRepo.save(servicio);
  }

  async completarVisita(servicio_id: string, notas: string): Promise<ServicioEnfermeria> {
    const servicio = await this.findOne(servicio_id);

    servicio.estado = EstadoServicioEnfermeria.COMPLETADO;
    servicio.fecha_realizada = new Date();
    servicio.notas_visita = notas;

    return await this.servicioEnfermeriaRepo.save(servicio);
  }

  async registrarMedicamento(data: {
    patient_id: string;
    servicio_enfermeria_id?: string;
    nombre_medicamento: string;
    dosis?: string;
    via_administracion?: string;
    fecha_hora_administracion: Date;
    responsable_id: string;
    prescripcion_validada: boolean;
    notas_clinicas?: string;
  }): Promise<AdministracionMedicamento> {
    const patient = await this.patientRepo.findOne({ where: { patient_id: data.patient_id } });
    if (!patient) {
      throw new NotFoundException('Paciente no encontrado');
    }

    const responsable = await this.userRepo.findOne({ where: { user_id: data.responsable_id } });
    if (!responsable) {
      throw new NotFoundException('Responsable no encontrado');
    }

    const administracion = this.administracionMedicamentoRepo.create(data);
    return await this.administracionMedicamentoRepo.save(administracion);
  }

  async getMedicamentosPorPaciente(patient_id: string): Promise<AdministracionMedicamento[]> {
    return await this.administracionMedicamentoRepo.find({
      where: { patient_id },
      relations: ['responsable', 'servicio_enfermeria'],
      order: { fecha_hora_administracion: 'DESC' },
    });
  }
}

