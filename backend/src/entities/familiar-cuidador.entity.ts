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

@Entity('familiares_cuidadores')
export class FamiliarCuidador {
  @PrimaryGeneratedColumn('uuid')
  familiar_id: string;

  @Column({ type: 'uuid' })
  patient_id: string;

  @ManyToOne(() => Patient, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  apellido: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  relacion: string; // Padre, Madre, Cónyuge, Hijo/a, Cuidador, etc.

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  direccion: string;

  @Column({ type: 'boolean', default: false })
  es_cuidador_principal: boolean;

  @Column({ type: 'boolean', default: true })
  puede_participar_sesiones: boolean;

  @Column({ type: 'text', nullable: true })
  notas: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

