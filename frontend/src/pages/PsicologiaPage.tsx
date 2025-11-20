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
  Card,
  CardContent,
  Alert,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { psicologiaApi, patientsApi } from '@/services/api';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'react-toastify';
import { useAuthStore } from '@/store/authStore';

const TIPOS_CONSULTA = ['Psicologica', 'Psiquiatrica'];
const MODALIDADES = ['Presencial', 'Telefonica', 'Videollamada'];
const TIPOS_SESION = ['Individual', 'Grupal', 'Familiar'];
const ESTADOS_ANIMO = ['Muy_Positivo', 'Positivo', 'Neutro', 'Negativo', 'Muy_Negativo', 'Ansioso', 'Deprimido', 'Eufórico'];

function TabPanel({ children, value, index }: { children: React.ReactNode; value: number; index: number }) {
  return <div hidden={value !== index}>{value === index && <Box sx={{ p: 3 }}>{children}</Box>}</div>;
}

export default function PsicologiaPage() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [tabValue, setTabValue] = useState(0);
  const [openConsultaDialog, setOpenConsultaDialog] = useState(false);
  const [openSesionDialog, setOpenSesionDialog] = useState(false);
  const [openSeguimientoDialog, setOpenSeguimientoDialog] = useState(false);
  const [openFamiliarDialog, setOpenFamiliarDialog] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  const [consultaForm, setConsultaForm] = useState({
    patient_id: '',
    evento_id: '',
    ticket_id: '',
    psicologo_id: '',
    tipo_consulta: 'Psicologica',
    modalidad: 'Presencial',
    fecha_programada: '',
    disponibilidad_paciente: '',
    motivo_consulta: '',
    notas_previas: '',
  });

  const [sesionForm, setSesionForm] = useState({
    consulta_id: '',
    patient_id: '',
    psicologo_id: '',
    fecha_sesion: format(new Date(), 'yyyy-MM-dd\'T\'HH:mm'),
    duracion_minutos: '60',
    tipo_sesion: 'Individual',
    participantes: [] as string[],
    resumen_sesion: '',
    observaciones: '',
    plan_tratamiento: '',
    proxima_sesion_programada: '',
  });

  const [seguimientoForm, setSeguimientoForm] = useState({
    patient_id: '',
    sesion_id: '',
    estado_animo: 'Neutro',
    escala_ansiedad: '',
    escala_depresion: '',
    escala_estres: '',
    sintomas: [] as string[],
    factores_estresantes: '',
    apoyo_social: '',
    observaciones: '',
  });

  const [familiarForm, setFamiliarForm] = useState({
    patient_id: '',
    nombre: '',
    apellido: '',
    relacion: '',
    telefono: '',
    email: '',
    direccion: '',
    es_cuidador_principal: false,
    puede_participar_sesiones: true,
    notas: '',
  });

  const { data: consultas, isLoading: loadingConsultas } = useQuery({
    queryKey: ['psicologia-consultas'],
    queryFn: () => psicologiaApi.getAllConsultas().then((res) => res.data),
  });

  const { data: sesiones, isLoading: loadingSesiones } = useQuery({
    queryKey: ['psicologia-sesiones'],
    queryFn: () => psicologiaApi.getAllSesiones().then((res) => res.data),
  });

  const { data: seguimientos, isLoading: loadingSeguimientos } = useQuery({
    queryKey: ['psicologia-seguimientos'],
    queryFn: () => psicologiaApi.getAllSeguimientos().then((res) => res.data),
  });

  const { data: seguimientosAlertas } = useQuery({
    queryKey: ['psicologia-seguimientos-alertas'],
    queryFn: async () => {
      try {
        const response = await psicologiaApi.getSeguimientosConAlertas();
        return response.data;
      } catch (error: any) {
        // Si el endpoint no está disponible o hay error, retornar array vacío silenciosamente
        if (error?.response?.status !== 500) {
          // Solo loguear si no es un error 500 (que ya está siendo manejado)
          console.warn('Error al obtener seguimientos con alertas:', error?.response?.status || error?.message);
        }
        return [];
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  const { data: patients } = useQuery({
    queryKey: ['patients'],
    queryFn: () => patientsApi.getAll().then((res) => res.data),
  });


  const { data: familiares } = useQuery({
    queryKey: ['psicologia-familiares', selectedPatientId],
    queryFn: () => {
      if (!selectedPatientId) return Promise.resolve([]);
      return psicologiaApi.getAllFamiliares(selectedPatientId).then((res) => res.data);
    },
    enabled: !!selectedPatientId,
  });

  const createConsultaMutation = useMutation({
    mutationFn: psicologiaApi.createConsulta,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['psicologia-consultas'] });
      toast.success('Consulta psicológica creada exitosamente');
      handleCloseConsultaDialog();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al crear consulta');
    },
  });

  const createSesionMutation = useMutation({
    mutationFn: psicologiaApi.createSesion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['psicologia-sesiones'] });
      toast.success('Sesión psicológica creada exitosamente');
      handleCloseSesionDialog();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al crear sesión');
    },
  });

  const createSeguimientoMutation = useMutation({
    mutationFn: psicologiaApi.createSeguimiento,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['psicologia-seguimientos'] });
      queryClient.invalidateQueries({ queryKey: ['psicologia-seguimientos-alertas'] });
      toast.success('Seguimiento emocional creado exitosamente');
      handleCloseSeguimientoDialog();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al crear seguimiento');
    },
  });

  const createFamiliarMutation = useMutation({
    mutationFn: psicologiaApi.createFamiliar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['psicologia-familiares'] });
      toast.success('Familiar/cuidador agregado exitosamente');
      handleCloseFamiliarDialog();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al agregar familiar');
    },
  });

  const deleteFamiliarMutation = useMutation({
    mutationFn: psicologiaApi.deleteFamiliar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['psicologia-familiares'] });
      toast.success('Familiar/cuidador eliminado exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al eliminar familiar');
    },
  });

  const handleChangeTab = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOpenConsultaDialog = () => {
    setConsultaForm({
      patient_id: '',
      evento_id: '',
      ticket_id: '',
      psicologo_id: '',
      tipo_consulta: 'Psicologica',
      modalidad: 'Presencial',
      fecha_programada: '',
      disponibilidad_paciente: '',
      motivo_consulta: '',
      notas_previas: '',
    });
    setOpenConsultaDialog(true);
  };

  const handleCloseConsultaDialog = () => {
    setOpenConsultaDialog(false);
  };

  const handleSubmitConsulta = () => {
    createConsultaMutation.mutate({
      ...consultaForm,
      fecha_programada: consultaForm.fecha_programada ? new Date(consultaForm.fecha_programada) : undefined,
      creado_por_id: user?.user_id,
    });
  };

  const handleOpenSesionDialog = (consultaId?: string) => {
    setSesionForm({
      consulta_id: consultaId || '',
      patient_id: '',
      psicologo_id: '',
      fecha_sesion: format(new Date(), 'yyyy-MM-dd\'T\'HH:mm'),
      duracion_minutos: '60',
      tipo_sesion: 'Individual',
      participantes: [],
      resumen_sesion: '',
      observaciones: '',
      plan_tratamiento: '',
      proxima_sesion_programada: '',
    });
    setOpenSesionDialog(true);
  };

  const handleCloseSesionDialog = () => {
    setOpenSesionDialog(false);
  };

  const handleSubmitSesion = () => {
    createSesionMutation.mutate({
      ...sesionForm,
      fecha_sesion: new Date(sesionForm.fecha_sesion),
      duracion_minutos: parseInt(sesionForm.duracion_minutos),
      proxima_sesion_programada: sesionForm.proxima_sesion_programada ? new Date(sesionForm.proxima_sesion_programada) : undefined,
    });
  };

  const handleOpenSeguimientoDialog = (patientId?: string) => {
    setSeguimientoForm({
      patient_id: patientId || '',
      sesion_id: '',
      estado_animo: 'Neutro',
      escala_ansiedad: '',
      escala_depresion: '',
      escala_estres: '',
      sintomas: [],
      factores_estresantes: '',
      apoyo_social: '',
      observaciones: '',
    });
    setOpenSeguimientoDialog(true);
  };

  const handleCloseSeguimientoDialog = () => {
    setOpenSeguimientoDialog(false);
  };

  const handleSubmitSeguimiento = () => {
    createSeguimientoMutation.mutate({
      ...seguimientoForm,
      escala_ansiedad: seguimientoForm.escala_ansiedad ? parseInt(seguimientoForm.escala_ansiedad) : undefined,
      escala_depresion: seguimientoForm.escala_depresion ? parseInt(seguimientoForm.escala_depresion) : undefined,
      escala_estres: seguimientoForm.escala_estres ? parseInt(seguimientoForm.escala_estres) : undefined,
      registrado_por_id: user?.user_id,
    });
  };

  const handleOpenFamiliarDialog = (patientId?: string) => {
    setFamiliarForm({
      patient_id: patientId || '',
      nombre: '',
      apellido: '',
      relacion: '',
      telefono: '',
      email: '',
      direccion: '',
      es_cuidador_principal: false,
      puede_participar_sesiones: true,
      notas: '',
    });
    setOpenFamiliarDialog(true);
  };

  const handleCloseFamiliarDialog = () => {
    setOpenFamiliarDialog(false);
  };

  const handleSubmitFamiliar = () => {
    createFamiliarMutation.mutate(familiarForm);
  };

  const getEstadoColor = (estado: string) => {
    const colors: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
      Solicitada: 'info',
      Confirmada: 'primary',
      En_Proceso: 'warning',
      Completada: 'success',
      Cancelada: 'error',
      Programada: 'info',
      En_Curso: 'warning',
      No_Asistio: 'error',
    };
    return colors[estado] || 'default';
  };

  if (loadingConsultas || loadingSesiones || loadingSeguimientos) {
    return <Box p={3}>Cargando...</Box>;
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={600}>
          Psicología y Apoyo Emocional
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenConsultaDialog}>
          Nueva Consulta
        </Button>
      </Box>

      {seguimientosAlertas && seguimientosAlertas.length > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="subtitle2" fontWeight={600}>
            Alertas Críticas: {seguimientosAlertas.length} seguimiento(s) requieren atención inmediata
          </Typography>
        </Alert>
      )}

      <Tabs value={tabValue} onChange={handleChangeTab} aria-label="psychology tabs" sx={{ mb: 3 }}>
        <Tab label="Consultas" />
        <Tab label="Sesiones" />
        <Tab label="Seguimiento Emocional" />
        <Tab label="Familiares/Cuidadores" />
      </Tabs>

      {/* Tab: Consultas */}
      <TabPanel value={tabValue} index={0}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Paciente</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Modalidad</TableCell>
                <TableCell>Fecha Programada</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {consultas?.map((consulta: any) => (
                <TableRow key={consulta.consulta_id}>
                  <TableCell>
                    {consulta.patient?.nombre} {consulta.patient?.apellido}
                  </TableCell>
                  <TableCell>{consulta.tipo_consulta}</TableCell>
                  <TableCell>{consulta.modalidad}</TableCell>
                  <TableCell>
                    {consulta.fecha_programada
                      ? format(new Date(consulta.fecha_programada), 'dd/MM/yyyy HH:mm', { locale: es })
                      : '-'}
                  </TableCell>
                  <TableCell>
                    <Chip label={consulta.estado} color={getEstadoColor(consulta.estado)} size="small" />
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      onClick={() => handleOpenSesionDialog(consulta.consulta_id)}
                      disabled={!consulta.consulta_id}
                    >
                      Crear Sesión
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Tab: Sesiones */}
      <TabPanel value={tabValue} index={1}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Sesiones Psicológicas</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenSesionDialog()}>
            Nueva Sesión
          </Button>
        </Box>
        <Grid container spacing={2}>
          {sesiones?.map((sesion: any) => (
            <Grid item xs={12} md={6} key={sesion.sesion_id}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                    <Typography variant="h6">
                      {format(new Date(sesion.fecha_sesion), 'dd/MM/yyyy HH:mm', { locale: es })}
                    </Typography>
                    <Chip label={sesion.estado} color={getEstadoColor(sesion.estado)} size="small" />
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Paciente: {sesion.patient?.nombre} {sesion.patient?.apellido}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Tipo: {sesion.tipo_sesion} - Duración: {sesion.duracion_minutos} min
                  </Typography>
                  {sesion.resumen_sesion && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {sesion.resumen_sesion.substring(0, 100)}...
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* Tab: Seguimiento Emocional */}
      <TabPanel value={tabValue} index={2}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Seguimiento Emocional</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenSeguimientoDialog()}>
            Nuevo Seguimiento
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Paciente</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Estado de Ánimo</TableCell>
                <TableCell>Escalas (A/D/E)</TableCell>
                <TableCell>Alerta</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {seguimientos?.map((seguimiento: any) => (
                <TableRow key={seguimiento.seguimiento_id}>
                  <TableCell>
                    {seguimiento.patient?.nombre} {seguimiento.patient?.apellido}
                  </TableCell>
                  <TableCell>
                    {format(new Date(seguimiento.fecha_registro), 'dd/MM/yyyy', { locale: es })}
                  </TableCell>
                  <TableCell>{seguimiento.estado_animo || '-'}</TableCell>
                  <TableCell>
                    {seguimiento.escala_ansiedad !== null && seguimiento.escala_ansiedad !== undefined
                      ? `${seguimiento.escala_ansiedad}`
                      : '-'}
                    {' / '}
                    {seguimiento.escala_depresion !== null && seguimiento.escala_depresion !== undefined
                      ? `${seguimiento.escala_depresion}`
                      : '-'}
                    {' / '}
                    {seguimiento.escala_estres !== null && seguimiento.escala_estres !== undefined
                      ? `${seguimiento.escala_estres}`
                      : '-'}
                  </TableCell>
                  <TableCell>
                    {seguimiento.alerta_critica ? (
                      <Chip label="Crítica" color="error" size="small" />
                    ) : (
                      '-'
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Tab: Familiares/Cuidadores */}
      <TabPanel value={tabValue} index={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Familiares y Cuidadores</Typography>
          <Box>
            <FormControl sx={{ minWidth: 200, mr: 2 }}>
              <InputLabel>Seleccionar Paciente</InputLabel>
              <Select
                value={selectedPatientId || ''}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                label="Seleccionar Paciente"
              >
                {patients?.map((patient: any) => (
                  <MenuItem key={patient.patient_id} value={patient.patient_id}>
                    {patient.nombre} {patient.apellido}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenFamiliarDialog(selectedPatientId || undefined)}
              disabled={!selectedPatientId}
            >
              Agregar Familiar
            </Button>
          </Box>
        </Box>
        {selectedPatientId ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Relación</TableCell>
                  <TableCell>Teléfono</TableCell>
                  <TableCell>Cuidador Principal</TableCell>
                  <TableCell>Puede Participar</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {familiares?.map((familiar: any) => (
                  <TableRow key={familiar.familiar_id}>
                    <TableCell>
                      {familiar.nombre} {familiar.apellido}
                    </TableCell>
                    <TableCell>{familiar.relacion || '-'}</TableCell>
                    <TableCell>{familiar.telefono || '-'}</TableCell>
                    <TableCell>
                      {familiar.es_cuidador_principal ? <Chip label="Sí" color="primary" size="small" /> : 'No'}
                    </TableCell>
                    <TableCell>
                      {familiar.puede_participar_sesiones ? 'Sí' : 'No'}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => deleteFamiliarMutation.mutate(familiar.familiar_id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Alert severity="info">Selecciona un paciente para ver sus familiares y cuidadores</Alert>
        )}
      </TabPanel>

      {/* Dialog: Nueva Consulta */}
      <Dialog open={openConsultaDialog} onClose={handleCloseConsultaDialog} maxWidth="md" fullWidth>
        <DialogTitle>Nueva Consulta Psicológica</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Paciente *</InputLabel>
                <Select
                  value={consultaForm.patient_id}
                  onChange={(e) => setConsultaForm({ ...consultaForm, patient_id: e.target.value })}
                  label="Paciente *"
                >
                  {patients?.map((patient: any) => (
                    <MenuItem key={patient.patient_id} value={patient.patient_id}>
                      {patient.nombre} {patient.apellido} - {patient.cedula}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Tipo de Consulta *</InputLabel>
                <Select
                  value={consultaForm.tipo_consulta}
                  onChange={(e) => setConsultaForm({ ...consultaForm, tipo_consulta: e.target.value })}
                  label="Tipo de Consulta *"
                >
                  {TIPOS_CONSULTA.map((tipo) => (
                    <MenuItem key={tipo} value={tipo}>
                      {tipo}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Modalidad *</InputLabel>
                <Select
                  value={consultaForm.modalidad}
                  onChange={(e) => setConsultaForm({ ...consultaForm, modalidad: e.target.value })}
                  label="Modalidad *"
                >
                  {MODALIDADES.map((modalidad) => (
                    <MenuItem key={modalidad} value={modalidad}>
                      {modalidad}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="datetime-local"
                label="Fecha Programada"
                value={consultaForm.fecha_programada}
                onChange={(e) => setConsultaForm({ ...consultaForm, fecha_programada: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Disponibilidad del Paciente"
                value={consultaForm.disponibilidad_paciente}
                onChange={(e) => setConsultaForm({ ...consultaForm, disponibilidad_paciente: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Motivo de Consulta"
                value={consultaForm.motivo_consulta}
                onChange={(e) => setConsultaForm({ ...consultaForm, motivo_consulta: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConsultaDialog}>Cancelar</Button>
          <Button onClick={handleSubmitConsulta} variant="contained" disabled={createConsultaMutation.isPending}>
            Crear
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog: Nueva Sesión */}
      <Dialog open={openSesionDialog} onClose={handleCloseSesionDialog} maxWidth="md" fullWidth>
        <DialogTitle>Nueva Sesión Psicológica</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Consulta</InputLabel>
                <Select
                  value={sesionForm.consulta_id}
                  onChange={(e) => setSesionForm({ ...sesionForm, consulta_id: e.target.value })}
                  label="Consulta"
                >
                  <MenuItem value="">Ninguna</MenuItem>
                  {consultas?.map((consulta: any) => (
                    <MenuItem key={consulta.consulta_id} value={consulta.consulta_id}>
                      {consulta.patient?.nombre} - {consulta.tipo_consulta}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Paciente *</InputLabel>
                <Select
                  value={sesionForm.patient_id}
                  onChange={(e) => setSesionForm({ ...sesionForm, patient_id: e.target.value })}
                  label="Paciente *"
                >
                  {patients?.map((patient: any) => (
                    <MenuItem key={patient.patient_id} value={patient.patient_id}>
                      {patient.nombre} {patient.apellido}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="datetime-local"
                label="Fecha y Hora de Sesión *"
                value={sesionForm.fecha_sesion}
                onChange={(e) => setSesionForm({ ...sesionForm, fecha_sesion: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Tipo de Sesión</InputLabel>
                <Select
                  value={sesionForm.tipo_sesion}
                  onChange={(e) => setSesionForm({ ...sesionForm, tipo_sesion: e.target.value })}
                  label="Tipo de Sesión"
                >
                  {TIPOS_SESION.map((tipo) => (
                    <MenuItem key={tipo} value={tipo}>
                      {tipo}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Duración (minutos)"
                value={sesionForm.duracion_minutos}
                onChange={(e) => setSesionForm({ ...sesionForm, duracion_minutos: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Resumen de Sesión"
                value={sesionForm.resumen_sesion}
                onChange={(e) => setSesionForm({ ...sesionForm, resumen_sesion: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSesionDialog}>Cancelar</Button>
          <Button onClick={handleSubmitSesion} variant="contained" disabled={createSesionMutation.isPending}>
            Crear
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog: Nuevo Seguimiento */}
      <Dialog open={openSeguimientoDialog} onClose={handleCloseSeguimientoDialog} maxWidth="md" fullWidth>
        <DialogTitle>Nuevo Seguimiento Emocional</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Paciente *</InputLabel>
                <Select
                  value={seguimientoForm.patient_id}
                  onChange={(e) => setSeguimientoForm({ ...seguimientoForm, patient_id: e.target.value })}
                  label="Paciente *"
                >
                  {patients?.map((patient: any) => (
                    <MenuItem key={patient.patient_id} value={patient.patient_id}>
                      {patient.nombre} {patient.apellido}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Estado de Ánimo</InputLabel>
                <Select
                  value={seguimientoForm.estado_animo}
                  onChange={(e) => setSeguimientoForm({ ...seguimientoForm, estado_animo: e.target.value })}
                  label="Estado de Ánimo"
                >
                  {ESTADOS_ANIMO.map((estado) => (
                    <MenuItem key={estado} value={estado}>
                      {estado.replace('_', ' ')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Escala Ansiedad (0-10)"
                value={seguimientoForm.escala_ansiedad}
                onChange={(e) => setSeguimientoForm({ ...seguimientoForm, escala_ansiedad: e.target.value })}
                inputProps={{ min: 0, max: 10 }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Escala Depresión (0-10)"
                value={seguimientoForm.escala_depresion}
                onChange={(e) => setSeguimientoForm({ ...seguimientoForm, escala_depresion: e.target.value })}
                inputProps={{ min: 0, max: 10 }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Escala Estrés (0-10)"
                value={seguimientoForm.escala_estres}
                onChange={(e) => setSeguimientoForm({ ...seguimientoForm, escala_estres: e.target.value })}
                inputProps={{ min: 0, max: 10 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Factores Estresantes"
                value={seguimientoForm.factores_estresantes}
                onChange={(e) => setSeguimientoForm({ ...seguimientoForm, factores_estresantes: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Apoyo Social"
                value={seguimientoForm.apoyo_social}
                onChange={(e) => setSeguimientoForm({ ...seguimientoForm, apoyo_social: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Observaciones"
                value={seguimientoForm.observaciones}
                onChange={(e) => setSeguimientoForm({ ...seguimientoForm, observaciones: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSeguimientoDialog}>Cancelar</Button>
          <Button onClick={handleSubmitSeguimiento} variant="contained" disabled={createSeguimientoMutation.isPending}>
            Crear
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog: Nuevo Familiar */}
      <Dialog open={openFamiliarDialog} onClose={handleCloseFamiliarDialog} maxWidth="md" fullWidth>
        <DialogTitle>Agregar Familiar/Cuidador</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nombre *"
                value={familiarForm.nombre}
                onChange={(e) => setFamiliarForm({ ...familiarForm, nombre: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Apellido"
                value={familiarForm.apellido}
                onChange={(e) => setFamiliarForm({ ...familiarForm, apellido: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Relación"
                value={familiarForm.relacion}
                onChange={(e) => setFamiliarForm({ ...familiarForm, relacion: e.target.value })}
                placeholder="Ej: Padre, Madre, Cónyuge, Cuidador"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Teléfono"
                value={familiarForm.telefono}
                onChange={(e) => setFamiliarForm({ ...familiarForm, telefono: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={familiarForm.email}
                onChange={(e) => setFamiliarForm({ ...familiarForm, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Dirección"
                value={familiarForm.direccion}
                onChange={(e) => setFamiliarForm({ ...familiarForm, direccion: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFamiliarDialog}>Cancelar</Button>
          <Button onClick={handleSubmitFamiliar} variant="contained" disabled={createFamiliarMutation.isPending}>
            Agregar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

