import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { StatisticsService } from './statistics.service';

@Controller('statistics')
@UseGuards(JwtAuthGuard)
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('dashboard')
  async getDashboardStats() {
    return await this.statisticsService.getDashboardStats();
  }

  @Get('predictive')
  async getPredictiveStats() {
    return await this.statisticsService.getPredictiveStats();
  }

  @Get('sla')
  async getSLAStats() {
    return await this.statisticsService.getSLAStats();
  }

  @Get('diagnostics')
  async getDiagnosticStats() {
    return await this.statisticsService.getDiagnosticStats();
  }
}
