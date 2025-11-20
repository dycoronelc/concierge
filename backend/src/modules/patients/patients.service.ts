import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from '../../entities/patient.entity';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
  ) {}

  async create(data: {
    cedula: string;
    numero_poliza?: string;
    id_seguro?: string;
    nombre: string;
    apellido?: string;
    telefono_1: string;
    telefono_2?: string;
    email?: string;
    direccion_textual?: string;
    ciudad?: string;
    provincia?: string;
    latitud?: number;
    longitud?: number;
  }): Promise<Patient> {
    // Validar que no exista paciente con misma cédula
    const existingByCedula = await this.patientRepository.findOne({
      where: { cedula: data.cedula },
    });

    if (existingByCedula) {
      throw new ConflictException(`Ya existe un paciente con cédula ${data.cedula}`);
    }

    // Validar que no exista paciente con misma póliza + id_seguro
    if (data.numero_poliza && data.id_seguro) {
      const existingByPoliza = await this.patientRepository.findOne({
        where: {
          numero_poliza: data.numero_poliza,
          id_seguro: data.id_seguro,
        },
      });

      if (existingByPoliza) {
        throw new ConflictException(
          `Ya existe un paciente con póliza ${data.numero_poliza} e ID ${data.id_seguro}`,
        );
      }
    }

    const patient = this.patientRepository.create(data);
    return this.patientRepository.save(patient);
  }

  async findOne(patient_id: string): Promise<Patient> {
    const patient = await this.patientRepository.findOne({
      where: { patient_id },
      relations: ['tickets'],
    });

    if (!patient) {
      throw new NotFoundException(`Paciente ${patient_id} no encontrado`);
    }

    return patient;
  }

  async findByCedula(cedula: string): Promise<Patient | null> {
    return this.patientRepository.findOne({
      where: { cedula },
    });
  }

  async update(patient_id: string, updates: Partial<Patient>): Promise<Patient> {
    const patient = await this.findOne(patient_id);
    Object.assign(patient, updates);
    return this.patientRepository.save(patient);
  }

  async findAll(): Promise<Patient[]> {
    return this.patientRepository.find({
      order: { created_at: 'DESC' },
    });
  }
}

