import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { ICD10 } from '../../entities/icd10.entity';

@Injectable()
export class ICD10Service {
  constructor(
    @InjectRepository(ICD10)
    private icd10Repository: Repository<ICD10>,
  ) {}

  async create(data: {
    codigo: string;
    descripcion: string;
    descripcion_completa?: string;
    categoria?: string;
  }): Promise<ICD10> {
    // Verificar que no exista un código duplicado
    const existing = await this.icd10Repository.findOne({
      where: { codigo: data.codigo },
    });

    if (existing) {
      throw new NotFoundException(`El código ICD-10 ${data.codigo} ya existe`);
    }

    const icd10 = this.icd10Repository.create(data);
    return this.icd10Repository.save(icd10);
  }

  async findAll(filters?: {
    search?: string;
    categoria?: string;
    activo?: boolean;
  }): Promise<ICD10[]> {
    const query = this.icd10Repository.createQueryBuilder('icd10');

    if (filters?.search) {
      query.where(
        '(icd10.codigo ILIKE :search OR icd10.descripcion ILIKE :search OR icd10.descripcion_completa ILIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    if (filters?.categoria) {
      query.andWhere('icd10.categoria = :categoria', { categoria: filters.categoria });
    }

    if (filters?.activo !== undefined) {
      query.andWhere('icd10.activo = :activo', { activo: filters.activo });
    }

    return query.orderBy('icd10.codigo', 'ASC').getMany();
  }

  async findOne(icd10_id: string): Promise<ICD10> {
    const icd10 = await this.icd10Repository.findOne({
      where: { icd10_id },
    });

    if (!icd10) {
      throw new NotFoundException(`Diagnóstico ICD-10 ${icd10_id} no encontrado`);
    }

    return icd10;
  }

  async findByCode(codigo: string): Promise<ICD10 | null> {
    return this.icd10Repository.findOne({
      where: { codigo },
    });
  }

  async search(searchTerm: string, limit: number = 20): Promise<ICD10[]> {
    return this.icd10Repository.find({
      where: [
        { codigo: ILike(`%${searchTerm}%`) },
        { descripcion: ILike(`%${searchTerm}%`) },
        { descripcion_completa: ILike(`%${searchTerm}%`) },
      ],
      take: limit,
      order: { codigo: 'ASC' },
    });
  }

  async update(icd10_id: string, updates: {
    descripcion?: string;
    descripcion_completa?: string;
    categoria?: string;
    activo?: boolean;
  }): Promise<ICD10> {
    const icd10 = await this.findOne(icd10_id);
    Object.assign(icd10, updates);
    return this.icd10Repository.save(icd10);
  }

  async delete(icd10_id: string): Promise<void> {
    const icd10 = await this.findOne(icd10_id);
    await this.icd10Repository.remove(icd10);
  }
}

