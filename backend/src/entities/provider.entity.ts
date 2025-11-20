import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Ticket } from './ticket.entity';

export enum ProviderType {
  ALIADO = 'Aliado',
  RED = 'Red',
}

@Entity('providers')
export class Provider {
  @PrimaryGeneratedColumn('uuid')
  provider_id: string;

  @Column({ type: 'varchar', length: 200 })
  nombre: string;

  @Column({ type: 'varchar', length: 20 })
  tipo: ProviderType;

  @Column({ type: 'text', array: true, default: [] })
  categorias: string[]; // Ambulatoria, Urgencia, Hospitalaria, Quirurgica

  // Cobertura geográfica
  @Column({ type: 'text', array: true, default: [] })
  ciudades: string[];

  @Column({ type: 'text', array: true, default: [] })
  provincias: string[];

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitud: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitud: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  radio_cobertura_km: number;

  @Column({ type: 'boolean', default: true })
  disponible: boolean;

  @Column({ type: 'int', default: 0 })
  carga_trabajo_actual: number;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Ticket, (ticket) => ticket.prestador_asignado)
  tickets: Ticket[];
}

