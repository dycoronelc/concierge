import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Chip,
  useTheme,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { statisticsApi } from '@/services/api';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function DashboardPage() {
  const theme = useTheme();
  const { data: dashboardStats, isLoading: loadingDashboard } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => statisticsApi.getDashboardStats().then((res) => res.data),
  });

  const { data: predictiveStats, isLoading: loadingPredictive } = useQuery({
    queryKey: ['predictive-stats'],
    queryFn: () => statisticsApi.getPredictiveStats().then((res) => res.data),
  });

  const { data: slaStats, isLoading: loadingSLA } = useQuery({
    queryKey: ['sla-stats'],
    queryFn: () => statisticsApi.getSLAStats().then((res) => res.data),
  });

  const { data: diagnosticStats, isLoading: loadingDiagnostics } = useQuery({
    queryKey: ['diagnostic-stats'],
    queryFn: () => statisticsApi.getDiagnosticStats().then((res) => res.data),
  });

  if (loadingDashboard || loadingPredictive || loadingSLA || loadingDiagnostics) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  const kpis = dashboardStats?.kpis || {};
  const trend = predictiveStats?.trend || {};
  const projection = predictiveStats?.projection || { next7Days: [] };
  const sla = slaStats || {};

  // Combinar datos históricos y proyección para el gráfico de tendencia
  const ticketsByDay = dashboardStats?.ticketsByDay || [];
  const combinedTrendData = [
    ...ticketsByDay.map((item: any) => ({
      date: format(new Date(item.date), 'dd/MM'),
      count: item.count,
      type: 'actual',
    })),
    ...projection.next7Days.map((item: any) => ({
      date: format(new Date(item.date), 'dd/MM'),
      count: item.count,
      type: 'projected',
    })),
  ];

  const TrendIcon = trend.direction === 'up' 
    ? TrendingUpIcon 
    : trend.direction === 'down' 
    ? TrendingDownIcon 
    : TrendingFlatIcon;

  const trendColor = trend.direction === 'up' 
    ? 'error' 
    : trend.direction === 'down' 
    ? 'success' 
    : 'info';

  return (
    <Box sx={{ width: '100%', maxWidth: '100%', p: { xs: 2, sm: 3, md: 4 } }}>
      <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '1.5rem', sm: '2rem' }, mb: 3 }}>
        Dashboard - Indicadores y Proyecciones
      </Typography>

      {/* KPIs Principales */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <CardContent>
              <Typography color="white" gutterBottom variant="body2" sx={{ opacity: 0.9 }}>
                Total Tickets
              </Typography>
              <Typography variant="h4" sx={{ color: 'white', fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                {kpis.totalTickets || 0}
              </Typography>
              <Typography variant="caption" sx={{ color: 'white', opacity: 0.8 }}>
                {kpis.ticketsToday || 0} creados hoy
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
            <CardContent>
              <Typography color="white" gutterBottom variant="body2" sx={{ opacity: 0.9 }}>
                Total Pacientes
              </Typography>
              <Typography variant="h4" sx={{ color: 'white', fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                {kpis.totalPatients || 0}
              </Typography>
              <Typography variant="caption" sx={{ color: 'white', opacity: 0.8 }}>
                Registrados en el sistema
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
            <CardContent>
              <Typography color="white" gutterBottom variant="body2" sx={{ opacity: 0.9 }}>
                Tiempo Promedio
              </Typography>
              <Typography variant="h4" sx={{ color: 'white', fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                {Math.round(kpis.avgResolutionHours || 0)}h
              </Typography>
              <Typography variant="caption" sx={{ color: 'white', opacity: 0.8 }}>
                Resolución de tickets
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
            <CardContent>
              <Typography color="white" gutterBottom variant="body2" sx={{ opacity: 0.9 }}>
                Tasa de Cierre
              </Typography>
              <Typography variant="h4" sx={{ color: 'white', fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                {kpis.closureRate || 0}%
              </Typography>
              <Typography variant="caption" sx={{ color: 'white', opacity: 0.8 }}>
                Últimos 7 días
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Indicadores SLA y Tendencia */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h6">Cumplimiento SLA</Typography>
                <Chip
                  icon={sla.slaComplianceRate >= 90 ? <CheckCircleIcon /> : <WarningIcon />}
                  label={`${sla.slaComplianceRate || 0}%`}
                  color={sla.slaComplianceRate >= 90 ? 'success' : 'warning'}
                />
              </Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Tickets que exceden 24h: <strong>{sla.ticketsExceedingSLA || 0}</strong>
              </Typography>
              <Box mt={2}>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={sla.avgTimeByStatus || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="avgHours" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h6">Tendencia de Tickets</Typography>
                <Chip
                  icon={<TrendIcon />}
                  label={trend.description || 'Estable'}
                  color={trendColor}
                />
              </Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Proyección próximos 7 días: <strong>{projection.projectedTotalNext7Days || 0} tickets</strong>
              </Typography>
              <Box mt={2}>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={combinedTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#8884d8"
                      strokeWidth={2}
                      name="Tickets"
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Gráficos Descriptivos */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Tickets por Estado
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dashboardStats?.ticketsByStatus || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {(dashboardStats?.ticketsByStatus || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Tickets por Canal
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboardStats?.ticketsByChannel || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Tickets por Categoría
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboardStats?.ticketsByCategory || []} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="value" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Tendencias de Tickets (Últimos 30 días + Proyección)
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={combinedTrendData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#8884d8"
                  fillOpacity={1}
                  fill="url(#colorCount)"
                  name="Tickets"
                />
              </AreaChart>
            </ResponsiveContainer>
            <Box mt={1}>
              <Chip
                size="small"
                label={`Promedio diario: ${projection.avgDailyTickets || 0} tickets`}
                sx={{ mr: 1 }}
              />
              <Chip
                size="small"
                label={`Proyección 7 días: ${projection.projectedTotalNext7Days || 0} tickets`}
                color="primary"
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Indicadores Predictivos */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Proyección de Carga
              </Typography>
              <Box mt={2}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Eventos (próximos 7 días)
                </Typography>
                <Typography variant="h5" color="primary">
                  {predictiveStats?.workload?.projectedEventosNext7Days || 0}
                </Typography>
              </Box>
              <Box mt={2}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Servicios de Enfermería
                </Typography>
                <Typography variant="h5" color="secondary">
                  {predictiveStats?.workload?.projectedServiciosNext7Days || 0}
                </Typography>
              </Box>
              <Box mt={2}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Solicitudes de Transporte
                </Typography>
                <Typography variant="h5" color="info.main">
                  {predictiveStats?.workload?.projectedTransporteNext7Days || 0}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Eventos por Estado
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={dashboardStats?.eventosByStatus || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {(dashboardStats?.eventosByStatus || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Encuentros por Tipo
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dashboardStats?.encuentrosByType || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Gráficos de Diagnósticos */}
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom sx={{ mt: 3, mb: 2 }}>
            Análisis de Diagnósticos ICD-10
          </Typography>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Top 10 Diagnósticos Más Frecuentes
            </Typography>
            <Box mb={1}>
              <Chip
                size="small"
                label={`Cobertura: ${diagnosticStats?.summary?.diagnosticCoverage || 0}%`}
                color="primary"
                sx={{ mr: 1 }}
              />
              <Chip
                size="small"
                label={`Total con diagnóstico: ${diagnosticStats?.summary?.totalWithDiagnostic || 0}`}
              />
            </Box>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={diagnosticStats?.topDiagnostics || []}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis
                  dataKey="codigo"
                  type="category"
                  width={140}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value: any) => [value, 'Eventos']}
                  labelFormatter={(label: any, payload: any) => {
                    if (payload && payload[0]) {
                      return `${payload[0].payload.codigo} - ${payload[0].payload.descripcion}`;
                    }
                    return label;
                  }}
                />
                <Bar dataKey="count" fill="#8884d8" radius={[0, 4, 4, 0]}>
                  {(diagnosticStats?.topDiagnostics || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Diagnósticos por Categoría
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={diagnosticStats?.diagnosticsByCategory || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name.substring(0, 20)}${name.length > 20 ? '...' : ''}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {(diagnosticStats?.diagnosticsByCategory || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  wrapperStyle={{ fontSize: '12px' }}
                  formatter={(value: string) => value.length > 25 ? `${value.substring(0, 25)}...` : value}
                />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Diagnósticos por Severidad
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={diagnosticStats?.diagnosticsBySeverity || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#82ca9d" radius={[4, 4, 0, 0]}>
                  {(diagnosticStats?.diagnosticsBySeverity || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Resumen de Diagnósticos
              </Typography>
              <Box mt={2}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Eventos con diagnóstico
                </Typography>
                <Typography variant="h4" color="primary">
                  {diagnosticStats?.summary?.totalWithDiagnostic || 0}
                </Typography>
              </Box>
              <Box mt={2}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Eventos sin diagnóstico
                </Typography>
                <Typography variant="h4" color="warning.main">
                  {diagnosticStats?.summary?.totalWithoutDiagnostic || 0}
                </Typography>
              </Box>
              <Box mt={2}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Cobertura de diagnósticos
                </Typography>
                <Typography variant="h4" color="success.main">
                  {diagnosticStats?.summary?.diagnosticCoverage || 0}%
                </Typography>
              </Box>
              <Box mt={2}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Total de eventos
                </Typography>
                <Typography variant="h4">
                  {diagnosticStats?.summary?.totalEventos || 0}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
