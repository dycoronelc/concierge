import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TransporteService } from './transporte.service';

@Controller('transporte')
@UseGuards(JwtAuthGuard)
export class TransporteController {
  constructor(private readonly transporteService: TransporteService) {}

  @Post('solicitudes')
  async createSolicitud(@Body() data: any, @Request() req) {
    return await this.transporteService.createSolicitud({
      ...data,
      creado_por_id: req.user.user_id,
    });
  }

  @Get('solicitudes')
  async findAll(@Query() params: any) {
    return await this.transporteService.findAll(params);
  }

  @Get('solicitudes/:id')
  async findOne(@Param('id') id: string) {
    return await this.transporteService.findOne(id);
  }

  @Put('solicitudes/:id/asignar')
  async asignarVehiculo(
    @Param('id') id: string,
    @Body() data: { vehiculo_id: string; conductor_id: string },
  ) {
    return await this.transporteService.asignarVehiculo(id, data.vehiculo_id, data.conductor_id);
  }

  @Put('solicitudes/:id/iniciar')
  async iniciarTraslado(@Param('id') id: string) {
    return await this.transporteService.iniciarTraslado(id);
  }

  @Put('solicitudes/:id/completar')
  async completarTraslado(
    @Param('id') id: string,
    @Body() data: { observaciones?: string },
  ) {
    return await this.transporteService.completarTraslado(id, data.observaciones);
  }

  @Put('vehiculos/:id/ubicacion')
  async actualizarUbicacion(
    @Param('id') id: string,
    @Body() data: { latitud: number; longitud: number },
  ) {
    return await this.transporteService.actualizarUbicacionVehiculo(id, data.latitud, data.longitud);
  }

  @Get('vehiculos/disponibles')
  async getVehiculosDisponibles() {
    return await this.transporteService.getVehiculosDisponibles();
  }

  @Get('vehiculos')
  async getAllVehiculos() {
    return await this.transporteService.getAllVehiculos();
  }

  @Post('vehiculos')
  async createVehiculo(@Body() data: any) {
    return await this.transporteService.createVehiculo(data);
  }
}

