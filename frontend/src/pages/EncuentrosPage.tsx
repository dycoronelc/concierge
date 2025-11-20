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
import DeleteIcon from '@mui/icons-material/Delete';
import { encuentrosApi, eventosApi, ticketsApi, providersApi } from '@/services/api';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'react-toastify';
export default function EncuentrosPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingEncuentro, setEditingEncuentro] = useState<any>(null);
  const [formData, setFormData] = useState({
    evento_id: '',
    ticket_id: '',
    prestador_id: '',
    tipo_encuentro: '',
    estado: 'Programado',
    fecha_programada: '',
    fecha_real: '',
    resultado: '',
    notas: '',
  });

  const { data: encuentros, isLoading } = useQuery({
    queryKey: ['encuentros'],
    queryFn: () => encuentrosApi.getAll().then((res) => res.data),
  });

  const { data: eventos } = useQuery({
    queryKey: ['eventos'],
    queryFn: () => eventosApi.getAll().then((res) => res.data),
  });

  const { data: tickets } = useQuery({
    queryKey: ['tickets'],
    queryFn: () => ticketsApi.getAll().then((res) => res.data),
  });

  const { data: providers } = useQuery({
    queryKey: ['providers'],
    queryFn: () => providersApi.getAll().then((res) => res.data),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => encuentrosApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['encuentros'] });
      toast.success('Encuentro creado exitosamente');
      setOpenDialog(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al crear encuentro');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => encuentrosApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['encuentros'] });
      toast.success('Encuentro actualizado exitosamente');
      setOpenDialog(false);
      setEditingEncuentro(null);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al actualizar encuentro');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => encuentrosApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['encuentros'] });
      toast.success('Encuentro eliminado exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al eliminar encuentro');
    },
  });

  const resetForm = () => {
    setFormData({
      evento_id: '',
      ticket_id: '',
      prestador_id: '',
      tipo_encuentro: '',
      estado: 'Programado',
      fecha_programada: '',
      fecha_real: '',
      resultado: '',
      notas: '',
    });
  };

  const handleOpenEdit = (encuentro: any) => {
    setEditingEncuentro(encuentro);
    setFormData({
      evento_id: encuentro.evento_id,
      ticket_id: encuentro.ticket_id || '',
      prestador_id: encuentro.prestador_id || '',
      tipo_encuentro: encuentro.tipo_encuentro,
      estado: encuentro.estado,
      fecha_programada: encuentro.fecha_programada
        ? format(new Date(encuentro.fecha_programada), "yyyy-MM-dd'T'HH:mm")
        : '',
      fecha_real: encuentro.fecha_real
        ? format(new Date(encuentro.fecha_real), "yyyy-MM-dd'T'HH:mm")
        : '',
      resultado: encuentro.resultado || '',
      notas: encuentro.notas || '',
    });
    setOpenDialog(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.evento_id || !formData.tipo_encuentro) {
      toast.error('El evento y tipo de encuentro son requeridos');
      return;
    }

    const data = {
      evento_id: formData.evento_id,
      ticket_id: formData.ticket_id || undefined,
      prestador_id: formData.prestador_id || undefined,
      tipo_encuentro: formData.tipo_encuentro,
      estado: formData.estado,
      fecha_programada: formData.fecha_programada || undefined,
      fecha_real: formData.fecha_real || undefined,
      resultado: formData.resultado || undefined,
      notas: formData.notas || undefined,
    };

    if (editingEncuentro) {
      updateMutation.mutate({ id: editingEncuentro.encuentro_id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const getEstadoColor = (estado: string) => {
    const colors: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
      Programado: 'info',
      En_curso: 'warning',
      Completado: 'success',
      Cancelado: 'error',
    };
    return colors[estado] || 'default';
  };

  const filteredEncuentros = encuentros?.filter((encuentro: any) => {
    const search = searchTerm.toLowerCase();
    return (
      encuentro.evento?.patient?.nombre?.toLowerCase().includes(search) ||
      encuentro.evento?.patient?.cedula?.includes(search) ||
      encuentro.tipo_encuentro?.toLowerCase().includes(search) ||
      encuentro.prestador?.nombre?.toLowerCase().includes(search)
    );
  });

  if (isLoading) {
    return (
      <Box sx={{ width: '100%', p: 2 }}>
        <Typography>Cargando encuentros...</Typography>
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
          Encuentros Clínicos
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, width: { xs: '100%', sm: 'auto' } }}>
          <TextField
            placeholder="Buscar encuentros..."
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
              setEditingEncuentro(null);
              resetForm();
              setOpenDialog(true);
            }}
            sx={{ whiteSpace: 'nowrap' }}
          >
            Nuevo Encuentro
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ width: '100%', overflowX: 'auto' }}>
        <Table sx={{ minWidth: 650 }} size={isMobile ? 'small' : 'medium'}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Paciente</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Prestador</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>Fecha Programada</TableCell>
              <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>Fecha Real</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEncuentros?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography color="text.secondary" sx={{ py: 3 }}>
                    No hay encuentros disponibles
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredEncuentros?.map((encuentro: any) => (
                <TableRow key={encuentro.encuentro_id} hover>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                    {encuentro.evento?.patient?.nombre} {encuentro.evento?.patient?.apellido}
                    <Typography variant="caption" display="block" color="text.secondary">
                      {encuentro.evento?.patient?.cedula}
                    </Typography>
                  </TableCell>
                  <TableCell>{encuentro.tipo_encuentro}</TableCell>
                  <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                    {encuentro.prestador?.nombre || 'Sin prestador'}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={encuentro.estado}
                      color={getEstadoColor(encuentro.estado)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>
                    {encuentro.fecha_programada
                      ? format(new Date(encuentro.fecha_programada), 'dd/MM/yyyy HH:mm', { locale: es })
                      : 'N/A'}
                  </TableCell>
                  <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>
                    {encuentro.fecha_real
                      ? format(new Date(encuentro.fecha_real), 'dd/MM/yyyy HH:mm', { locale: es })
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Editar">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenEdit(encuentro)}
                          color="primary"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton
                          size="small"
                          onClick={() => {
                            if (window.confirm('¿Está seguro de eliminar este encuentro?')) {
                              deleteMutation.mutate(encuentro.encuentro_id);
                            }
                          }}
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog para crear/editar encuentro */}
      <Dialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setEditingEncuentro(null);
          resetForm();
        }}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingEncuentro ? 'Editar Encuentro' : 'Crear Nuevo Encuentro'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Evento *"
                  value={formData.evento_id}
                  onChange={(e) => setFormData({ ...formData, evento_id: e.target.value })}
                  required
                  SelectProps={{ native: false }}
                >
                  <MenuItem value="">Seleccionar evento</MenuItem>
                  {eventos?.map((evento: any) => (
                    <MenuItem key={evento.evento_id} value={evento.evento_id}>
                      {evento.diagnostico_icd?.codigo || 'N/A'} - {evento.patient?.nombre}{' '}
                      {evento.patient?.apellido}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Ticket (Opcional)"
                  value={formData.ticket_id}
                  onChange={(e) => setFormData({ ...formData, ticket_id: e.target.value })}
                  SelectProps={{ native: false }}
                >
                  <MenuItem value="">Sin ticket</MenuItem>
                  {tickets?.map((ticket: any) => (
                    <MenuItem key={ticket.ticket_id} value={ticket.ticket_id}>
                      {ticket.ticket_number}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Prestador (Opcional)"
                  value={formData.prestador_id}
                  onChange={(e) => setFormData({ ...formData, prestador_id: e.target.value })}
                  SelectProps={{ native: false }}
                >
                  <MenuItem value="">Sin prestador</MenuItem>
                  {providers?.map((provider: any) => (
                    <MenuItem key={provider.provider_id} value={provider.provider_id}>
                      {provider.nombre}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Tipo de Encuentro *"
                  value={formData.tipo_encuentro}
                  onChange={(e) => setFormData({ ...formData, tipo_encuentro: e.target.value })}
                  required
                  SelectProps={{ native: false }}
                >
                  <MenuItem value="">Seleccionar tipo</MenuItem>
                  <MenuItem value="Consulta">Consulta</MenuItem>
                  <MenuItem value="Urgencia">Urgencia</MenuItem>
                  <MenuItem value="Hospitalizacion">Hospitalización</MenuItem>
                  <MenuItem value="Cirugia">Cirugía</MenuItem>
                  <MenuItem value="Examen">Examen</MenuItem>
                  <MenuItem value="Seguimiento">Seguimiento</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Estado"
                  value={formData.estado}
                  onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                  SelectProps={{ native: false }}
                >
                  <MenuItem value="Programado">Programado</MenuItem>
                  <MenuItem value="En_curso">En Curso</MenuItem>
                  <MenuItem value="Completado">Completado</MenuItem>
                  <MenuItem value="Cancelado">Cancelado</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Fecha Programada"
                  type="datetime-local"
                  value={formData.fecha_programada}
                  onChange={(e) => setFormData({ ...formData, fecha_programada: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Fecha Real"
                  type="datetime-local"
                  value={formData.fecha_real}
                  onChange={(e) => setFormData({ ...formData, fecha_real: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Resultado"
                  value={formData.resultado}
                  onChange={(e) => setFormData({ ...formData, resultado: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Notas"
                  value={formData.notas}
                  onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button
              onClick={() => {
                setOpenDialog(false);
                setEditingEncuentro(null);
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
                : editingEncuentro
                ? 'Actualizar'
                : 'Crear Encuentro'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

