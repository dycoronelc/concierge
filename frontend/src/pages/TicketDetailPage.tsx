import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { ticketsApi, providersApi } from '@/services/api';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'react-toastify';

export default function TicketDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [justificacion, setJustificacion] = useState('');

  const { data: ticket, isLoading } = useQuery({
    queryKey: ['ticket', id],
    queryFn: () => ticketsApi.getOne(id!).then((res) => res.data),
    enabled: !!id,
  });

  // Obtener prestadores disponibles
  const { data: availableProviders } = useQuery({
    queryKey: ['providers', 'available', ticket?.categoria_solicitud, ticket?.patient],
    queryFn: () => {
      if (!ticket?.categoria_solicitud) return Promise.resolve({ aliados: [], red: [] });
      const ubicacion = ticket.patient
        ? {
            ciudad: ticket.patient.ciudad,
            provincia: ticket.patient.provincia,
            latitud: ticket.patient.latitud,
            longitud: ticket.patient.longitud,
          }
        : {};
      return providersApi
        .getAvailable({
          categoria: ticket.categoria_solicitud,
          ...ubicacion,
        })
        .then((res) => res.data);
    },
    enabled: !!ticket?.categoria_solicitud,
  });

  // Mutación para asignar prestador
  const assignProviderMutation = useMutation({
    mutationFn: (data: { provider_id: string; justificacion?: string; es_red?: boolean }) =>
      ticketsApi.assignProvider(id!, {
        ...data,
        usuario: user?.username || 'Usuario',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket', id] });
      toast.success('Prestador asignado correctamente');
      setAssignDialogOpen(false);
      setSelectedProvider(null);
      setJustificacion('');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al asignar prestador');
    },
  });

  const handleAssignProvider = () => {
    if (!selectedProvider) {
      toast.error('Seleccione un prestador');
      return;
    }

    const provider = [
      ...(availableProviders?.aliados || []),
      ...(availableProviders?.red || []),
    ].find((p) => p.provider_id === selectedProvider);

    const es_red = provider?.tipo === 'Red';
    if (es_red && !justificacion.trim()) {
      toast.error('La justificación es obligatoria para prestadores de red');
      return;
    }

    assignProviderMutation.mutate({
      provider_id: selectedProvider,
      justificacion: justificacion.trim() || undefined,
      es_red,
    });
  };

  if (isLoading) {
    return (
      <Box sx={{ width: '100%', p: 2 }}>
        <Typography>Cargando...</Typography>
      </Box>
    );
  }

  if (!ticket) {
    return (
      <Box sx={{ width: '100%', p: 2 }}>
        <Typography>Ticket no encontrado</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', maxWidth: '100%', p: { xs: 2, sm: 3, md: 4 } }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/tickets')}
        sx={{ mb: 2 }}
      >
        Volver
      </Button>

      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}
      >
        Ticket: {ticket.ticket_number}
      </Typography>

      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 2, width: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Información General
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Estado
                </Typography>
                <Chip label={ticket.status} color="primary" sx={{ mt: 0.5 }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Canal
                </Typography>
                <Typography>{ticket.channel}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Categoría
                </Typography>
                <Typography>{ticket.categoria_solicitud || 'No clasificado'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Confianza Clasificación
                </Typography>
                <Typography>
                  {ticket.nivel_confianza_clasificacion
                    ? `${(ticket.nivel_confianza_clasificacion * 100).toFixed(0)}%`
                    : 'N/A'}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          <Paper sx={{ p: { xs: 2, sm: 3 }, width: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Descripción
            </Typography>
            <Typography>{ticket.description || 'Sin descripción'}</Typography>

            {ticket.observations && (
              <>
                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  Observaciones
                </Typography>
                <Typography>{ticket.observations}</Typography>
              </>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 2, width: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Línea de Tiempo
            </Typography>
            <Box sx={{ mt: 2 }}>
              {ticket.status_history?.map((history: any, index: number) => (
                <Box key={index} sx={{ mb: 3, position: 'relative' }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: 'primary.main',
                        mr: 2,
                        fontSize: '0.875rem',
                      }}
                    >
                      {index + 1}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" fontWeight="bold">
                        {history.estado_nuevo}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        {format(new Date(history.fecha_hora), 'PPp', { locale: es })}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Por: {history.usuario}
                      </Typography>
                      {history.motivo && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                          sx={{ mt: 0.5 }}
                        >
                          {history.motivo}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  {index < (ticket.status_history?.length || 0) - 1 && (
                    <Box
                      sx={{
                        position: 'absolute',
                        left: 15,
                        top: 40,
                        bottom: -12,
                        width: 2,
                        bgcolor: 'divider',
                      }}
                    />
                  )}
                </Box>
              ))}
              {(!ticket.status_history || ticket.status_history.length === 0) && (
                <Typography variant="body2" color="text.secondary">
                  No hay historial disponible
                </Typography>
              )}
            </Box>
          </Paper>

          <Paper sx={{ p: { xs: 2, sm: 3 }, width: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Prestador Asignado
            </Typography>
            {ticket.prestador_asignado ? (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1" fontWeight="bold">
                  {ticket.prestador_asignado.nombre}
                </Typography>
                <Chip
                  label={ticket.prestador_asignado.tipo}
                  color={ticket.prestador_asignado.tipo === 'Aliado' ? 'primary' : 'default'}
                  size="small"
                  sx={{ mt: 1 }}
                />
                {ticket.justificacion_asignacion && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Justificación: {ticket.justificacion_asignacion}
                  </Typography>
                )}
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<AssignmentIcon />}
                  onClick={() => setAssignDialogOpen(true)}
                  sx={{ mt: 2 }}
                >
                  Reasignar
                </Button>
              </Box>
            ) : (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  No hay prestador asignado
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AssignmentIcon />}
                  onClick={() => setAssignDialogOpen(true)}
                  disabled={!ticket.categoria_solicitud}
                >
                  Asignar Prestador
                </Button>
                {!ticket.categoria_solicitud && (
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    El ticket debe estar clasificado antes de asignar un prestador
                  </Alert>
                )}
              </Box>
            )}
          </Paper>

          <Paper sx={{ p: { xs: 2, sm: 3 }, width: '100%', mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Timestamps Clave
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Creación
              </Typography>
              <Typography variant="body1">
                {format(new Date(ticket.fecha_hora_creacion_ticket), 'PPp', { locale: es })}
              </Typography>
            </Box>
            {ticket.fecha_hora_asignacion_prestador && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Asignación
                </Typography>
                <Typography variant="body1">
                  {format(
                    new Date(ticket.fecha_hora_asignacion_prestador),
                    'PPp',
                    { locale: es }
                  )}
                </Typography>
              </Box>
            )}
            {ticket.fecha_hora_cierre_ticket && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Cierre
                </Typography>
                <Typography variant="body1">
                  {format(new Date(ticket.fecha_hora_cierre_ticket), 'PPp', { locale: es })}
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Dialog para asignar prestador */}
      <Dialog
        open={assignDialogOpen}
        onClose={() => {
          setAssignDialogOpen(false);
          setSelectedProvider(null);
          setJustificacion('');
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Asignar Prestador</DialogTitle>
        <DialogContent>
          {availableProviders && (
            <>
              {availableProviders.aliados.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Prestadores Aliados (Prioritarios)
                  </Typography>
                  <List>
                    {availableProviders.aliados.map((provider: any) => (
                      <ListItem key={provider.provider_id} disablePadding>
                        <ListItemButton
                          selected={selectedProvider === provider.provider_id}
                          onClick={() => {
                            setSelectedProvider(provider.provider_id);
                            if (provider.tipo !== 'Red') {
                              setJustificacion('');
                            }
                          }}
                        >
                          <ListItemText
                            primary={provider.nombre}
                            secondary={`Categorías: ${provider.categorias?.join(', ') || 'N/A'}`}
                          />
                          <Chip label="Aliado" color="primary" size="small" />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}

              {availableProviders.red.length > 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Prestadores de la Red
                  </Typography>
                  <List>
                    {availableProviders.red.map((provider: any) => (
                      <ListItem key={provider.provider_id} disablePadding>
                        <ListItemButton
                          selected={selectedProvider === provider.provider_id}
                          onClick={() => setSelectedProvider(provider.provider_id)}
                        >
                          <ListItemText
                            primary={provider.nombre}
                            secondary={`Categorías: ${provider.categorias?.join(', ') || 'N/A'}`}
                          />
                          <Chip label="Red" size="small" />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}

              {availableProviders.aliados.length === 0 &&
                availableProviders.red.length === 0 && (
                  <Alert severity="info">
                    No hay prestadores disponibles para esta categoría y ubicación
                  </Alert>
                )}

              {selectedProvider && (
                <Box sx={{ mt: 3 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label={
                      [
                        ...(availableProviders.aliados || []),
                        ...(availableProviders.red || []),
                      ].find((p) => p.provider_id === selectedProvider)?.tipo === 'Red'
                        ? 'Justificación (Obligatoria para prestadores de red)'
                        : 'Justificación (Opcional)'
                    }
                    value={justificacion}
                    onChange={(e) => setJustificacion(e.target.value)}
                    required={
                      [
                        ...(availableProviders.aliados || []),
                        ...(availableProviders.red || []),
                      ].find((p) => p.provider_id === selectedProvider)?.tipo === 'Red'
                    }
                  />
                </Box>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setAssignDialogOpen(false);
              setSelectedProvider(null);
              setJustificacion('');
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleAssignProvider}
            variant="contained"
            disabled={!selectedProvider || assignProviderMutation.isPending}
          >
            {assignProviderMutation.isPending ? 'Asignando...' : 'Asignar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
