import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ICD10Service } from './icd10.service';
import { ICD10 } from '../../entities/icd10.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('icd10')
@UseGuards(JwtAuthGuard)
export class ICD10Controller {
  constructor(private readonly icd10Service: ICD10Service) {}

  @Post()
  async create(
    @Body() data: {
      codigo: string;
      descripcion: string;
      descripcion_completa?: string;
      categoria?: string;
    },
  ): Promise<ICD10> {
    return this.icd10Service.create(data);
  }

  @Get()
  async findAll(
    @Query('search') search?: string,
    @Query('categoria') categoria?: string,
    @Query('activo') activo?: string,
  ): Promise<ICD10[]> {
    return this.icd10Service.findAll({
      search,
      categoria,
      activo: activo === 'true' ? true : activo === 'false' ? false : undefined,
    });
  }

  @Get('search')
  async search(
    @Query('q') searchTerm: string,
    @Query('limit') limit?: string,
  ): Promise<ICD10[]> {
    return this.icd10Service.search(searchTerm, limit ? parseInt(limit) : 20);
  }

  @Get('code/:codigo')
  async findByCode(@Param('codigo') codigo: string): Promise<ICD10 | null> {
    return this.icd10Service.findByCode(codigo);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ICD10> {
    return this.icd10Service.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updates: {
      descripcion?: string;
      descripcion_completa?: string;
      categoria?: string;
      activo?: boolean;
    },
  ): Promise<ICD10> {
    return this.icd10Service.update(id, updates);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    await this.icd10Service.delete(id);
    return { message: 'Diagnóstico ICD-10 eliminado correctamente' };
  }
}

