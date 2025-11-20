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

export enum TipoTraslado {
  ORDINARIO = 'Ordinario',
  ASISTIDO = 'Asistido',
  URGENTE = 'Urgente',
  AMBULANCIA = 'Ambulancia',
}

export enum EstadoSolicitudTransporte {
  SOLICITADO = 'Solicitado',
  ASIGNADO = 'Asignado',
  EN_CAMINO_ORIGEN = 'En_Camino_Origen',
  EN_ORIGEN = 'En_Origen',
  EN_TRASLADO = 'En_Traslado',
  COMPLETADO = 'Completado',
  CANCELADO = 'Cancelado',
}

@Entity('solicitudes_transporte')
export class SolicitudTransporte {
  @PrimaryGeneratedColumn('uuid')
  solicitud_id: string;

  @Column({ type: 'uuid' })
  patient_id: string;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @Column({ type: 'uuid', nullable: true })
  ticket_id: string;

  @ManyToOne(() => Ticket, { nullable: true })
  @JoinColumn({ name: 'ticket_id' })
  ticket: Ticket;

  @Column({
    type: 'varchar',
    length: 50,
    default: TipoTraslado.ORDINARIO,
  })
  tipo_traslado: TipoTraslado;

  @Column({ type: 'text' })
  direccion_origen: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitud_origen: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitud_origen: number;

  @Column({ type: 'text' })
  direccion_destino: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitud_destino: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitud_destino: number;

  @Column({
    type: 'varchar',
    length: 50,
    default: EstadoSolicitudTransporte.SOLICITADO,
  })
  estado: EstadoSolicitudTransporte;

  @Column({ type: 'uuid', nullable: true })
  vehiculo_asignado_id: string;

  @Column({ type: 'uuid', nullable: true })
  conductor_asignado_id: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'conductor_asignado_id' })
  conductor_asignado: User;

  @Column({ type: 'timestamp', nullable: true })
  fecha_programada: Date;

  @Column({ type: 'timestamp', nullable: true })
  fecha_inicio: Date;

  @Column({ type: 'timestamp', nullable: true })
  fecha_llegada_origen: Date;

  @Column({ type: 'timestamp', nullable: true })
  fecha_llegada_destino: Date;

  @Column({ type: 'integer', nullable: true })
  duracion_minutos: number;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @Column({ type: 'uuid' })
  creado_por_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'creado_por_id' })
  creado_por: User;

  @Column({ type: 'boolean', default: false })
  requiere_gps: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

