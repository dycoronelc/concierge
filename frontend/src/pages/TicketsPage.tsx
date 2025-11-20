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
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { ticketsApi, patientsApi } from '@/services/api';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'react-toastify';

export default function TicketsPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    channel: 'WhatsApp',
    description: '',
    patient_id: '',
    observations: '',
  });

  const { data: tickets, isLoading } = useQuery({
    queryKey: ['tickets'],
    queryFn: () => ticketsApi.getAll().then((res) => res.data),
  });

  const { data: patients } = useQuery({
    queryKey: ['patients'],
    queryFn: () => patientsApi.getAll().then((res) => res.data),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => ticketsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      toast.success('Ticket creado exitosamente');
      setOpenDialog(false);
      setFormData({
        channel: 'WhatsApp',
        description: '',
        patient_id: '',
        observations: '',
      });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al crear ticket');
    },
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
      Creado: 'info',
      En_gestion: 'warning',
      Asignado_a_prestador: 'primary',
      En_atencion: 'secondary',
      Cerrado: 'success',
    };
    return colors[status] || 'default';
  };

  const filteredTickets = tickets?.filter((ticket: any) =>
    ticket.ticket_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description.trim()) {
      toast.error('La descripción es requerida');
      return;
    }
    createMutation.mutate({
      channel: formData.channel,
      description: formData.description,
      patient_id: formData.patient_id || undefined,
      observations: formData.observations || undefined,
    });
  };

  if (isLoading) {
    return (
      <Box sx={{ width: '100%', p: 2 }}>
        <Typography>Cargando tickets...</Typography>
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
          Tickets
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, width: { xs: '100%', sm: 'auto' } }}>
          <TextField
            placeholder="Buscar tickets..."
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
            onClick={() => setOpenDialog(true)}
            sx={{ whiteSpace: 'nowrap' }}
          >
            Nuevo Ticket
          </Button>
        </Box>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          width: '100%',
          overflowX: 'auto',
        }}
      >
        <Table sx={{ minWidth: 650 }} size={isMobile ? 'small' : 'medium'}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                Número
              </TableCell>
              <TableCell>Canal</TableCell>
              <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>
                Descripción
              </TableCell>
              <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                Categoría
              </TableCell>
              <TableCell>Estado</TableCell>
              <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                Fecha
              </TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTickets?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography color="text.secondary" sx={{ py: 3 }}>
                    No hay tickets disponibles
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredTickets?.map((ticket: any) => (
                <TableRow key={ticket.ticket_id} hover>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                    {ticket.ticket_number}
                  </TableCell>
                  <TableCell>{ticket.channel}</TableCell>
                  <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' }, maxWidth: 300 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {ticket.description || 'Sin descripción'}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                    {ticket.categoria_solicitud || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={ticket.status}
                      color={getStatusColor(ticket.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                    {format(
                      new Date(ticket.fecha_hora_creacion_ticket),
                      isMobile ? 'dd/MM' : 'dd/MM/yyyy HH:mm',
                      { locale: es }
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => navigate(`/tickets/${ticket.ticket_id}`)}
                    >
                      Ver
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog para crear nuevo ticket */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle>Crear Nuevo Ticket</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Canal"
                  value={formData.channel}
                  onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
                  required
                  SelectProps={{
                    native: false,
                  }}
                >
                  <MenuItem value="WhatsApp">WhatsApp</MenuItem>
                  <MenuItem value="Telefonico">Telefónico</MenuItem>
                  <MenuItem value="Web">Web</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Paciente (Opcional)"
                  value={formData.patient_id}
                  onChange={(e) => setFormData({ ...formData, patient_id: e.target.value })}
                  SelectProps={{
                    native: false,
                  }}
                >
                  <MenuItem value="">Sin paciente</MenuItem>
                  {patients?.map((patient: any) => (
                    <MenuItem key={patient.patient_id} value={patient.patient_id}>
                      {patient.nombre} {patient.apellido} - {patient.cedula}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Descripción *"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Observaciones (Opcional)"
                  value={formData.observations}
                  onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? 'Creando...' : 'Crear Ticket'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
