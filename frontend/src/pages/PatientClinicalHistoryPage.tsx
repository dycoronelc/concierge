import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Card,
  CardContent,
  Grid,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { eventosApi, patientsApi } from '@/services/api';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function PatientClinicalHistoryPage() {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();

  const { data: patient, isLoading: patientLoading } = useQuery({
    queryKey: ['patient', patientId],
    queryFn: () => patientsApi.getOne(patientId!).then((res) => res.data),
    enabled: !!patientId,
  });

  const { data: eventos, isLoading: eventosLoading } = useQuery({
    queryKey: ['eventos-historial', patientId],
    queryFn: () => eventosApi.getHistorialClinico(patientId!).then((res) => res.data),
    enabled: !!patientId,
  });

  if (patientLoading || eventosLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!patient) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">Paciente no encontrado</Typography>
      </Box>
    );
  }

  const getEstadoColor = (estado: string) => {
    const colors: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
      Activo: 'success',
      Seguimiento: 'warning',
      Cerrado: 'default',
    };
    return colors[estado] || 'default';
  };

  const getSeveridadColor = (severidad: string) => {
    const colors: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
      Leve: 'success',
      Moderada: 'warning',
      Grave: 'error',
      Critica: 'error',
    };
    return colors[severidad] || 'default';
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '100%', p: { xs: 2, sm: 3, md: 4 } }}>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/patients')}
          variant="outlined"
        >
          Volver
        </Button>
        <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
          Historial Clínico
        </Typography>
      </Box>

      {/* Información del Paciente */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Información del Paciente
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Nombre Completo
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {patient.nombre} {patient.apellido}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Cédula
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {patient.cedula}
              </Typography>
            </Grid>
            {patient.numero_poliza && (
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Número de Póliza
                </Typography>
                <Typography variant="body1">{patient.numero_poliza}</Typography>
              </Grid>
            )}
            {patient.telefono_1 && (
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Teléfono
                </Typography>
                <Typography variant="body1">{patient.telefono_1}</Typography>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>

      {/* Eventos Clínicos */}
      <Typography variant="h5" sx={{ mb: 2 }}>
        Eventos Clínicos ({eventos?.length || 0})
      </Typography>

      {!eventos || eventos.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="text.secondary">
            No hay eventos clínicos registrados para este paciente
          </Typography>
        </Paper>
      ) : (
        eventos.map((evento: any) => (
          <Accordion key={evento.evento_id} sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="h6" sx={{ flex: 1 }}>
                  {evento.diagnostico_icd?.codigo || 'Sin diagnóstico'} -{' '}
                  {evento.diagnostico_icd?.descripcion || 'N/A'}
                </Typography>
                <Chip
                  label={evento.estado_evento}
                  color={getEstadoColor(evento.estado_evento)}
                  size="small"
                />
                {evento.severidad && (
                  <Chip
                    label={evento.severidad}
                    color={getSeveridadColor(evento.severidad)}
                    size="small"
                  />
                )}
                {evento.diagnostico_preliminar && (
                  <Chip label="Preliminar" color="warning" size="small" />
                )}
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Fecha de Inicio
                  </Typography>
                  <Typography variant="body2">
                    {format(new Date(evento.fecha_inicio), 'dd/MM/yyyy HH:mm', { locale: es })}
                  </Typography>
                </Grid>
                {evento.fecha_cierre && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Fecha de Cierre
                    </Typography>
                    <Typography variant="body2">
                      {format(new Date(evento.fecha_cierre), 'dd/MM/yyyy HH:mm', { locale: es })}
                    </Typography>
                  </Grid>
                )}
                {evento.categoria && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Categoría
                    </Typography>
                    <Typography variant="body2">{evento.categoria}</Typography>
                  </Grid>
                )}
                {evento.creado_por && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Creado por
                    </Typography>
                    <Typography variant="body2">{evento.creado_por}</Typography>
                  </Grid>
                )}
                {evento.validado_por && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Validado por
                    </Typography>
                    <Typography variant="body2">{evento.validado_por}</Typography>
                  </Grid>
                )}
                {evento.notas_clinicas && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Notas Clínicas
                    </Typography>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      {evento.notas_clinicas}
                    </Typography>
                  </Grid>
                )}

                {/* Encuentros del Evento */}
                {evento.encuentros && evento.encuentros.length > 0 && (
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle1" gutterBottom>
                      Encuentros ({evento.encuentros.length})
                    </Typography>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Tipo</TableCell>
                            <TableCell>Prestador</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell>Fecha Programada</TableCell>
                            <TableCell>Fecha Real</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {evento.encuentros.map((encuentro: any) => (
                            <TableRow key={encuentro.encuentro_id}>
                              <TableCell>{encuentro.tipo_encuentro}</TableCell>
                              <TableCell>{encuentro.prestador?.nombre || 'N/A'}</TableCell>
                              <TableCell>
                                <Chip
                                  label={encuentro.estado}
                                  size="small"
                                  color={
                                    encuentro.estado === 'Completado'
                                      ? 'success'
                                      : encuentro.estado === 'En_curso'
                                      ? 'warning'
                                      : 'default'
                                  }
                                />
                              </TableCell>
                              <TableCell>
                                {encuentro.fecha_programada
                                  ? format(new Date(encuentro.fecha_programada), 'dd/MM/yyyy HH:mm', {
                                      locale: es,
                                    })
                                  : 'N/A'}
                              </TableCell>
                              <TableCell>
                                {encuentro.fecha_real
                                  ? format(new Date(encuentro.fecha_real), 'dd/MM/yyyy HH:mm', {
                                      locale: es,
                                    })
                                  : 'N/A'}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                )}
              </Grid>
            </AccordionDetails>
          </Accordion>
        ))
      )}
    </Box>
  );
}

