import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { Provider } from '../../entities/provider.entity';
import { TicketCategory } from '../../entities/ticket.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('providers')
@UseGuards(JwtAuthGuard)
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Get()
  async findAll(): Promise<Provider[]> {
    return this.providersService.findAll();
  }

  @Get('available')
  async findAvailable(
    @Query('categoria') categoria: TicketCategory,
    @Query('ciudad') ciudad?: string,
    @Query('provincia') provincia?: string,
    @Query('latitud') latitud?: number,
    @Query('longitud') longitud?: number,
  ): Promise<{ aliados: Provider[]; red: Provider[] }> {
    return this.providersService.findAvailableProviders(
      { ciudad, provincia, latitud, longitud },
      categoria,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Provider> {
    return this.providersService.findOne(id);
  }

  @Post()
  async create(@Body() data: any): Promise<Provider> {
    return this.providersService.create(data);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updates: any): Promise<Provider> {
    return this.providersService.update(id, updates);
  }
}

