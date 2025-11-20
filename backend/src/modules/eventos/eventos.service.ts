import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Evento, EstadoEvento, SeveridadEvento } from '../../entities/evento.entity';
import { Patient } from '../../entities/patient.entity';
import { ICD10 } from '../../entities/icd10.entity';
import { Encuentro } from '../../entities/encuentro.entity';

@Injectable()
export class EventosService {
  constructor(
    @InjectRepository(Evento)
    private eventoRepository: Repository<Evento>,
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
    @InjectRepository(ICD10)
    private icd10Repository: Repository<ICD10>,
    @InjectRepository(Encuentro)
    private encuentroRepository: Repository<Encuentro>,
  ) {}

  async create(data: {
    patient_id: string;
    diagnostico_icd_id?: string;
    severidad?: SeveridadEvento;
    categoria?: string;
    creado_por: string;
    diagnostico_preliminar?: boolean;
    notas_clinicas?: string;
  }): Promise<Evento> {
    // Verificar que el paciente existe
    const patient = await this.patientRepository.findOne({
      where: { patient_id: data.patient_id },
    });

    if (!patient) {
      throw new NotFoundException(`Paciente ${data.patient_id} no encontrado`);
    }

    // Verificar que el diagnóstico ICD existe si se proporciona
    if (data.diagnostico_icd_id) {
      const icd10 = await this.icd10Repository.findOne({
        where: { icd10_id: data.diagnostico_icd_id },
      });

      if (!icd10) {
        throw new NotFoundException(`Diagnóstico ICD-10 ${data.diagnostico_icd_id} no encontrado`);
      }
    }

    const evento = this.eventoRepository.create({
      patient_id: data.patient_id,
      diagnostico_icd_id: data.diagnostico_icd_id,
      severidad: data.severidad,
      categoria: data.categoria,
      estado_evento: EstadoEvento.ACTIVO,
      fecha_inicio: new Date(),
      creado_por: data.creado_por,
      diagnostico_preliminar: data.diagnostico_preliminar || false,
      notas_clinicas: data.notas_clinicas,
    });

    return this.eventoRepository.save(evento);
  }

  async findAll(filters?: {
    patient_id?: string;
    estado_evento?: EstadoEvento;
    diagnostico_icd_id?: string;
  }): Promise<Evento[]> {
    const query = this.eventoRepository
      .createQueryBuilder('evento')
      .leftJoinAndSelect('evento.patient', 'patient')
      .leftJoinAndSelect('evento.diagnostico_icd', 'diagnostico_icd')
      .leftJoinAndSelect('evento.encuentros', 'encuentros')
      .orderBy('evento.fecha_inicio', 'DESC');

    if (filters?.patient_id) {
      query.andWhere('evento.patient_id = :patient_id', { patient_id: filters.patient_id });
    }

    if (filters?.estado_evento) {
      query.andWhere('evento.estado_evento = :estado_evento', {
        estado_evento: filters.estado_evento,
      });
    }

    if (filters?.diagnostico_icd_id) {
      query.andWhere('evento.diagnostico_icd_id = :diagnostico_icd_id', {
        diagnostico_icd_id: filters.diagnostico_icd_id,
      });
    }

    return query.getMany();
  }

  async findOne(evento_id: string): Promise<Evento> {
    const evento = await this.eventoRepository.findOne({
      where: { evento_id },
      relations: ['patient', 'diagnostico_icd', 'encuentros', 'encuentros.prestador', 'tickets'],
    });

    if (!evento) {
      throw new NotFoundException(`Evento ${evento_id} no encontrado`);
    }

    return evento;
  }

  async update(evento_id: string, updates: {
    diagnostico_icd_id?: string;
    severidad?: SeveridadEvento;
    categoria?: string;
    estado_evento?: EstadoEvento;
    validado_por?: string;
    diagnostico_preliminar?: boolean;
    notas_clinicas?: string;
  }): Promise<Evento> {
    const evento = await this.findOne(evento_id);

    if (updates.diagnostico_icd_id) {
      const icd10 = await this.icd10Repository.findOne({
        where: { icd10_id: updates.diagnostico_icd_id },
      });

      if (!icd10) {
        throw new NotFoundException(
          `Diagnóstico ICD-10 ${updates.diagnostico_icd_id} no encontrado`,
        );
      }
    }

    if (updates.validado_por) {
      updates['fecha_validacion'] = new Date();
    }

    Object.assign(evento, updates);
    return this.eventoRepository.save(evento);
  }

  async closeEvento(evento_id: string, usuario: string, motivo?: string): Promise<Evento> {
    const evento = await this.findOne(evento_id);

    // Verificar que todos los encuentros estén completados
    const encuentrosCompletados = await this.encuentroRepository.count({
      where: {
        evento_id,
        estado: 'Completado' as any,
      },
    });

    const totalEncuentros = await this.encuentroRepository.count({
      where: { evento_id },
    });

    if (totalEncuentros > 0 && encuentrosCompletados < totalEncuentros) {
      throw new BadRequestException(
        'No se puede cerrar el evento. Todos los encuentros deben estar completados.',
      );
    }

    evento.estado_evento = EstadoEvento.CERRADO;
    evento.fecha_cierre = new Date();
    if (motivo) {
      evento.notas_clinicas = `${evento.notas_clinicas || ''}\n\nCierre: ${motivo} (${usuario})`;
    }

    return this.eventoRepository.save(evento);
  }

  async getHistorialClinico(patient_id: string): Promise<Evento[]> {
    return this.eventoRepository.find({
      where: { patient_id },
      relations: [
        'diagnostico_icd',
        'encuentros',
        'encuentros.prestador',
        'encuentros.ticket',
        'tickets',
      ],
      order: { fecha_inicio: 'DESC' },
    });
  }
}

