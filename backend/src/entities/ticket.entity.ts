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
import { Provider } from './provider.entity';
import { ChannelInteraction } from './channel-interaction.entity';
import { TicketStatusHistory } from './ticket-status-history.entity';
import { Evento } from './evento.entity';

export enum TicketStatus {
  CREADO = 'Creado',
  EN_GESTION = 'En_gestion',
  ASIGNADO_A_PRESTADOR = 'Asignado_a_prestador',
  EN_ATENCION = 'En_atencion',
  CERRADO = 'Cerrado',
  FUSIONADO = 'Fusionado',
}

export enum TicketCategory {
  AMBULATORIA = 'Ambulatoria',
  URGENCIA = 'Urgencia',
  HOSPITALARIA = 'Hospitalaria',
  QUIRURGICA = 'Quirurgica',
}

export enum TicketChannel {
  WHATSAPP = 'WhatsApp',
  TELEFONICO = 'Telefonico',
  WEB = 'Web',
}

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  ticket_id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  ticket_number: string;

  @ManyToOne(() => Patient, { nullable: true })
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @Column({ nullable: true })
  patient_id: string;

  @Column({ type: 'varchar', length: 20 })
  channel: TicketChannel;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  observations: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  categoria_solicitud: TicketCategory;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  nivel_confianza_clasificacion: number;

  @Column({ type: 'boolean', default: false })
  requiere_validacion_manual: boolean;

  @Column({ type: 'jsonb', nullable: true })
  justificacion_clasificacion: any;

  @ManyToOne(() => Provider, { nullable: true })
  @JoinColumn({ name: 'prestador_asignado_id' })
  prestador_asignado: Provider;

  @Column({ nullable: true })
  prestador_asignado_id: string;

  @Column({ type: 'jsonb', nullable: true })
  prestadores_alternativos_ids: string[];

  @Column({ type: 'text', nullable: true })
  justificacion_asignacion: string;

  @Column({ type: 'varchar', length: 30, default: TicketStatus.CREADO })
  status: TicketStatus;

  @Column({ type: 'boolean', default: false })
  paciente_sin_perfil: boolean;

  @ManyToOne(() => Evento, { nullable: true })
  @JoinColumn({ name: 'evento_id' })
  evento: Evento;

  @Column({ nullable: true })
  evento_id: string;

  // Timestamps clave para SLA
  @CreateDateColumn()
  fecha_hora_creacion_ticket: Date;

  @Column({ type: 'timestamp', nullable: true })
  fecha_hora_primera_respuesta: Date;

  @Column({ type: 'timestamp', nullable: true })
  fecha_hora_asignacion_prestador: Date;

  @Column({ type: 'timestamp', nullable: true })
  fecha_hora_cierre_ticket: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relaciones
  @OneToMany(() => ChannelInteraction, (interaction) => interaction.ticket)
  interactions: ChannelInteraction[];

  @OneToMany(() => TicketStatusHistory, (history) => history.ticket)
  status_history: TicketStatusHistory[];
}

