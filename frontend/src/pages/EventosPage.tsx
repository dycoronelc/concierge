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
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Grid,
  useMediaQuery,
  useTheme,
  IconButton,
  Tooltip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import { eventosApi, patientsApi, icd10Api } from '@/services/api';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ICD10SearchDialog from '@/components/ICD10SearchDialog';

export default function EventosPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openICD10Dialog, setOpenICD10Dialog] = useState(false);
  const [editingEvento, setEditingEvento] = useState<any>(null);
  const [formData, setFormData] = useState({
    patient_id: '',
    diagnostico_icd_id: '',
    diagnostico_codigo: '',
    diagnostico_descripcion: '',
    severidad: '',
    categoria: '',
    diagnostico_preliminar: false,
    notas_clinicas: '',
  });

  const { data: eventos, isLoading } = useQuery({
    queryKey: ['eventos'],
    queryFn: () => eventosApi.getAll().then((res) => res.data),
  });

  const { data: patients } = useQuery({
    queryKey: ['patients'],
    queryFn: () => patientsApi.getAll().then((res) => res.data),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => eventosApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventos'] });
      toast.success('Evento creado exitosamente');
      setOpenDialog(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al crear evento');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => eventosApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventos'] });
      toast.success('Evento actualizado exitosamente');
      setOpenDialog(false);
      setEditingEvento(null);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al actualizar evento');
    },
  });

  const closeMutation = useMutation({
    mutationFn: ({ id, motivo }: { id: string; motivo?: string }) =>
      eventosApi.close(id, { motivo }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventos'] });
      toast.success('Evento cerrado exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al cerrar evento');
    },
  });

  const resetForm = () => {
    setFormData({
      patient_id: '',
      diagnostico_icd_id: '',
      diagnostico_codigo: '',
      diagnostico_descripcion: '',
      severidad: '',
      categoria: '',
      diagnostico_preliminar: false,
      notas_clinicas: '',
    });
  };

  const handleOpenEdit = (evento: any) => {
    setEditingEvento(evento);
    setFormData({
      patient_id: evento.patient_id,
      diagnostico_icd_id: evento.diagnostico_icd_id || '',
      diagnostico_codigo: evento.diagnostico_icd?.codigo || '',
      diagnostico_descripcion: evento.diagnostico_icd?.descripcion || '',
      severidad: evento.severidad || '',
      categoria: evento.categoria || '',
      diagnostico_preliminar: evento.diagnostico_preliminar || false,
      notas_clinicas: evento.notas_clinicas || '',
    });
    setOpenDialog(true);
  };

  const handleICD10Select = (icd10: any) => {
    setFormData({
      ...formData,
      diagnostico_icd_id: icd10.icd10_id,
      diagnostico_codigo: icd10.codigo,
      diagnostico_descripcion: icd10.descripcion,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patient_id) {
      toast.error('El paciente es requerido');
      return;
    }

    const data = {
      patient_id: formData.patient_id,
      diagnostico_icd_id: formData.diagnostico_icd_id || undefined,
      severidad: formData.severidad || undefined,
      categoria: formData.categoria || undefined,
      diagnostico_preliminar: formData.diagnostico_preliminar,
      notas_clinicas: formData.notas_clinicas || undefined,
    };

    if (editingEvento) {
      updateMutation.mutate({ id: editingEvento.evento_id, data });
    } else {
      createMutation.mutate(data);
    }
  };

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

  const filteredEventos = eventos?.filter((evento: any) => {
    const search = searchTerm.toLowerCase();
    return (
      evento.diagnostico_icd?.codigo?.toLowerCase().includes(search) ||
      evento.diagnostico_icd?.descripcion?.toLowerCase().includes(search) ||
      evento.patient?.nombre?.toLowerCase().includes(search) ||
      evento.patient?.cedula?.includes(search)
    );
  });

  if (isLoading) {
    return (
      <Box sx={{ width: '100%', p: 2 }}>
        <Typography>Cargando eventos...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', maxWidth: '100%', p: { xs: 2, sm: 3, md: 4 } }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          mb: 3,
          gap: 2,
        }}
      >
        <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
          Eventos Clínicos
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, width: { xs: '100%', sm: 'auto' } }}>
          <TextField
            placeholder="Buscar eventos..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flex: { xs: 1, sm: 'none' }, minWidth: { xs: 'auto', sm: 250 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setEditingEvento(null);
              resetForm();
              setOpenDialog(true);
            }}
            sx={{ whiteSpace: 'nowrap' }}
          >
            Nuevo Evento
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ width: '100%', overflowX: 'auto' }}>
        <Table sx={{ minWidth: 650 }} size={isMobile ? 'small' : 'medium'}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Paciente</TableCell>
              <TableCell>Diagnóstico</TableCell>
              <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Severidad</TableCell>
              <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>Categoría</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Fecha Inicio</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEventos?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography color="text.secondary" sx={{ py: 3 }}>
                    No hay eventos disponibles
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredEventos?.map((evento: any) => (
                <TableRow key={evento.evento_id} hover>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                    {evento.patient?.nombre} {evento.patient?.apellido}
                    <Typography variant="caption" display="block" color="text.secondary">
                      {evento.patient?.cedula}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {evento.diagnostico_icd?.codigo || 'N/A'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {evento.diagnostico_icd?.descripcion || 'Sin diagnóstico'}
                    </Typography>
                    {evento.diagnostico_preliminar && (
                      <Chip label="Preliminar" size="small" color="warning" sx={{ mt: 0.5 }} />
                    )}
                  </TableCell>
                  <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                    {evento.severidad && (
                      <Chip
                        label={evento.severidad}
                        color={getSeveridadColor(evento.severidad)}
                        size="small"
                      />
                    )}
                  </TableCell>
                  <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>
                    {evento.categoria || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={evento.estado_evento}
                      color={getEstadoColor(evento.estado_evento)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                    {format(new Date(evento.fecha_inicio), 'dd/MM/yyyy', { locale: es })}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Editar">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenEdit(evento)}
                          color="primary"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {evento.estado_evento !== 'Cerrado' && (
                        <Tooltip title="Cerrar evento">
                          <IconButton
                            size="small"
                            onClick={() => {
                              if (window.confirm('¿Está seguro de cerrar este evento?')) {
                                closeMutation.mutate({ id: evento.evento_id });
                              }
                            }}
                            color="error"
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => navigate(`/eventos/${evento.evento_id}`)}
                      >
                        Ver
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog para crear/editar evento */}
      <Dialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setEditingEvento(null);
          resetForm();
        }}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingEvento ? 'Editar Evento' : 'Crear Nuevo Evento'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Paciente *"
                  value={formData.patient_id}
                  onChange={(e) => setFormData({ ...formData, patient_id: e.target.value })}
                  required
                  SelectProps={{ native: false }}
                >
                  <MenuItem value="">Seleccionar paciente</MenuItem>
                  {patients?.map((patient: any) => (
                    <MenuItem key={patient.patient_id} value={patient.patient_id}>
                      {patient.nombre} {patient.apellido} - {patient.cedula}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
                  <TextField
                    fullWidth
                    label="Diagnóstico ICD-10"
                    value={formData.diagnostico_codigo}
                    InputProps={{ readOnly: true }}
                    helperText={formData.diagnostico_descripcion || 'Buscar diagnóstico'}
                  />
                  <Button
                    variant="outlined"
                    onClick={() => setOpenICD10Dialog(true)}
                    sx={{ minWidth: 120 }}
                  >
                    Buscar ICD-10
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Severidad"
                  value={formData.severidad}
                  onChange={(e) => setFormData({ ...formData, severidad: e.target.value })}
                  SelectProps={{ native: false }}
                >
                  <MenuItem value="">Sin severidad</MenuItem>
                  <MenuItem value="Leve">Leve</MenuItem>
                  <MenuItem value="Moderada">Moderada</MenuItem>
                  <MenuItem value="Grave">Grave</MenuItem>
                  <MenuItem value="Critica">Crítica</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Categoría"
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  SelectProps={{ native: false }}
                >
                  <MenuItem value="">Sin categoría</MenuItem>
                  <MenuItem value="Ambulatoria">Ambulatoria</MenuItem>
                  <MenuItem value="Urgencia">Urgencia</MenuItem>
                  <MenuItem value="Hospitalaria">Hospitalaria</MenuItem>
                  <MenuItem value="Quirurgica">Quirúrgica</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Notas Clínicas"
                  value={formData.notas_clinicas}
                  onChange={(e) => setFormData({ ...formData, notas_clinicas: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button
              onClick={() => {
                setOpenDialog(false);
                setEditingEvento(null);
                resetForm();
              }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending
                ? 'Guardando...'
                : editingEvento
                ? 'Actualizar'
                : 'Crear Evento'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <ICD10SearchDialog
        open={openICD10Dialog}
        onClose={() => setOpenICD10Dialog(false)}
        onSelect={handleICD10Select}
      />
    </Box>
  );
}

