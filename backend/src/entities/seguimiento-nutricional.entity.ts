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
import { PlanNutricional } from './plan-nutricional.entity';

export enum NivelEnergia {
  MUY_BAJO = 'Muy_Bajo',
  BAJO = 'Bajo',
  NORMAL = 'Normal',
  ALTO = 'Alto',
  MUY_ALTO = 'Muy_Alto',
}

export enum AdherenciaPlan {
  BAJA = 'Baja',
  MEDIA = 'Media',
  ALTA = 'Alta',
  COMPLETA = 'Completa',
}

@Entity('seguimiento_nutricional')
export class SeguimientoNutricional {
  @PrimaryGeneratedColumn('uuid')
  seguimiento_id: string;

  @Column({ type: 'uuid' })
  plan_id: string;

  @ManyToOne(() => PlanNutricional, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'plan_id' })
  plan: PlanNutricional;

  @Column({ type: 'uuid' })
  patient_id: string;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  fecha_seguimiento: Date;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  peso_kg: number;

  @Column({ type: 'text', array: true, default: [] })
  sintomas: string[];

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  nivel_energia: NivelEnergia;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  adherencia_plan: AdherenciaPlan;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @Column({ type: 'boolean', default: false })
  alerta_retroceso: boolean;

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

