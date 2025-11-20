import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum UserRole {
  AGENTE = 'Agente',
  SUPERVISOR = 'Supervisor',
  SUPERVISOR_MEDICO = 'Supervisor_Medico',
  ADMIN = 'Admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  user_id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  apellido: string;

  @Column({ type: 'varchar', length: 30, default: UserRole.AGENTE })
  role: UserRole;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

