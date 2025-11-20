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
import { SesionPsicologica } from './sesion-psicologica.entity';

export enum EstadoAnimo {
  MUY_POSITIVO = 'Muy_Positivo',
  POSITIVO = 'Positivo',
  NEUTRO = 'Neutro',
  NEGATIVO = 'Negativo',
  MUY_NEGATIVO = 'Muy_Negativo',
  ANSIOSO = 'Ansioso',
  DEPRIMIDO = 'Deprimido',
  EUFORICO = 'Eufórico',
}

@Entity('seguimiento_emocional')
export class SeguimientoEmocional {
  @PrimaryGeneratedColumn('uuid')
  seguimiento_id: string;

  @Column({ type: 'uuid' })
  patient_id: string;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @Column({ type: 'uuid', nullable: true })
  sesion_id: string;

  @ManyToOne(() => SesionPsicologica, { nullable: true })
  @JoinColumn({ name: 'sesion_id' })
  sesion: SesionPsicologica;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_registro: Date;

  @Column({ type: 'varchar', length: 50, nullable: true })
  estado_animo: EstadoAnimo;

  @Column({ type: 'integer', nullable: true })
  escala_ansiedad: number; // 0-10

  @Column({ type: 'integer', nullable: true })
  escala_depresion: number; // 0-10

  @Column({ type: 'integer', nullable: true })
  escala_estres: number; // 0-10

  @Column({ type: 'text', array: true, default: [] })
  sintomas: string[];

  @Column({ type: 'text', nullable: true })
  factores_estresantes: string;

  @Column({ type: 'text', nullable: true })
  apoyo_social: string;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @Column({ type: 'boolean', default: false })
  alerta_critica: boolean;

  @Column({ type: 'text', nullable: true })
  motivo_alerta: string;

  @Column({ type: 'uuid', nullable: true })
  registrado_por_id: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'registrado_por_id' })
  registrado_por: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

