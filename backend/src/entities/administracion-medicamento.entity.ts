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
import { ServicioEnfermeria } from './servicio-enfermeria.entity';

@Entity('administracion_medicamentos')
export class AdministracionMedicamento {
  @PrimaryGeneratedColumn('uuid')
  administracion_id: string;

  @Column({ type: 'uuid' })
  patient_id: string;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @Column({ type: 'uuid', nullable: true })
  servicio_enfermeria_id: string;

  @ManyToOne(() => ServicioEnfermeria, { nullable: true })
  @JoinColumn({ name: 'servicio_enfermeria_id' })
  servicio_enfermeria: ServicioEnfermeria;

  @Column({ type: 'varchar', length: 200 })
  nombre_medicamento: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  dosis: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  via_administracion: string; // Oral, Intramuscular, Intravenosa, etc.

  @Column({ type: 'timestamp' })
  fecha_hora_administracion: Date;

  @Column({ type: 'uuid' })
  responsable_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'responsable_id' })
  responsable: User;

  @Column({ type: 'boolean', default: false })
  prescripcion_validada: boolean;

  @Column({ type: 'text', nullable: true })
  notas_clinicas: string;

  @Column({ type: 'text', nullable: true })
  reacciones_adversas: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

