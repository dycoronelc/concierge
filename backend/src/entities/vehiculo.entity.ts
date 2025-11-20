import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum TipoVehiculo {
  SEDAN = 'Sedan',
  SUV = 'SUV',
  AMBULANCIA = 'Ambulancia',
  UCI_MOVIL = 'UCI_Movil',
  OTRO = 'Otro',
}

export enum EstadoVehiculo {
  DISPONIBLE = 'Disponible',
  EN_USO = 'En_Uso',
  MANTENIMIENTO = 'Mantenimiento',
  NO_DISPONIBLE = 'No_Disponible',
}

@Entity('vehiculos')
export class Vehiculo {
  @PrimaryGeneratedColumn('uuid')
  vehiculo_id: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  placa: string;

  @Column({ type: 'varchar', length: 100 })
  marca: string;

  @Column({ type: 'varchar', length: 100 })
  modelo: string;

  @Column({ type: 'integer', nullable: true })
  año: number;

  @Column({
    type: 'varchar',
    length: 50,
    default: TipoVehiculo.SEDAN,
  })
  tipo: TipoVehiculo;

  @Column({
    type: 'varchar',
    length: 50,
    default: EstadoVehiculo.DISPONIBLE,
  })
  estado: EstadoVehiculo;

  @Column({ type: 'varchar', length: 100, nullable: true })
  conductor_asignado: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitud_actual: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitud_actual: number;

  @Column({ type: 'timestamp', nullable: true })
  ultima_actualizacion_gps: Date;

  @Column({ type: 'text', nullable: true })
  notas: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

