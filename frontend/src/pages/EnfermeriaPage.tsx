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
  IconButton,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { enfermeriaApi, patientsApi } from '@/services/api';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'react-toastify';

const TIPOS_CUIDADO = ['Heridas', 'Inyecciones', 'Educación', 'Monitoreo', 'Otro'];
const ESTADOS = ['Solicitado', 'Asignado', 'En_Camino', 'En_Proceso', 'Completado', 'Cancelado'];

export default function EnfermeriaPage() {
  const queryClient = useQueryClient();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingServicio, setEditingServicio] = useState<any>(null);
  const [formData, setFormData] = useState({
    patient_id: '',
    ticket_id: '',
    tipo_cuidado: 'Otro',
    descripcion: '',
    fecha_programada: '',
  });

  const { data: servicios, isLoading } = useQuery({
    queryKey: ['enfermeria-servicios'],
    queryFn: async () => {
      const response = await enfermeriaApi.getAllServicios();
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
    mutationFn: enfermeriaApi.createServicio,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enfermeria-servicios'] });
      toast.success('Servicio de enfermería creado exitosamente');
      handleCloseDialog();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al crear servicio');
    },
  });

  const asignarMutation = useMutation({
    mutationFn: ({ id, enfermero_id }: { id: string; enfermero_id: string }) =>
      enfermeriaApi.asignarEnfermero(id, { enfermero_id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enfermeria-servicios'] });
      toast.success('Enfermero asignado exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al asignar enfermero');
    },
  });

  const completarMutation = useMutation({
    mutationFn: ({ id, notas }: { id: string; notas: string }) =>
      enfermeriaApi.completarVisita(id, { notas }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enfermeria-servicios'] });
      toast.success('Visita completada exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al completar visita');
    },
  });

  const handleOpenDialog = () => {
    setEditingServicio(null);
    setFormData({
      patient_id: '',
      ticket_id: '',
      tipo_cuidado: 'Otro',
      descripcion: '',
      fecha_programada: '',
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingServicio(null);
  };

  const handleSubmit = () => {
    createMutation.mutate({
      ...formData,
      fecha_programada: formData.fecha_programada ? new Date(formData.fecha_programada).toISOString() : undefined,
    });
  };

  const getEstadoColor = (estado: string) => {
    const colors: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
      Solicitado: 'info',
      Asignado: 'primary',
      En_Camino: 'warning',
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
          Servicios de Enfermería
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          Nuevo Servicio
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Paciente</TableCell>
              <TableCell>Tipo de Cuidado</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Fecha Programada</TableCell>
              <TableCell>Enfermero</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {servicios?.map((servicio: any) => (
              <TableRow key={servicio.servicio_id}>
                <TableCell>
                  {servicio.patient?.nombre} {servicio.patient?.apellido}
                </TableCell>
                <TableCell>{servicio.tipo_cuidado}</TableCell>
                <TableCell>
                  <Chip
                    label={servicio.estado}
                    color={getEstadoColor(servicio.estado)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {servicio.fecha_programada
                    ? format(new Date(servicio.fecha_programada), 'dd/MM/yyyy HH:mm', { locale: es })
                    : '-'}
                </TableCell>
                <TableCell>
                  {servicio.enfermero_asignado?.nombre || 'Sin asignar'}
                </TableCell>
                <TableCell>
                  {servicio.estado === 'Solicitado' && (
                    <Button
                      size="small"
                      onClick={() => {
                        const enfermeroId = prompt('ID del enfermero:');
                        if (enfermeroId) {
                          asignarMutation.mutate({ id: servicio.servicio_id, enfermero_id: enfermeroId });
                        }
                      }}
                    >
                      Asignar
                    </Button>
                  )}
                  {servicio.estado === 'En_Proceso' && (
                    <Button
                      size="small"
                      onClick={() => {
                        const notas = prompt('Notas de la visita:');
                        if (notas) {
                          completarMutation.mutate({ id: servicio.servicio_id, notas });
                        }
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

      {/* Dialog para crear/editar */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingServicio ? 'Editar Servicio' : 'Nuevo Servicio de Enfermería'}
        </DialogTitle>
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
                <InputLabel>Tipo de Cuidado</InputLabel>
                <Select
                  value={formData.tipo_cuidado}
                  onChange={(e) => setFormData({ ...formData, tipo_cuidado: e.target.value })}
                  label="Tipo de Cuidado"
                >
                  {TIPOS_CUIDADO.map((tipo) => (
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
                multiline
                rows={4}
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

