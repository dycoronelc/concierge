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
import { Evento } from './evento.entity';
import { Ticket } from './ticket.entity';

export enum NivelActividadFisica {
  SEDENTARIO = 'Sedentario',
  LIGERO = 'Ligero',
  MODERADO = 'Moderado',
  INTENSO = 'Intenso',
  MUY_INTENSO = 'Muy_Intenso',
}

@Entity('evaluaciones_nutricionales')
export class EvaluacionNutricional {
  @PrimaryGeneratedColumn('uuid')
  evaluacion_id: string;

  @Column({ type: 'uuid' })
  patient_id: string;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @Column({ type: 'uuid', nullable: true })
  evento_id: string;

  @ManyToOne(() => Evento, { nullable: true })
  @JoinColumn({ name: 'evento_id' })
  evento: Evento;

  @Column({ type: 'uuid', nullable: true })
  ticket_id: string;

  @ManyToOne(() => Ticket, { nullable: true })
  @JoinColumn({ name: 'ticket_id' })
  ticket: Ticket;

  @Column({ type: 'uuid', nullable: true })
  nutriologo_asignado_id: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'nutriologo_asignado_id' })
  nutriologo_asignado: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_evaluacion: Date;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  peso_kg: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  talla_cm: number;

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true })
  imc: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  circunferencia_cintura_cm: number;

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true })
  porcentaje_grasa_corporal: number;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  nivel_actividad_fisica: NivelActividadFisica;

  @Column({ type: 'text', array: true, default: [] })
  alergias_alimentarias: string[];

  @Column({ type: 'text', array: true, default: [] })
  restricciones_dieteticas: string[];

  @Column({ type: 'text', array: true, default: [] })
  preferencias_alimentarias: string[];

  @Column({ type: 'text', array: true, default: [] })
  enfermedades_cronicas: string[];

  @Column({ type: 'text', array: true, default: [] })
  medicamentos_actuales: string[];

  @Column({ type: 'text', nullable: true })
  objetivos_nutricionales: string;

  @Column({ type: 'text', nullable: true })
  notas_evaluacion: string;

  @Column({ type: 'text', array: true, default: [] })
  reportes_previos_urls: string[];

  @Column({ type: 'uuid' })
  evaluado_por_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'evaluado_por_id' })
  evaluado_por: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

