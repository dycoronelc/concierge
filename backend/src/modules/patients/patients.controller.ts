import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { Patient } from '../../entities/patient.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('patients')
@UseGuards(JwtAuthGuard)
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  async create(@Body() data: any): Promise<Patient> {
    return this.patientsService.create(data);
  }

  @Get()
  async findAll(): Promise<Patient[]> {
    return this.patientsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Patient> {
    return this.patientsService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updates: any): Promise<Patient> {
    return this.patientsService.update(id, updates);
  }
}

