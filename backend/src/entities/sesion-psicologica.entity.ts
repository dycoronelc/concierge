import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Patient } from './patient.entity';
import { User } from './user.entity';
import { ConsultaPsicologica } from './consulta-psicologica.entity';

export enum TipoSesion {
  INDIVIDUAL = 'Individual',
  GRUPAL = 'Grupal',
  FAMILIAR = 'Familiar',
}

export enum EstadoSesion {
  PROGRAMADA = 'Programada',
  EN_CURSO = 'En_Curso',
  COMPLETADA = 'Completada',
  CANCELADA = 'Cancelada',
  NO_ASISTIO = 'No_Asistio',
}

@Entity('sesiones_psicologicas')
export class SesionPsicologica {
  @PrimaryGeneratedColumn('uuid')
  sesion_id: string;

  @Column({ type: 'uuid' })
  consulta_id: string;

  @ManyToOne(() => ConsultaPsicologica, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'consulta_id' })
  consulta: ConsultaPsicologica;

  @Column({ type: 'uuid' })
  patient_id: string;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @Column({ type: 'uuid' })
  psicologo_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'psicologo_id' })
  psicologo: User;

  @Column({ type: 'timestamp' })
  fecha_sesion: Date;

  @Column({ type: 'integer', default: 60 })
  duracion_minutos: number;

  @Column({ type: 'varchar', length: 50, default: TipoSesion.INDIVIDUAL })
  tipo_sesion: TipoSesion;

  @Column({ type: 'uuid', array: true, default: [] })
  participantes: string[]; // IDs de usuarios/familiares participantes

  @Column({ type: 'text', nullable: true })
  resumen_sesion: string;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @Column({ type: 'text', nullable: true })
  plan_tratamiento: string;

  @Column({ type: 'timestamp', nullable: true })
  proxima_sesion_programada: Date;

  @Column({ type: 'varchar', length: 50, default: EstadoSesion.PROGRAMADA })
  estado: EstadoSesion;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

