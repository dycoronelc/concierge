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
import { Ticket } from './ticket.entity';
import { Evento } from './evento.entity';

export enum TipoEstudio {
  SANGRE = 'Sangre',
  ORINA = 'Orina',
  HECES = 'Heces',
  IMAGEN = 'Imagen',
  GENETICO = 'Genético',
  GENOMICO = 'Genómico',
  OTRO = 'Otro',
}

export enum EstadoSolicitudEstudio {
  SOLICITADO = 'Solicitado',
  AUTORIZADO = 'Autorizado',
  PROGRAMADO = 'Programado',
  EN_PROCESO = 'En_Proceso',
  COMPLETADO = 'Completado',
  CANCELADO = 'Cancelado',
}

@Entity('solicitudes_estudios')
export class SolicitudEstudio {
  @PrimaryGeneratedColumn('uuid')
  solicitud_id: string;

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

  @Column({
    type: 'varchar',
    length: 50,
  })
  tipo_estudio: TipoEstudio;

  @Column({ type: 'varchar', length: 200 })
  nombre_estudio: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({
    type: 'varchar',
    length: 50,
    default: EstadoSolicitudEstudio.SOLICITADO,
  })
  estado: EstadoSolicitudEstudio;

  @Column({ type: 'boolean', default: false })
  toma_domicilio: boolean;

  @Column({ type: 'uuid', nullable: true })
  tecnico_asignado_id: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'tecnico_asignado_id' })
  tecnico_asignado: User;

  @Column({ type: 'timestamp', nullable: true })
  fecha_programada: Date;

  @Column({ type: 'timestamp', nullable: true })
  fecha_toma_muestra: Date;

  @Column({ type: 'text', nullable: true })
  cadena_custodia: string;

  @Column({ type: 'boolean', default: false })
  requiere_consentimiento: boolean;

  @Column({ type: 'uuid', nullable: true })
  consentimiento_id: string;

  @Column({ type: 'uuid' })
  solicitado_por_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'solicitado_por_id' })
  solicitado_por: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

