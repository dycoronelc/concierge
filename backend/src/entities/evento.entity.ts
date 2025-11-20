import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Patient } from './patient.entity';
import { ICD10 } from './icd10.entity';
import { Encuentro } from './encuentro.entity';
import { Ticket } from './ticket.entity';

export enum EstadoEvento {
  ACTIVO = 'Activo',
  SEGUIMIENTO = 'Seguimiento',
  CERRADO = 'Cerrado',
}

export enum SeveridadEvento {
  LEVE = 'Leve',
  MODERADA = 'Moderada',
  GRAVE = 'Grave',
  CRITICA = 'Critica',
}

@Entity('eventos')
export class Evento {
  @PrimaryGeneratedColumn('uuid')
  evento_id: string;

  @ManyToOne(() => Patient, { nullable: false })
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @Column({ nullable: false })
  patient_id: string;

  @ManyToOne(() => ICD10, { nullable: true })
  @JoinColumn({ name: 'diagnostico_icd_id' })
  diagnostico_icd: ICD10;

  @Column({ nullable: true })
  diagnostico_icd_id: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  severidad: SeveridadEvento;

  @Column({ type: 'varchar', length: 20, nullable: true })
  categoria: string; // Puede ser la misma que TicketCategory o diferente

  @Column({ type: 'varchar', length: 30, default: EstadoEvento.ACTIVO })
  estado_evento: EstadoEvento;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_inicio: Date;

  @Column({ type: 'timestamp', nullable: true })
  fecha_cierre: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  creado_por: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  validado_por: string;

  @Column({ type: 'timestamp', nullable: true })
  fecha_validacion: Date;

  @Column({ type: 'boolean', default: false })
  diagnostico_preliminar: boolean;

  @Column({ type: 'text', nullable: true })
  notas_clinicas: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relaciones
  @OneToMany(() => Encuentro, (encuentro) => encuentro.evento)
  encuentros: Encuentro[];

  @OneToMany(() => Ticket, (ticket) => ticket.evento)
  tickets: Ticket[];
}

