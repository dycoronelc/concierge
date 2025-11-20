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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { estudiosApi, patientsApi, eventosApi } from '@/services/api';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'react-toastify';

const TIPOS_ESTUDIO = ['Sangre', 'Orina', 'Heces', 'Imagen', 'Genético', 'Genómico', 'Otro'];

export default function EstudiosPage() {
  const queryClient = useQueryClient();
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    patient_id: '',
    evento_id: '',
    tipo_estudio: 'Sangre',
    nombre_estudio: '',
    descripcion: '',
    toma_domicilio: false,
    fecha_programada: '',
    requiere_consentimiento: false,
  });

  const { data: solicitudes, isLoading } = useQuery({
    queryKey: ['estudios-solicitudes'],
    queryFn: async () => {
      const response = await estudiosApi.getAllSolicitudes();
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

  const { data: eventos } = useQuery({
    queryKey: ['eventos'],
    queryFn: async () => {
      const response = await eventosApi.getAll();
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: estudiosApi.createSolicitud,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['estudios-solicitudes'] });
      toast.success('Solicitud de estudio creada exitosamente');
      handleCloseDialog();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al crear solicitud');
    },
  });

  const tomarMuestraMutation = useMutation({
    mutationFn: ({ id, cadena_custodia }: { id: string; cadena_custodia: string }) =>
      estudiosApi.registrarTomaMuestra(id, { cadena_custodia }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['estudios-solicitudes'] });
      toast.success('Toma de muestra registrada');
    },
  });

  const handleOpenDialog = () => {
    setFormData({
      patient_id: '',
      evento_id: '',
      tipo_estudio: 'Sangre',
      nombre_estudio: '',
      descripcion: '',
      toma_domicilio: false,
      fecha_programada: '',
      requiere_consentimiento: false,
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
      Autorizado: 'primary',
      Programado: 'primary',
      En_Proceso: 'warning',
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
          Estudios Clínicos
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenDialog}>
          Nueva Solicitud
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Paciente</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Nombre del Estudio</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Fecha Programada</TableCell>
              <TableCell>Toma Domicilio</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {solicitudes?.map((solicitud: any) => (
              <TableRow key={solicitud.solicitud_id}>
                <TableCell>
                  {solicitud.patient?.nombre} {solicitud.patient?.apellido}
                </TableCell>
                <TableCell>{solicitud.tipo_estudio}</TableCell>
                <TableCell>{solicitud.nombre_estudio}</TableCell>
                <TableCell>
                  <Chip
                    label={solicitud.estado}
                    color={getEstadoColor(solicitud.estado)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {solicitud.fecha_programada
                    ? format(new Date(solicitud.fecha_programada), 'dd/MM/yyyy', { locale: es })
                    : '-'}
                </TableCell>
                <TableCell>
                  <Chip
                    label={solicitud.toma_domicilio ? 'Sí' : 'No'}
                    color={solicitud.toma_domicilio ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {solicitud.estado === 'Programado' && (
                    <Button
                      size="small"
                      onClick={() => {
                        const cadena = prompt('Cadena de custodia:');
                        if (cadena) {
                          tomarMuestraMutation.mutate({
                            id: solicitud.solicitud_id,
                            cadena_custodia: cadena,
                          });
                        }
                      }}
                    >
                      Registrar Muestra
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog para crear solicitud */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Nueva Solicitud de Estudio</DialogTitle>
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
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Evento (Opcional)</InputLabel>
                <Select
                  value={formData.evento_id}
                  onChange={(e) => setFormData({ ...formData, evento_id: e.target.value })}
                  label="Evento (Opcional)"
                >
                  <MenuItem value="">Ninguno</MenuItem>
                  {eventos?.map((evento: any) => (
                    <MenuItem key={evento.evento_id} value={evento.evento_id}>
                      Evento #{evento.evento_id.substring(0, 8)} - {evento.patient?.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Tipo de Estudio</InputLabel>
                <Select
                  value={formData.tipo_estudio}
                  onChange={(e) => setFormData({ ...formData, tipo_estudio: e.target.value })}
                  label="Tipo de Estudio"
                >
                  {TIPOS_ESTUDIO.map((tipo) => (
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
                label="Nombre del Estudio"
                value={formData.nombre_estudio}
                onChange={(e) => setFormData({ ...formData, nombre_estudio: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Descripción"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
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

