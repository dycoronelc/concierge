import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Evento } from './evento.entity';
import { Ticket } from './ticket.entity';
import { Provider } from './provider.entity';

export enum TipoEncuentro {
  CONSULTA = 'Consulta',
  URGENCIA = 'Urgencia',
  HOSPITALIZACION = 'Hospitalizacion',
  CIRUGIA = 'Cirugia',
  EXAMEN = 'Examen',
  SEGUIMIENTO = 'Seguimiento',
}

export enum EstadoEncuentro {
  PROGRAMADO = 'Programado',
  EN_CURSO = 'En_curso',
  COMPLETADO = 'Completado',
  CANCELADO = 'Cancelado',
}

@Entity('encuentros')
export class Encuentro {
  @PrimaryGeneratedColumn('uuid')
  encuentro_id: string;

  @ManyToOne(() => Evento, { nullable: false })
  @JoinColumn({ name: 'evento_id' })
  evento: Evento;

  @Column({ nullable: false })
  evento_id: string;

  @ManyToOne(() => Ticket, { nullable: true })
  @JoinColumn({ name: 'ticket_id' })
  ticket: Ticket;

  @Column({ nullable: true })
  ticket_id: string;

  @ManyToOne(() => Provider, { nullable: true })
  @JoinColumn({ name: 'prestador_id' })
  prestador: Provider;

  @Column({ nullable: true })
  prestador_id: string;

  @Column({ type: 'varchar', length: 30 })
  tipo_encuentro: TipoEncuentro;

  @Column({ type: 'varchar', length: 30, default: EstadoEncuentro.PROGRAMADO })
  estado: EstadoEncuentro;

  @Column({ type: 'timestamp', nullable: true })
  fecha_programada: Date;

  @Column({ type: 'timestamp', nullable: true })
  fecha_real: Date;

  @Column({ type: 'text', nullable: true })
  resultado: string;

  @Column({ type: 'text', nullable: true })
  notas: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

