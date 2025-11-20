import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Patient } from './patient.entity';
import { User } from './user.entity';
import { Evento } from './evento.entity';
import { Ticket } from './ticket.entity';
import { SesionPsicologica } from './sesion-psicologica.entity';

export enum TipoConsulta {
  PSICOLOGICA = 'Psicologica',
  PSIQUIATRICA = 'Psiquiatrica',
}

export enum ModalidadConsulta {
  PRESENCIAL = 'Presencial',
  TELEFONICA = 'Telefonica',
  VIDEOLLAMADA = 'Videollamada',
}

export enum EstadoConsulta {
  SOLICITADA = 'Solicitada',
  CONFIRMADA = 'Confirmada',
  EN_PROCESO = 'En_Proceso',
  COMPLETADA = 'Completada',
  CANCELADA = 'Cancelada',
}

@Entity('consultas_psicologicas')
export class ConsultaPsicologica {
  @PrimaryGeneratedColumn('uuid')
  consulta_id: string;

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
  psicologo_id: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'psicologo_id' })
  psicologo: User;

  @Column({ type: 'varchar', length: 50 })
  tipo_consulta: TipoConsulta;

  @Column({ type: 'varchar', length: 50 })
  modalidad: ModalidadConsulta;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_solicitud: Date;

  @Column({ type: 'timestamp', nullable: true })
  fecha_programada: Date;

  @Column({ type: 'text', nullable: true })
  disponibilidad_paciente: string;

  @Column({ type: 'text', nullable: true })
  motivo_consulta: string;

  @Column({ type: 'varchar', length: 50, default: EstadoConsulta.SOLICITADA })
  estado: EstadoConsulta;

  @Column({ type: 'text', nullable: true })
  notas_previas: string;

  @Column({ type: 'uuid' })
  creado_por_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'creado_por_id' })
  creado_por: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => SesionPsicologica, (sesion) => sesion.consulta)
  sesiones: SesionPsicologica[];
}

