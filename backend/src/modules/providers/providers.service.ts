import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Provider, ProviderType } from '../../entities/provider.entity';
import { Ticket, TicketCategory } from '../../entities/ticket.entity';

@Injectable()
export class ProvidersService {
  constructor(
    @InjectRepository(Provider)
    private providerRepository: Repository<Provider>,
  ) {}

  async findAll(): Promise<Provider[]> {
    return this.providerRepository.find({
      order: { nombre: 'ASC' },
    });
  }

  async findOne(provider_id: string): Promise<Provider> {
    const provider = await this.providerRepository.findOne({
      where: { provider_id },
    });

    if (!provider) {
      throw new NotFoundException(`Prestador ${provider_id} no encontrado`);
    }

    return provider;
  }

  async findAvailableProviders(
    ubicacion: { ciudad?: string; provincia?: string; latitud?: number; longitud?: number },
    categoria: TicketCategory,
  ): Promise<{ aliados: Provider[]; red: Provider[] }> {
    const query = this.providerRepository
      .createQueryBuilder('provider')
      .where('provider.disponible = :disponible', { disponible: true })
      .andWhere(':categoria = ANY(provider.categorias)', { categoria });

    // Filtrar por ubicación si está disponible
    if (ubicacion.ciudad) {
      query.andWhere(':ciudad = ANY(provider.ciudades)', { ciudad: ubicacion.ciudad });
    } else if (ubicacion.provincia) {
      query.andWhere(':provincia = ANY(provider.provincias)', { provincia: ubicacion.provincia });
    }

    const allProviders = await query.getMany();

    // Separar aliados y red
    const aliados = allProviders.filter((p) => p.tipo === ProviderType.ALIADO);
    const red = allProviders.filter((p) => p.tipo === ProviderType.RED);

    // Ordenar aliados por carga de trabajo
    aliados.sort((a, b) => a.carga_trabajo_actual - b.carga_trabajo_actual);

    return { aliados, red };
  }

  async assignProvider(
    ticket_id: string,
    provider_id: string,
    categoria: TicketCategory,
    ubicacion: any,
  ): Promise<{ prestador_asignado: Provider; alternativos: Provider[] }> {
    const provider = await this.findOne(provider_id);
    const alternativos = await this.findAvailableProviders(ubicacion, categoria);

    return {
      prestador_asignado: provider,
      alternativos: [...alternativos.aliados, ...alternativos.red].filter(
        (p) => p.provider_id !== provider_id,
      ),
    };
  }

  async create(data: Partial<Provider>): Promise<Provider> {
    const provider = this.providerRepository.create(data);
    return this.providerRepository.save(provider);
  }

  async update(provider_id: string, updates: Partial<Provider>): Promise<Provider> {
    const provider = await this.findOne(provider_id);
    Object.assign(provider, updates);
    return this.providerRepository.save(provider);
  }
}

