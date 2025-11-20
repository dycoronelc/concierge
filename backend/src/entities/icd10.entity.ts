import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Evento } from './evento.entity';

@Entity('icd10')
export class ICD10 {
  @PrimaryGeneratedColumn('uuid')
  icd10_id: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  codigo: string; // Ejemplo: "A00.0", "I10"

  @Column({ type: 'text' })
  descripcion: string;

  @Column({ type: 'text', nullable: true })
  descripcion_completa: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  categoria: string; // Ejemplo: "Enfermedades infecciosas", "Enfermedades del sistema circulatorio"

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Evento, (evento) => evento.diagnostico_icd)
  eventos: Evento[];
}

