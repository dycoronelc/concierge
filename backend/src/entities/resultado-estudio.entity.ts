import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SolicitudEstudio } from './solicitud-estudio.entity';
import { Evento } from './evento.entity';
import { User } from './user.entity';

@Entity('resultados_estudios')
export class ResultadoEstudio {
  @PrimaryGeneratedColumn('uuid')
  resultado_id: string;

  @Column({ type: 'uuid' })
  solicitud_estudio_id: string;

  @ManyToOne(() => SolicitudEstudio)
  @JoinColumn({ name: 'solicitud_estudio_id' })
  solicitud_estudio: SolicitudEstudio;

  @Column({ type: 'uuid', nullable: true })
  evento_id: string;

  @ManyToOne(() => Evento, { nullable: true })
  @JoinColumn({ name: 'evento_id' })
  evento: Evento;

  @Column({ type: 'text', nullable: true })
  resultado_texto: string;

  @Column({ type: 'text', nullable: true })
  resultado_json: string; // Para resultados estructurados

  @Column({ type: 'varchar', length: 255, nullable: true })
  archivo_resultado_url: string;

  @Column({ type: 'timestamp', nullable: true })
  fecha_resultado: Date;

  @Column({ type: 'uuid', nullable: true })
  revisado_por_id: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'revisado_por_id' })
  revisado_por: User;

  @Column({ type: 'boolean', default: false })
  requiere_seguimiento: boolean;

  @Column({ type: 'text', nullable: true })
  notas_medicas: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

