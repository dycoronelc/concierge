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

export enum TipoCuidadoEnfermeria {
  HERIDAS = 'Heridas',
  INYECCIONES = 'Inyecciones',
  EDUCACION = 'Educación',
  MONITOREO = 'Monitoreo',
  OTRO = 'Otro',
}

export enum EstadoServicioEnfermeria {
  SOLICITADO = 'Solicitado',
  ASIGNADO = 'Asignado',
  EN_CAMINO = 'En_Camino',
  EN_PROCESO = 'En_Proceso',
  COMPLETADO = 'Completado',
  CANCELADO = 'Cancelado',
}

@Entity('servicios_enfermeria')
export class ServicioEnfermeria {
  @PrimaryGeneratedColumn('uuid')
  servicio_id: string;

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
    default: TipoCuidadoEnfermeria.OTRO,
  })
  tipo_cuidado: TipoCuidadoEnfermeria;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({
    type: 'varchar',
    length: 50,
    default: EstadoServicioEnfermeria.SOLICITADO,
  })
  estado: EstadoServicioEnfermeria;

  @Column({ type: 'uuid', nullable: true })
  enfermero_asignado_id: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'enfermero_asignado_id' })
  enfermero_asignado: User;

  @Column({ type: 'timestamp', nullable: true })
  fecha_programada: Date;

  @Column({ type: 'timestamp', nullable: true })
  fecha_realizada: Date;

  @Column({ type: 'text', nullable: true })
  notas_visita: string;

  @Column({ type: 'uuid' })
  creado_por_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'creado_por_id' })
  creado_por: User;

  @Column({ type: 'boolean', default: false })
  requiere_seguimiento: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

