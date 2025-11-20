import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Encuentro, TipoEncuentro, EstadoEncuentro } from '../../entities/encuentro.entity';
import { Evento } from '../../entities/evento.entity';
import { Ticket } from '../../entities/ticket.entity';
import { Provider } from '../../entities/provider.entity';

@Injectable()
export class EncuentrosService {
  constructor(
    @InjectRepository(Encuentro)
    private encuentroRepository: Repository<Encuentro>,
    @InjectRepository(Evento)
    private eventoRepository: Repository<Evento>,
    @InjectRepository(Ticket)
    private ticketRepository: Repository<Ticket>,
    @InjectRepository(Provider)
    private providerRepository: Repository<Provider>,
  ) {}

  async create(data: {
    evento_id: string;
    ticket_id?: string;
    prestador_id?: string;
    tipo_encuentro: TipoEncuentro;
    fecha_programada?: Date;
    notas?: string;
  }): Promise<Encuentro> {
    // Verificar que el evento existe
    const evento = await this.eventoRepository.findOne({
      where: { evento_id: data.evento_id },
    });

    if (!evento) {
      throw new NotFoundException(`Evento ${data.evento_id} no encontrado`);
    }

    // Verificar que el ticket existe si se proporciona
    if (data.ticket_id) {
      const ticket = await this.ticketRepository.findOne({
        where: { ticket_id: data.ticket_id },
      });

      if (!ticket) {
        throw new NotFoundException(`Ticket ${data.ticket_id} no encontrado`);
      }
    }

    // Verificar que el prestador existe si se proporciona
    if (data.prestador_id) {
      const provider = await this.providerRepository.findOne({
        where: { provider_id: data.prestador_id },
      });

      if (!provider) {
        throw new NotFoundException(`Prestador ${data.prestador_id} no encontrado`);
      }
    }

    const encuentro = this.encuentroRepository.create({
      evento_id: data.evento_id,
      ticket_id: data.ticket_id,
      prestador_id: data.prestador_id,
      tipo_encuentro: data.tipo_encuentro,
      estado: EstadoEncuentro.PROGRAMADO,
      fecha_programada: data.fecha_programada,
      notas: data.notas,
    });

    return this.encuentroRepository.save(encuentro);
  }

  async findAll(filters?: {
    evento_id?: string;
    ticket_id?: string;
    prestador_id?: string;
    estado?: EstadoEncuentro;
  }): Promise<Encuentro[]> {
    const query = this.encuentroRepository
      .createQueryBuilder('encuentro')
      .leftJoinAndSelect('encuentro.evento', 'evento')
      .leftJoinAndSelect('encuentro.ticket', 'ticket')
      .leftJoinAndSelect('encuentro.prestador', 'prestador')
      .orderBy('encuentro.fecha_programada', 'DESC');

    if (filters?.evento_id) {
      query.andWhere('encuentro.evento_id = :evento_id', { evento_id: filters.evento_id });
    }

    if (filters?.ticket_id) {
      query.andWhere('encuentro.ticket_id = :ticket_id', { ticket_id: filters.ticket_id });
    }

    if (filters?.prestador_id) {
      query.andWhere('encuentro.prestador_id = :prestador_id', {
        prestador_id: filters.prestador_id,
      });
    }

    if (filters?.estado) {
      query.andWhere('encuentro.estado = :estado', { estado: filters.estado });
    }

    return query.getMany();
  }

  async findOne(encuentro_id: string): Promise<Encuentro> {
    const encuentro = await this.encuentroRepository.findOne({
      where: { encuentro_id },
      relations: ['evento', 'ticket', 'prestador'],
    });

    if (!encuentro) {
      throw new NotFoundException(`Encuentro ${encuentro_id} no encontrado`);
    }

    return encuentro;
  }

  async update(encuentro_id: string, updates: {
    prestador_id?: string;
    tipo_encuentro?: TipoEncuentro;
    estado?: EstadoEncuentro;
    fecha_programada?: Date;
    fecha_real?: Date;
    resultado?: string;
    notas?: string;
  }): Promise<Encuentro> {
    const encuentro = await this.findOne(encuentro_id);

    if (updates.prestador_id) {
      const provider = await this.providerRepository.findOne({
        where: { provider_id: updates.prestador_id },
      });

      if (!provider) {
        throw new NotFoundException(`Prestador ${updates.prestador_id} no encontrado`);
      }
    }

    // Si se marca como completado, establecer fecha_real si no está
    if (updates.estado === EstadoEncuentro.COMPLETADO && !updates.fecha_real) {
      updates.fecha_real = new Date();
    }

    Object.assign(encuentro, updates);
    return this.encuentroRepository.save(encuentro);
  }

  async delete(encuentro_id: string): Promise<void> {
    const encuentro = await this.findOne(encuentro_id);
    await this.encuentroRepository.remove(encuentro);
  }
}

