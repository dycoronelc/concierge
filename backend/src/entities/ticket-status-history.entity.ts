import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Ticket, TicketStatus } from './ticket.entity';

@Entity('ticket_status_history')
export class TicketStatusHistory {
  @PrimaryGeneratedColumn('uuid')
  history_id: string;

  @ManyToOne(() => Ticket)
  @JoinColumn({ name: 'ticket_id' })
  ticket: Ticket;

  @Column()
  ticket_id: string;

  @Column({ type: 'varchar', length: 30 })
  estado_anterior: TicketStatus;

  @Column({ type: 'varchar', length: 30 })
  estado_nuevo: TicketStatus;

  @Column({ type: 'varchar', length: 100, nullable: true })
  usuario: string;

  @Column({ type: 'varchar', length: 50, default: 'Sistema' })
  nombre_sistema: string;

  @Column({ type: 'text', nullable: true })
  motivo: string;

  @CreateDateColumn()
  fecha_hora: Date;
}

