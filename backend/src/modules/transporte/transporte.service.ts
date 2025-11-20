import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SolicitudTransporte, EstadoSolicitudTransporte, TipoTraslado } from '../../entities/solicitud-transporte.entity';
import { Vehiculo, EstadoVehiculo } from '../../entities/vehiculo.entity';
import { Patient } from '../../entities/patient.entity';
import { User } from '../../entities/user.entity';

@Injectable()
export class TransporteService {
  constructor(
    @InjectRepository(SolicitudTransporte)
    private solicitudTransporteRepo: Repository<SolicitudTransporte>,
    @InjectRepository(Vehiculo)
    private vehiculoRepo: Repository<Vehiculo>,
    @InjectRepository(Patient)
    private patientRepo: Repository<Patient>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async createSolicitud(data: {
    patient_id: string;
    ticket_id?: string;
    tipo_traslado: string;
    direccion_origen: string;
    direccion_destino: string;
    latitud_origen?: number;
    longitud_origen?: number;
    latitud_destino?: number;
    longitud_destino?: number;
    fecha_programada?: Date;
    requiere_gps?: boolean;
    creado_por_id: string;
  }): Promise<SolicitudTransporte> {
    const patient = await this.patientRepo.findOne({ where: { patient_id: data.patient_id } });
    if (!patient) {
      throw new NotFoundException('Paciente no encontrado');
    }

    const creadoPor = await this.userRepo.findOne({ where: { user_id: data.creado_por_id } });
    if (!creadoPor) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const solicitud = this.solicitudTransporteRepo.create({
      patient_id: data.patient_id,
      ticket_id: data.ticket_id,
      tipo_traslado: data.tipo_traslado as TipoTraslado,
      direccion_origen: data.direccion_origen,
      direccion_destino: data.direccion_destino,
      latitud_origen: data.latitud_origen,
      longitud_origen: data.longitud_origen,
      latitud_destino: data.latitud_destino,
      longitud_destino: data.longitud_destino,
      fecha_programada: data.fecha_programada,
      requiere_gps: data.requiere_gps || false,
      creado_por_id: data.creado_por_id,
      estado: EstadoSolicitudTransporte.SOLICITADO,
    });

    return await this.solicitudTransporteRepo.save(solicitud);
  }

  async findAll(params?: { patient_id?: string; estado?: string }): Promise<SolicitudTransporte[]> {
    const query = this.solicitudTransporteRepo.createQueryBuilder('solicitud')
      .leftJoinAndSelect('solicitud.patient', 'patient')
      .leftJoinAndSelect('solicitud.conductor_asignado', 'conductor')
      .leftJoinAndSelect('solicitud.creado_por', 'creado_por');

    if (params?.patient_id) {
      query.where('solicitud.patient_id = :patient_id', { patient_id: params.patient_id });
    }

    if (params?.estado) {
      query.andWhere('solicitud.estado = :estado', { estado: params.estado });
    }

    return await query.orderBy('solicitud.created_at', 'DESC').getMany();
  }

  async findOne(id: string): Promise<SolicitudTransporte> {
    const solicitud = await this.solicitudTransporteRepo.findOne({
      where: { solicitud_id: id },
      relations: ['patient', 'conductor_asignado', 'creado_por', 'ticket'],
    });

    if (!solicitud) {
      throw new NotFoundException('Solicitud de transporte no encontrada');
    }

    return solicitud;
  }

  async asignarVehiculo(solicitud_id: string, vehiculo_id: string, conductor_id: string): Promise<SolicitudTransporte> {
    const solicitud = await this.findOne(solicitud_id);
    const vehiculo = await this.vehiculoRepo.findOne({ where: { vehiculo_id } });
    const conductor = await this.userRepo.findOne({ where: { user_id: conductor_id } });

    if (!vehiculo) {
      throw new NotFoundException('Vehículo no encontrado');
    }

    if (!conductor) {
      throw new NotFoundException('Conductor no encontrado');
    }

    if (vehiculo.estado !== EstadoVehiculo.DISPONIBLE) {
      throw new Error('El vehículo no está disponible');
    }

    solicitud.vehiculo_asignado_id = vehiculo_id;
    solicitud.conductor_asignado_id = conductor_id;
    solicitud.estado = EstadoSolicitudTransporte.ASIGNADO;

    // Marcar vehículo como en uso
    vehiculo.estado = EstadoVehiculo.EN_USO;
    await this.vehiculoRepo.save(vehiculo);

    return await this.solicitudTransporteRepo.save(solicitud);
  }

  async actualizarUbicacionVehiculo(vehiculo_id: string, latitud: number, longitud: number): Promise<Vehiculo> {
    const vehiculo = await this.vehiculoRepo.findOne({ where: { vehiculo_id } });
    if (!vehiculo) {
      throw new NotFoundException('Vehículo no encontrado');
    }

    vehiculo.latitud_actual = latitud;
    vehiculo.longitud_actual = longitud;
    vehiculo.ultima_actualizacion_gps = new Date();

    return await this.vehiculoRepo.save(vehiculo);
  }

  async iniciarTraslado(solicitud_id: string): Promise<SolicitudTransporte> {
    const solicitud = await this.findOne(solicitud_id);
    solicitud.estado = EstadoSolicitudTransporte.EN_CAMINO_ORIGEN;
    solicitud.fecha_inicio = new Date();
    return await this.solicitudTransporteRepo.save(solicitud);
  }

  async completarTraslado(solicitud_id: string, observaciones?: string): Promise<SolicitudTransporte> {
    const solicitud = await this.findOne(solicitud_id);
    solicitud.estado = EstadoSolicitudTransporte.COMPLETADO;
    solicitud.fecha_llegada_destino = new Date();
    solicitud.observaciones = observaciones;

    if (solicitud.fecha_inicio) {
      const duracion = Math.floor(
        (solicitud.fecha_llegada_destino.getTime() - solicitud.fecha_inicio.getTime()) / 60000
      );
      solicitud.duracion_minutos = duracion;
    }

    // Liberar vehículo
    if (solicitud.vehiculo_asignado_id) {
      const vehiculo = await this.vehiculoRepo.findOne({
        where: { vehiculo_id: solicitud.vehiculo_asignado_id },
      });
      if (vehiculo) {
        vehiculo.estado = EstadoVehiculo.DISPONIBLE;
        await this.vehiculoRepo.save(vehiculo);
      }
    }

    return await this.solicitudTransporteRepo.save(solicitud);
  }

  async getVehiculosDisponibles(): Promise<Vehiculo[]> {
    return await this.vehiculoRepo.find({
      where: { estado: EstadoVehiculo.DISPONIBLE },
      order: { created_at: 'DESC' },
    });
  }

  async createVehiculo(data: Partial<Vehiculo>): Promise<Vehiculo> {
    const vehiculo = this.vehiculoRepo.create(data);
    return await this.vehiculoRepo.save(vehiculo);
  }

  async getAllVehiculos(): Promise<Vehiculo[]> {
    return await this.vehiculoRepo.find({
      order: { created_at: 'DESC' },
    });
  }
}

