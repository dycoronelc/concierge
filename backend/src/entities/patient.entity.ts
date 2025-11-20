import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Ticket } from './ticket.entity';

@Entity('patients')
export class Patient {
  @PrimaryGeneratedColumn('uuid')
  patient_id: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  cedula: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  numero_poliza: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  id_seguro: string;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  apellido: string;

  @Column({ type: 'varchar', length: 20 })
  telefono_1: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono_2: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  // Ubicación
  @Column({ type: 'text', nullable: true })
  direccion_textual: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  ciudad: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  provincia: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitud: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitud: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Ticket, (ticket) => ticket.patient)
  tickets: Ticket[];
}

