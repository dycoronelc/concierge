import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from '../../entities/ticket.entity';
import { Patient } from '../../entities/patient.entity';
import { Evento } from '../../entities/evento.entity';
import { Encuentro } from '../../entities/encuentro.entity';
import { ServicioEnfermeria } from '../../entities/servicio-enfermeria.entity';
import { SolicitudTransporte } from '../../entities/solicitud-transporte.entity';
import { SolicitudEstudio } from '../../entities/solicitud-estudio.entity';
import { ICD10 } from '../../entities/icd10.entity';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Ticket)
    private ticketRepo: Repository<Ticket>,
    @InjectRepository(Patient)
    private patientRepo: Repository<Patient>,
    @InjectRepository(Evento)
    private eventoRepo: Repository<Evento>,
    @InjectRepository(Encuentro)
    private encuentroRepo: Repository<Encuentro>,
    @InjectRepository(ServicioEnfermeria)
    private servicioEnfermeriaRepo: Repository<ServicioEnfermeria>,
    @InjectRepository(SolicitudTransporte)
    private solicitudTransporteRepo: Repository<SolicitudTransporte>,
    @InjectRepository(SolicitudEstudio)
    private solicitudEstudioRepo: Repository<SolicitudEstudio>,
    @InjectRepository(ICD10)
    private icd10Repo: Repository<ICD10>,
  ) {}

  async getDashboardStats() {
    const now = new Date();
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Tickets por estado
    const ticketsByStatus = await this.ticketRepo
      .createQueryBuilder('ticket')
      .select('ticket.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('ticket.status')
      .getRawMany();

    // Tickets por canal
    const ticketsByChannel = await this.ticketRepo
      .createQueryBuilder('ticket')
      .select('ticket.channel', 'channel')
      .addSelect('COUNT(*)', 'count')
      .groupBy('ticket.channel')
      .getRawMany();

    // Tickets por categoría
    const ticketsByCategory = await this.ticketRepo
      .createQueryBuilder('ticket')
      .select('ticket.categoria_solicitud', 'categoria')
      .addSelect('COUNT(*)', 'count')
      .where('ticket.categoria_solicitud IS NOT NULL')
      .groupBy('ticket.categoria_solicitud')
      .getRawMany();

    // Tickets por día (últimos 30 días)
    const ticketsByDay = await this.ticketRepo
      .createQueryBuilder('ticket')
      .select("DATE_TRUNC('day', ticket.fecha_hora_creacion_ticket)", 'date')
      .addSelect('COUNT(*)', 'count')
      .where('ticket.fecha_hora_creacion_ticket >= :last30Days', { last30Days })
      .groupBy("DATE_TRUNC('day', ticket.fecha_hora_creacion_ticket)")
      .orderBy("DATE_TRUNC('day', ticket.fecha_hora_creacion_ticket)", 'ASC')
      .getRawMany();

    // Tiempo promedio de resolución
    const avgResolutionTime = await this.ticketRepo
      .createQueryBuilder('ticket')
      .select(
        "AVG(EXTRACT(EPOCH FROM (ticket.fecha_hora_cierre_ticket - ticket.fecha_hora_creacion_ticket)) / 3600)",
        'avgHours',
      )
      .where('ticket.fecha_hora_cierre_ticket IS NOT NULL')
      .getRawOne();

    // Eventos por estado
    const eventosByStatus = await this.eventoRepo
      .createQueryBuilder('evento')
      .select('evento.estado_evento', 'estado')
      .addSelect('COUNT(*)', 'count')
      .groupBy('evento.estado_evento')
      .getRawMany();

    // Encuentros por tipo
    const encuentrosByType = await this.encuentroRepo
      .createQueryBuilder('encuentro')
      .select('encuentro.tipo_encuentro', 'tipo')
      .addSelect('COUNT(*)', 'count')
      .groupBy('encuentro.tipo_encuentro')
      .getRawMany();

    // Servicios de enfermería por estado
    const serviciosByStatus = await this.servicioEnfermeriaRepo
      .createQueryBuilder('servicio')
      .select('servicio.estado', 'estado')
      .addSelect('COUNT(*)', 'count')
      .groupBy('servicio.estado')
      .getRawMany();

    // Total de pacientes
    const totalPatients = await this.patientRepo.count();

    // Tickets creados hoy
    const ticketsToday = await this.ticketRepo
      .createQueryBuilder('ticket')
      .where("DATE(ticket.fecha_hora_creacion_ticket) = CURRENT_DATE")
      .getCount();

    // Tickets cerrados hoy
    const ticketsClosedToday = await this.ticketRepo
      .createQueryBuilder('ticket')
      .where("DATE(ticket.fecha_hora_cierre_ticket) = CURRENT_DATE")
      .getCount();

    // Tasa de cierre (últimos 7 días)
    const ticketsLast7Days = await this.ticketRepo
      .createQueryBuilder('ticket')
      .where('ticket.fecha_hora_creacion_ticket >= :last7Days', { last7Days })
      .getCount();

    const closedLast7Days = await this.ticketRepo
      .createQueryBuilder('ticket')
      .where('ticket.fecha_hora_creacion_ticket >= :last7Days', { last7Days })
      .andWhere('ticket.status = :status', { status: 'Cerrado' })
      .getCount();

    const closureRate = ticketsLast7Days > 0 ? (closedLast7Days / ticketsLast7Days) * 100 : 0;

    return {
      kpis: {
        totalTickets: await this.ticketRepo.count(),
        totalPatients,
        totalEventos: await this.eventoRepo.count(),
        ticketsToday,
        ticketsClosedToday,
        avgResolutionHours: parseFloat(avgResolutionTime?.avgHours || '0'),
        closureRate: Math.round(closureRate * 100) / 100,
      },
      ticketsByStatus: ticketsByStatus.map((item) => ({
        name: item.status,
        value: parseInt(item.count),
      })),
      ticketsByChannel: ticketsByChannel.map((item) => ({
        name: item.channel,
        value: parseInt(item.count),
      })),
      ticketsByCategory: ticketsByCategory.map((item) => ({
        name: item.categoria,
        value: parseInt(item.count),
      })),
      ticketsByDay: ticketsByDay.map((item) => ({
        date: new Date(item.date).toISOString().split('T')[0],
        count: parseInt(item.count),
      })),
      eventosByStatus: eventosByStatus.map((item) => ({
        name: item.estado,
        value: parseInt(item.count),
      })),
      encuentrosByType: encuentrosByType.map((item) => ({
        name: item.tipo,
        value: parseInt(item.count),
      })),
      serviciosByStatus: serviciosByStatus.map((item) => ({
        name: item.estado,
        value: parseInt(item.count),
      })),
    };
  }

  async getPredictiveStats() {
    const now = new Date();
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Obtener tickets de los últimos 30 días
    const ticketsLast30Days = await this.ticketRepo
      .createQueryBuilder('ticket')
      .select("DATE_TRUNC('day', ticket.fecha_hora_creacion_ticket)", 'date')
      .addSelect('COUNT(*)', 'count')
      .where('ticket.fecha_hora_creacion_ticket >= :last30Days', { last30Days })
      .groupBy("DATE_TRUNC('day', ticket.fecha_hora_creacion_ticket)")
      .orderBy("DATE_TRUNC('day', ticket.fecha_hora_creacion_ticket)", 'ASC')
      .getRawMany();

    // Calcular tendencia y proyección
    const dailyCounts = ticketsLast30Days.map((item) => parseInt(item.count));
    const avgDaily = dailyCounts.reduce((a, b) => a + b, 0) / dailyCounts.length || 0;

    // Calcular tendencia (regresión lineal simple)
    let trend = 0;
    if (dailyCounts.length > 1) {
      const n = dailyCounts.length;
      const sumX = (n * (n + 1)) / 2;
      const sumY = dailyCounts.reduce((a, b) => a + b, 0);
      const sumXY = dailyCounts.reduce((sum, y, i) => sum + (i + 1) * y, 0);
      const sumX2 = (n * (n + 1) * (2 * n + 1)) / 6;
      trend = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    }

    // Proyección para los próximos 7 días
    const projection = [];
    const lastDate = ticketsLast30Days.length > 0 
      ? new Date(ticketsLast30Days[ticketsLast30Days.length - 1].date)
      : now;
    
    for (let i = 1; i <= 7; i++) {
      const futureDate = new Date(lastDate);
      futureDate.setDate(futureDate.getDate() + i);
      const projectedCount = Math.max(0, Math.round(avgDaily + trend * (dailyCounts.length + i)));
      projection.push({
        date: futureDate.toISOString().split('T')[0],
        count: projectedCount,
        type: 'projected',
      });
    }

    // Proyección de carga de trabajo (basada en tendencia de eventos)
    const eventosLast30Days = await this.eventoRepo
      .createQueryBuilder('evento')
      .where('evento.fecha_inicio >= :last30Days', { last30Days })
      .getCount();

    const avgEventosPerDay = eventosLast30Days / 30;
    const projectedEventosNext7Days = Math.round(avgEventosPerDay * 7);

    // Proyección de servicios de enfermería
    const serviciosLast30Days = await this.servicioEnfermeriaRepo
      .createQueryBuilder('servicio')
      .where('servicio.created_at >= :last30Days', { last30Days })
      .getCount();

    const avgServiciosPerDay = serviciosLast30Days / 30;
    const projectedServiciosNext7Days = Math.round(avgServiciosPerDay * 7);

    return {
      trend: {
        direction: trend > 0 ? 'up' : trend < 0 ? 'down' : 'stable',
        value: Math.round(trend * 100) / 100,
        description: trend > 0 
          ? `Aumento de ${Math.abs(Math.round(trend * 100) / 100)} tickets por día`
          : trend < 0
          ? `Disminución de ${Math.abs(Math.round(trend * 100) / 100)} tickets por día`
          : 'Tendencia estable',
      },
      projection: {
        next7Days: projection,
        avgDailyTickets: Math.round(avgDaily * 100) / 100,
        projectedTotalNext7Days: projection.reduce((sum, item) => sum + item.count, 0),
      },
      workload: {
        projectedEventosNext7Days,
        projectedServiciosNext7Days,
        projectedTransporteNext7Days: Math.round((await this.solicitudTransporteRepo.count() / 30) * 7),
      },
    };
  }

  async getSLAStats() {
    // Tickets que exceden SLA (más de 24 horas sin cerrar)
    const ticketsExceedingSLA = await this.ticketRepo
      .createQueryBuilder('ticket')
      .where('ticket.status != :status', { status: 'Cerrado' })
      .andWhere(
        "EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - ticket.fecha_hora_creacion_ticket)) / 3600 > 24",
      )
      .getCount();

    // Tiempo promedio por estado
    const avgTimeByStatus = await this.ticketRepo
      .createQueryBuilder('ticket')
      .select('ticket.status', 'status')
      .addSelect(
        "AVG(EXTRACT(EPOCH FROM (COALESCE(ticket.fecha_hora_cierre_ticket, CURRENT_TIMESTAMP) - ticket.fecha_hora_creacion_ticket)) / 3600)",
        'avgHours',
      )
      .groupBy('ticket.status')
      .getRawMany();

    const totalTickets = await this.ticketRepo.count();
    const slaComplianceRate =
      totalTickets > 0 ? ((totalTickets - ticketsExceedingSLA) / totalTickets) * 100 : 100;

    return {
      ticketsExceedingSLA,
      slaComplianceRate: Math.round(slaComplianceRate * 100) / 100,
      avgTimeByStatus: avgTimeByStatus.map((item) => ({
        status: item.status,
        avgHours: parseFloat(item.avgHours || '0'),
      })),
    };
  }

  async getDiagnosticStats() {
    // Top 10 diagnósticos más frecuentes
    const topDiagnostics = await this.eventoRepo
      .createQueryBuilder('evento')
      .innerJoin('evento.diagnostico_icd', 'icd10')
      .select('icd10.codigo', 'codigo')
      .addSelect('icd10.descripcion', 'descripcion')
      .addSelect('icd10.categoria', 'categoria')
      .addSelect('COUNT(*)', 'count')
      .where('evento.diagnostico_icd_id IS NOT NULL')
      .groupBy('icd10.codigo')
      .addGroupBy('icd10.descripcion')
      .addGroupBy('icd10.categoria')
      .orderBy('COUNT(*)', 'DESC')
      .limit(10)
      .getRawMany();

    // Diagnósticos por categoría ICD-10
    const diagnosticsByCategory = await this.eventoRepo
      .createQueryBuilder('evento')
      .innerJoin('evento.diagnostico_icd', 'icd10')
      .select('icd10.categoria', 'categoria')
      .addSelect('COUNT(*)', 'count')
      .where('evento.diagnostico_icd_id IS NOT NULL')
      .andWhere('icd10.categoria IS NOT NULL')
      .groupBy('icd10.categoria')
      .orderBy('COUNT(*)', 'DESC')
      .getRawMany();

    // Diagnósticos por severidad
    const diagnosticsBySeverity = await this.eventoRepo
      .createQueryBuilder('evento')
      .select('evento.severidad', 'severidad')
      .addSelect('COUNT(*)', 'count')
      .where('evento.diagnostico_icd_id IS NOT NULL')
      .andWhere('evento.severidad IS NOT NULL')
      .groupBy('evento.severidad')
      .getRawMany();

    // Total de eventos con diagnóstico
    const totalWithDiagnostic = await this.eventoRepo
      .createQueryBuilder('evento')
      .where('evento.diagnostico_icd_id IS NOT NULL')
      .getCount();

    // Total de eventos sin diagnóstico
    const totalWithoutDiagnostic = await this.eventoRepo
      .createQueryBuilder('evento')
      .where('evento.diagnostico_icd_id IS NULL')
      .getCount();

    return {
      topDiagnostics: topDiagnostics.map((item) => ({
        codigo: item.codigo,
        descripcion: item.descripcion,
        categoria: item.categoria,
        count: parseInt(item.count),
      })),
      diagnosticsByCategory: diagnosticsByCategory.map((item) => ({
        name: item.categoria || 'Sin categoría',
        value: parseInt(item.count),
      })),
      diagnosticsBySeverity: diagnosticsBySeverity.map((item) => ({
        name: item.severidad,
        value: parseInt(item.count),
      })),
      summary: {
        totalWithDiagnostic,
        totalWithoutDiagnostic,
        totalEventos: totalWithDiagnostic + totalWithoutDiagnostic,
        diagnosticCoverage: totalWithDiagnostic + totalWithoutDiagnostic > 0
          ? Math.round((totalWithDiagnostic / (totalWithDiagnostic + totalWithoutDiagnostic)) * 100 * 100) / 100
          : 0,
      },
    };
  }
}
