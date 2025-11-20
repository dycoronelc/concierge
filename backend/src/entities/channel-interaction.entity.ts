import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Ticket } from './ticket.entity';

export enum InteractionType {
  MENSAJE = 'Mensaje',
  LLAMADA = 'Llamada',
  EVENTO = 'Evento',
}

@Entity('channel_interactions')
export class ChannelInteraction {
  @PrimaryGeneratedColumn('uuid')
  interaction_id: string;

  @ManyToOne(() => Ticket)
  @JoinColumn({ name: 'ticket_id' })
  ticket: Ticket;

  @Column()
  ticket_id: string;

  @Column({ type: 'varchar', length: 20 })
  tipo: InteractionType;

  @Column({ type: 'text' })
  contenido: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  numero_origen: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  numero_destino: string;

  @Column({ type: 'int', nullable: true })
  duracion_llamada_segundos: number;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @CreateDateColumn()
  fecha_hora: Date;
}

