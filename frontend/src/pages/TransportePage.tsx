import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Grid,
  Select,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { transporteApi, patientsApi } from '@/services/api';
import { toast } from 'react-toastify';

const TIPOS_TRASLADO = ['Ordinario', 'Asistido', 'Urgente', 'Ambulancia'];

export default function TransportePage() {
  const queryClient = useQueryClient();
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    patient_id: '',
    tipo_traslado: 'Ordinario',
    direccion_origen: '',
    direccion_destino: '',
    fecha_programada: '',
    requiere_gps: false,
  });

  const { data: solicitudes, isLoading } = useQuery({
    queryKey: ['transporte-solicitudes'],
    queryFn: async () => {
      const response = await transporteApi.getAllSolicitudes();
      return response.data;
    },
  });

  const { data: vehiculos } = useQuery({
    queryKey: ['transporte-vehiculos'],
    queryFn: async () => {
      const response = await transporteApi.getAllVehiculos();
      return response.data;
    },
  });

  const { data: patients } = useQuery({
    queryKey: ['patients'],
    queryFn: async () => {
      const response = await patientsApi.getAll();
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: transporteApi.createSolicitud,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transporte-solicitudes'] });
      toast.success('Solicitud de transporte creada exitosamente');
      handleCloseDialog();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al crear solicitud');
    },
  });

  const iniciarMutation = useMutation({
    mutationFn: transporteApi.iniciarTraslado,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transporte-solicitudes'] });
      toast.success('Traslado iniciado');
    },
  });

  const completarMutation = useMutation({
    mutationFn: ({ id, observaciones }: { id: string; observaciones?: string }) =>
      transporteApi.completarTraslado(id, { observaciones }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transporte-solicitudes'] });
      toast.success('Traslado completado');
    },
  });

  const handleOpenDialog = () => {
    setFormData({
      patient_id: '',
      tipo_traslado: 'Ordinario',
      direccion_origen: '',
      direccion_destino: '',
      fecha_programada: '',
      requiere_gps: false,
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSubmit = () => {
    createMutation.mutate({
      ...formData,
      fecha_programada: formData.fecha_programada
        ? new Date(formData.fecha_programada).toISOString()
        : undefined,
    });
  };

  const getEstadoColor = (estado: string) => {
    const colors: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
      Solicitado: 'info',
      Asignado: 'primary',
      En_Camino_Origen: 'warning',
      En_Origen: 'warning',
      En_Traslado: 'warning',
      Completado: 'success',
      Cancelado: 'error',
    };
    return colors[estado] || 'default';
  };

  if (isLoading) {
    return <Box p={3}>Cargando...</Box>;
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={600}>
          Transporte y Logística
        </Typography>
        <Box gap={1} display="flex">
          {/* TODO: Implementar diálogo de vehículos */}
          {/* <Button
            variant="outlined"
            startIcon={<DirectionsCarIcon />}
            onClick={() => setOpenVehiculoDialog(true)}
          >
            Vehículos
          </Button> */}
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenDialog}>
            Nueva Solicitud
          </Button>
        </Box>
      </Box>

      <Tabs value={tabValue} onChange={(_e, v) => setTabValue(v)} sx={{ mb: 2 }}>
        <Tab label="Solicitudes" />
        <Tab label="Vehículos" />
      </Tabs>

      {tabValue === 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Paciente</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Origen</TableCell>
                <TableCell>Destino</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Vehículo</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {solicitudes?.map((solicitud: any) => (
                <TableRow key={solicitud.solicitud_id}>
                  <TableCell>
                    {solicitud.patient?.nombre} {solicitud.patient?.apellido}
                  </TableCell>
                  <TableCell>{solicitud.tipo_traslado}</TableCell>
                  <TableCell>{solicitud.direccion_origen}</TableCell>
                  <TableCell>{solicitud.direccion_destino}</TableCell>
                  <TableCell>
                    <Chip
                      label={solicitud.estado}
                      color={getEstadoColor(solicitud.estado)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {solicitud.vehiculo_asignado_id ? 'Asignado' : 'Sin asignar'}
                  </TableCell>
                  <TableCell>
                    {solicitud.estado === 'Asignado' && (
                      <Button
                        size="small"
                        onClick={() => iniciarMutation.mutate(solicitud.solicitud_id)}
                      >
                        Iniciar
                      </Button>
                    )}
                    {solicitud.estado === 'En_Traslado' && (
                      <Button
                        size="small"
                        onClick={() => {
                          const obs = prompt('Observaciones:');
                          completarMutation.mutate({
                            id: solicitud.solicitud_id,
                            observaciones: obs || undefined,
                          });
                        }}
                      >
                        Completar
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {tabValue === 1 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Placa</TableCell>
                <TableCell>Marca/Modelo</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Conductor</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vehiculos?.map((vehiculo: any) => (
                <TableRow key={vehiculo.vehiculo_id}>
                  <TableCell>{vehiculo.placa}</TableCell>
                  <TableCell>
                    {vehiculo.marca} {vehiculo.modelo}
                  </TableCell>
                  <TableCell>{vehiculo.tipo}</TableCell>
                  <TableCell>
                    <Chip
                      label={vehiculo.estado}
                      color={vehiculo.estado === 'Disponible' ? 'success' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{vehiculo.conductor_asignado || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Dialog para crear solicitud */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Nueva Solicitud de Transporte</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Paciente</InputLabel>
                <Select
                  value={formData.patient_id}
                  onChange={(e) => setFormData({ ...formData, patient_id: e.target.value })}
                  label="Paciente"
                >
                  {patients?.map((patient: any) => (
                    <MenuItem key={patient.patient_id} value={patient.patient_id}>
                      {patient.nombre} {patient.apellido} - {patient.cedula}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Tipo de Traslado</InputLabel>
                <Select
                  value={formData.tipo_traslado}
                  onChange={(e) => setFormData({ ...formData, tipo_traslado: e.target.value })}
                  label="Tipo de Traslado"
                >
                  {TIPOS_TRASLADO.map((tipo) => (
                    <MenuItem key={tipo} value={tipo}>
                      {tipo}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="datetime-local"
                label="Fecha Programada"
                value={formData.fecha_programada}
                onChange={(e) => setFormData({ ...formData, fecha_programada: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Dirección Origen"
                value={formData.direccion_origen}
                onChange={(e) => setFormData({ ...formData, direccion_origen: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Dirección Destino"
                value={formData.direccion_destino}
                onChange={(e) => setFormData({ ...formData, direccion_destino: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={createMutation.isPending}>
            {createMutation.isPending ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

