import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Patient } from './patient.entity';
import { User } from './user.entity';
import { EvaluacionNutricional } from './evaluacion-nutricional.entity';
import { SeguimientoNutricional } from './seguimiento-nutricional.entity';

export enum EstadoPlanNutricional {
  ACTIVO = 'Activo',
  PAUSADO = 'Pausado',
  COMPLETADO = 'Completado',
  CANCELADO = 'Cancelado',
}

export enum FrecuenciaRecordatorios {
  DIARIO = 'Diario',
  CADA_2_DIAS = 'Cada_2_dias',
  SEMANAL = 'Semanal',
}

@Entity('planes_nutricionales')
export class PlanNutricional {
  @PrimaryGeneratedColumn('uuid')
  plan_id: string;

  @Column({ type: 'uuid' })
  evaluacion_id: string;

  @ManyToOne(() => EvaluacionNutricional, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'evaluacion_id' })
  evaluacion: EvaluacionNutricional;

  @Column({ type: 'uuid' })
  patient_id: string;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @Column({ type: 'uuid' })
  nutriologo_asignado_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'nutriologo_asignado_id' })
  nutriologo_asignado: User;

  @Column({ type: 'varchar', length: 255 })
  nombre_plan: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'date' })
  fecha_inicio: Date;

  @Column({ type: 'date', nullable: true })
  fecha_fin: Date;

  @Column({ type: 'integer', nullable: true })
  calorias_diarias: number;

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
  proteinas_g: number;

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
  carbohidratos_g: number;

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
  grasas_g: number;

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
  fibra_g: number;

  @Column({ type: 'jsonb', nullable: true })
  plan_semanal: any; // Estructura: {lunes: {desayuno: [...], almuerzo: [...], cena: [...], snacks: [...]}, ...}

  @Column({ type: 'text', array: true, default: [] })
  recomendaciones: string[];

  @Column({
    type: 'varchar',
    length: 50,
    default: EstadoPlanNutricional.ACTIVO,
  })
  estado: EstadoPlanNutricional;

  @Column({ type: 'boolean', default: true })
  notificaciones_habilitadas: boolean;

  @Column({
    type: 'varchar',
    length: 50,
    default: FrecuenciaRecordatorios.DIARIO,
  })
  frecuencia_recordatorios: FrecuenciaRecordatorios;

  @Column({ type: 'uuid' })
  creado_por_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'creado_por_id' })
  creado_por: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => SeguimientoNutricional, (seguimiento) => seguimiento.plan)
  seguimientos: SeguimientoNutricional[];
}

