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
  Checkbox,
  FormControlLabel,
  Card,
  CardContent,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { nutricionApi, patientsApi, eventosApi } from '@/services/api';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'react-toastify';
import { useAuthStore } from '@/store/authStore';

const NIVELES_ACTIVIDAD = ['Sedentario', 'Ligero', 'Moderado', 'Intenso', 'Muy_Intenso'];
const ESTADOS_PLAN = ['Activo', 'Pausado', 'Completado', 'Cancelado'];
const NIVELES_ENERGIA = ['Muy_Bajo', 'Bajo', 'Normal', 'Alto', 'Muy_Alto'];
const ADHERENCIAS = ['Baja', 'Media', 'Alta', 'Completa'];

export default function NutricionPage() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [tabValue, setTabValue] = useState(0);
  const [openEvaluacionDialog, setOpenEvaluacionDialog] = useState(false);
  const [openPlanDialog, setOpenPlanDialog] = useState(false);
  const [openSeguimientoDialog, setOpenSeguimientoDialog] = useState(false);
  const [selectedEvaluacionId, setSelectedEvaluacionId] = useState<string | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const [evaluacionForm, setEvaluacionForm] = useState({
    patient_id: '',
    evento_id: '',
    ticket_id: '',
    peso_kg: '',
    talla_cm: '',
    circunferencia_cintura_cm: '',
    porcentaje_grasa_corporal: '',
    nivel_actividad_fisica: 'Moderado',
    alergias_alimentarias: [] as string[],
    restricciones_dieteticas: [] as string[],
    preferencias_alimentarias: [] as string[],
    enfermedades_cronicas: [] as string[],
    medicamentos_actuales: [] as string[],
    objetivos_nutricionales: '',
    notas_evaluacion: '',
  });

  const [planForm, setPlanForm] = useState({
    evaluacion_id: '',
    patient_id: '',
    nutriologo_asignado_id: '',
    nombre_plan: '',
    descripcion: '',
    fecha_inicio: '',
    fecha_fin: '',
    calorias_diarias: '',
    proteinas_g: '',
    carbohidratos_g: '',
    grasas_g: '',
    fibra_g: '',
    recomendaciones: [] as string[],
    notificaciones_habilitadas: true,
    frecuencia_recordatorios: 'Diario',
  });

  const [seguimientoForm, setSeguimientoForm] = useState({
    plan_id: '',
    patient_id: '',
    fecha_seguimiento: format(new Date(), 'yyyy-MM-dd'),
    peso_kg: '',
    sintomas: [] as string[],
    nivel_energia: 'Normal',
    adherencia_plan: 'Media',
    observaciones: '',
  });

  const { data: evaluaciones, isLoading: loadingEvaluaciones } = useQuery({
    queryKey: ['nutricion-evaluaciones'],
    queryFn: async () => {
      const response = await nutricionApi.getAllEvaluaciones();
      return response.data;
    },
  });

  const { data: planes, isLoading: loadingPlanes } = useQuery({
    queryKey: ['nutricion-planes'],
    queryFn: async () => {
      const response = await nutricionApi.getAllPlanes();
      return response.data;
    },
  });

  const { data: seguimientos, isLoading: loadingSeguimientos } = useQuery({
    queryKey: ['nutricion-seguimientos'],
    queryFn: async () => {
      const response = await nutricionApi.getAllSeguimientos();
      return response.data;
    },
  });

  const { data: seguimientosAlertas } = useQuery({
    queryKey: ['nutricion-seguimientos-alertas'],
    queryFn: async () => {
      try {
        const response = await nutricionApi.getSeguimientosConAlertas();
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

  const createEvaluacionMutation = useMutation({
    mutationFn: nutricionApi.createEvaluacion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nutricion-evaluaciones'] });
      toast.success('Evaluación nutricional creada exitosamente');
      handleCloseEvaluacionDialog();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al crear evaluación');
    },
  });

  const createPlanMutation = useMutation({
    mutationFn: nutricionApi.createPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nutricion-planes'] });
      toast.success('Plan nutricional creado exitosamente');
      handleClosePlanDialog();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al crear plan');
    },
  });

  const createSeguimientoMutation = useMutation({
    mutationFn: nutricionApi.createSeguimiento,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nutricion-seguimientos'] });
      queryClient.invalidateQueries({ queryKey: ['nutricion-seguimientos-alertas'] });
      toast.success('Seguimiento registrado exitosamente');
      handleCloseSeguimientoDialog();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al registrar seguimiento');
    },
  });

  const handleOpenEvaluacionDialog = () => {
    setEvaluacionForm({
      patient_id: '',
      evento_id: '',
      ticket_id: '',
      peso_kg: '',
      talla_cm: '',
      circunferencia_cintura_cm: '',
      porcentaje_grasa_corporal: '',
      nivel_actividad_fisica: 'Moderado',
      alergias_alimentarias: [],
      restricciones_dieteticas: [],
      preferencias_alimentarias: [],
      enfermedades_cronicas: [],
      medicamentos_actuales: [],
      objetivos_nutricionales: '',
      notas_evaluacion: '',
    });
    setOpenEvaluacionDialog(true);
  };

  const handleCloseEvaluacionDialog = () => {
    setOpenEvaluacionDialog(false);
  };

  const handleOpenPlanDialog = (evaluacionId?: string) => {
    if (evaluacionId) {
      const evaluacion = evaluaciones?.find((e: any) => e.evaluacion_id === evaluacionId);
      setPlanForm({
        evaluacion_id: evaluacionId,
        patient_id: evaluacion?.patient_id || '',
        nutriologo_asignado_id: evaluacion?.nutriologo_asignado_id || '',
        nombre_plan: '',
        descripcion: '',
        fecha_inicio: format(new Date(), 'yyyy-MM-dd'),
        fecha_fin: '',
        calorias_diarias: '',
        proteinas_g: '',
        carbohidratos_g: '',
        grasas_g: '',
        fibra_g: '',
        recomendaciones: [],
        notificaciones_habilitadas: true,
        frecuencia_recordatorios: 'Diario',
      });
      setSelectedEvaluacionId(evaluacionId);
    } else {
      setPlanForm({
        evaluacion_id: '',
        patient_id: '',
        nutriologo_asignado_id: '',
        nombre_plan: '',
        descripcion: '',
        fecha_inicio: format(new Date(), 'yyyy-MM-dd'),
        fecha_fin: '',
        calorias_diarias: '',
        proteinas_g: '',
        carbohidratos_g: '',
        grasas_g: '',
        fibra_g: '',
        recomendaciones: [],
        notificaciones_habilitadas: true,
        frecuencia_recordatorios: 'Diario',
      });
    }
    setOpenPlanDialog(true);
  };

  const handleClosePlanDialog = () => {
    setOpenPlanDialog(false);
    setSelectedEvaluacionId(null);
  };

  const handleOpenSeguimientoDialog = (planId?: string) => {
    if (planId) {
      const plan = planes?.find((p: any) => p.plan_id === planId);
      setSeguimientoForm({
        plan_id: planId,
        patient_id: plan?.patient_id || '',
        fecha_seguimiento: format(new Date(), 'yyyy-MM-dd'),
        peso_kg: '',
        sintomas: [],
        nivel_energia: 'Normal',
        adherencia_plan: 'Media',
        observaciones: '',
      });
      setSelectedPlanId(planId);
    } else {
      setSeguimientoForm({
        plan_id: '',
        patient_id: '',
        fecha_seguimiento: format(new Date(), 'yyyy-MM-dd'),
        peso_kg: '',
        sintomas: [],
        nivel_energia: 'Normal',
        adherencia_plan: 'Media',
        observaciones: '',
      });
    }
    setOpenSeguimientoDialog(true);
  };

  const handleCloseSeguimientoDialog = () => {
    setOpenSeguimientoDialog(false);
    setSelectedPlanId(null);
  };

  const handleSubmitEvaluacion = () => {
    if (!evaluacionForm.patient_id) {
      toast.error('Debe seleccionar un paciente');
      return;
    }

    createEvaluacionMutation.mutate({
      ...evaluacionForm,
      evaluado_por_id: user?.user_id,
      peso_kg: evaluacionForm.peso_kg ? parseFloat(evaluacionForm.peso_kg) : undefined,
      talla_cm: evaluacionForm.talla_cm ? parseFloat(evaluacionForm.talla_cm) : undefined,
      circunferencia_cintura_cm: evaluacionForm.circunferencia_cintura_cm
        ? parseFloat(evaluacionForm.circunferencia_cintura_cm)
        : undefined,
      porcentaje_grasa_corporal: evaluacionForm.porcentaje_grasa_corporal
        ? parseFloat(evaluacionForm.porcentaje_grasa_corporal)
        : undefined,
      evento_id: evaluacionForm.evento_id || undefined,
      ticket_id: evaluacionForm.ticket_id || undefined,
    });
  };

  const handleSubmitPlan = () => {
    if (!planForm.evaluacion_id || !planForm.patient_id || !planForm.nombre_plan) {
      toast.error('Debe completar los campos requeridos');
      return;
    }

    createPlanMutation.mutate({
      ...planForm,
      creado_por_id: user?.user_id,
      fecha_inicio: new Date(planForm.fecha_inicio).toISOString(),
      fecha_fin: planForm.fecha_fin ? new Date(planForm.fecha_fin).toISOString() : undefined,
      calorias_diarias: planForm.calorias_diarias ? parseInt(planForm.calorias_diarias) : undefined,
      proteinas_g: planForm.proteinas_g ? parseFloat(planForm.proteinas_g) : undefined,
      carbohidratos_g: planForm.carbohidratos_g ? parseFloat(planForm.carbohidratos_g) : undefined,
      grasas_g: planForm.grasas_g ? parseFloat(planForm.grasas_g) : undefined,
      fibra_g: planForm.fibra_g ? parseFloat(planForm.fibra_g) : undefined,
    });
  };

  const handleSubmitSeguimiento = () => {
    if (!seguimientoForm.plan_id || !seguimientoForm.patient_id) {
      toast.error('Debe seleccionar un plan y paciente');
      return;
    }

    createSeguimientoMutation.mutate({
      ...seguimientoForm,
      registrado_por_id: user?.user_id,
      fecha_seguimiento: new Date(seguimientoForm.fecha_seguimiento).toISOString(),
      peso_kg: seguimientoForm.peso_kg ? parseFloat(seguimientoForm.peso_kg) : undefined,
    });
  };

  const getEstadoColor = (estado: string) => {
    const colors: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
      Activo: 'success',
      Pausado: 'warning',
      Completado: 'info',
      Cancelado: 'error',
    };
    return colors[estado] || 'default';
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={600}>
          Nutrición Personalizada
        </Typography>
      </Box>

      {seguimientosAlertas && seguimientosAlertas.length > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="subtitle2" fontWeight="bold">
            Alertas de Retroceso: {seguimientosAlertas.length}
          </Typography>
          {seguimientosAlertas.slice(0, 3).map((alerta: any) => (
            <Typography key={alerta.seguimiento_id} variant="body2">
              - {alerta.motivo_alerta || 'Retroceso detectado'}
            </Typography>
          ))}
        </Alert>
      )}

      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab label="Evaluaciones" />
          <Tab label="Planes Nutricionales" />
          <Tab label="Seguimientos" />
        </Tabs>
      </Paper>

      {/* Tab: Evaluaciones */}
      {tabValue === 0 && (
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Evaluaciones Nutricionales</Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenEvaluacionDialog}>
              Nueva Evaluación
            </Button>
          </Box>

          {loadingEvaluaciones ? (
            <Typography>Cargando...</Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Paciente</TableCell>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Peso (kg)</TableCell>
                    <TableCell>IMC</TableCell>
                    <TableCell>Actividad</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {evaluaciones?.map((evaluacion: any) => (
                    <TableRow key={evaluacion.evaluacion_id}>
                      <TableCell>
                        {evaluacion.patient?.nombre} {evaluacion.patient?.apellido}
                      </TableCell>
                      <TableCell>
                        {format(new Date(evaluacion.fecha_evaluacion), 'dd/MM/yyyy', { locale: es })}
                      </TableCell>
                      <TableCell>{evaluacion.peso_kg ? Number(evaluacion.peso_kg).toFixed(2) : '-'}</TableCell>
                      <TableCell>{evaluacion.imc ? Number(evaluacion.imc).toFixed(2) : '-'}</TableCell>
                      <TableCell>{evaluacion.nivel_actividad_fisica || '-'}</TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          onClick={() => handleOpenPlanDialog(evaluacion.evaluacion_id)}
                          disabled={!evaluacion.evaluacion_id}
                        >
                          Crear Plan
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Dialog: Nueva Evaluación */}
          <Dialog open={openEvaluacionDialog} onClose={handleCloseEvaluacionDialog} maxWidth="md" fullWidth>
            <DialogTitle>Nueva Evaluación Nutricional</DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Paciente *</InputLabel>
                    <Select
                      value={evaluacionForm.patient_id}
                      onChange={(e) => setEvaluacionForm({ ...evaluacionForm, patient_id: e.target.value })}
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
                    <InputLabel>Evento</InputLabel>
                    <Select
                      value={evaluacionForm.evento_id}
                      onChange={(e) => setEvaluacionForm({ ...evaluacionForm, evento_id: e.target.value })}
                      label="Evento"
                    >
                      <MenuItem value="">Ninguno</MenuItem>
                      {eventos?.map((evento: any) => (
                        <MenuItem key={evento.evento_id} value={evento.evento_id}>
                          {format(new Date(evento.fecha_inicio), 'dd/MM/yyyy', { locale: es })} - {evento.patient?.nombre}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Peso (kg)"
                    type="number"
                    value={evaluacionForm.peso_kg}
                    onChange={(e) => setEvaluacionForm({ ...evaluacionForm, peso_kg: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Talla (cm)"
                    type="number"
                    value={evaluacionForm.talla_cm}
                    onChange={(e) => setEvaluacionForm({ ...evaluacionForm, talla_cm: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Circunferencia Cintura (cm)"
                    type="number"
                    value={evaluacionForm.circunferencia_cintura_cm}
                    onChange={(e) =>
                      setEvaluacionForm({ ...evaluacionForm, circunferencia_cintura_cm: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="% Grasa Corporal"
                    type="number"
                    value={evaluacionForm.porcentaje_grasa_corporal}
                    onChange={(e) =>
                      setEvaluacionForm({ ...evaluacionForm, porcentaje_grasa_corporal: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Nivel de Actividad Física</InputLabel>
                    <Select
                      value={evaluacionForm.nivel_actividad_fisica}
                      onChange={(e) =>
                        setEvaluacionForm({ ...evaluacionForm, nivel_actividad_fisica: e.target.value })
                      }
                      label="Nivel de Actividad Física"
                    >
                      {NIVELES_ACTIVIDAD.map((nivel) => (
                        <MenuItem key={nivel} value={nivel}>
                          {nivel}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Objetivos Nutricionales"
                    value={evaluacionForm.objetivos_nutricionales}
                    onChange={(e) =>
                      setEvaluacionForm({ ...evaluacionForm, objetivos_nutricionales: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Notas de Evaluación"
                    value={evaluacionForm.notas_evaluacion}
                    onChange={(e) =>
                      setEvaluacionForm({ ...evaluacionForm, notas_evaluacion: e.target.value })
                    }
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseEvaluacionDialog}>Cancelar</Button>
              <Button onClick={handleSubmitEvaluacion} variant="contained" disabled={createEvaluacionMutation.isPending}>
                Crear
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}

      {/* Tab: Planes Nutricionales */}
      {tabValue === 1 && (
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Planes Nutricionales</Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenPlanDialog()}>
              Nuevo Plan
            </Button>
          </Box>

          {loadingPlanes ? (
            <Typography>Cargando...</Typography>
          ) : (
            <Grid container spacing={2}>
              {planes?.map((plan: any) => (
                <Grid item xs={12} md={6} key={plan.plan_id}>
                  <Card>
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                        <Typography variant="h6">{plan.nombre_plan}</Typography>
                        <Chip label={plan.estado} color={getEstadoColor(plan.estado)} size="small" />
                      </Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Paciente: {plan.patient?.nombre} {plan.patient?.apellido}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Fecha inicio: {format(new Date(plan.fecha_inicio), 'dd/MM/yyyy', { locale: es })}
                      </Typography>
                      {plan.calorias_diarias && (
                        <Typography variant="body2" color="text.secondary">
                          Calorías diarias: {plan.calorias_diarias} kcal
                        </Typography>
                      )}
                      <Box mt={2}>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleOpenSeguimientoDialog(plan.plan_id)}
                          sx={{ mr: 1 }}
                        >
                          Registrar Seguimiento
                        </Button>
                        <Button size="small" variant="outlined" onClick={() => {}}>
                          Ver Detalles
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Dialog: Nuevo Plan */}
          <Dialog open={openPlanDialog} onClose={handleClosePlanDialog} maxWidth="md" fullWidth>
            <DialogTitle>Nuevo Plan Nutricional</DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Evaluación *</InputLabel>
                    <Select
                      value={planForm.evaluacion_id}
                      onChange={(e) => setPlanForm({ ...planForm, evaluacion_id: e.target.value })}
                      label="Evaluación *"
                      disabled={!!selectedEvaluacionId}
                    >
                      {evaluaciones?.map((evaluacion: any) => (
                        <MenuItem key={evaluacion.evaluacion_id} value={evaluacion.evaluacion_id}>
                          {evaluacion.patient?.nombre} - {format(new Date(evaluacion.fecha_evaluacion), 'dd/MM/yyyy', { locale: es })}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Paciente *</InputLabel>
                    <Select
                      value={planForm.patient_id}
                      onChange={(e) => setPlanForm({ ...planForm, patient_id: e.target.value })}
                      label="Paciente *"
                      disabled={!!selectedEvaluacionId}
                    >
                      {patients?.map((patient: any) => (
                        <MenuItem key={patient.patient_id} value={patient.patient_id}>
                          {patient.nombre} {patient.apellido}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Nombre del Plan *"
                    value={planForm.nombre_plan}
                    onChange={(e) => setPlanForm({ ...planForm, nombre_plan: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    label="Descripción"
                    value={planForm.descripcion}
                    onChange={(e) => setPlanForm({ ...planForm, descripcion: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Fecha Inicio *"
                    value={planForm.fecha_inicio}
                    onChange={(e) => setPlanForm({ ...planForm, fecha_inicio: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Fecha Fin"
                    value={planForm.fecha_fin}
                    onChange={(e) => setPlanForm({ ...planForm, fecha_fin: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Calorías Diarias"
                    value={planForm.calorias_diarias}
                    onChange={(e) => setPlanForm({ ...planForm, calorias_diarias: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Proteínas (g)"
                    value={planForm.proteinas_g}
                    onChange={(e) => setPlanForm({ ...planForm, proteinas_g: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Carbohidratos (g)"
                    value={planForm.carbohidratos_g}
                    onChange={(e) => setPlanForm({ ...planForm, carbohidratos_g: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Grasas (g)"
                    value={planForm.grasas_g}
                    onChange={(e) => setPlanForm({ ...planForm, grasas_g: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Fibra (g)"
                    value={planForm.fibra_g}
                    onChange={(e) => setPlanForm({ ...planForm, fibra_g: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Frecuencia Recordatorios</InputLabel>
                    <Select
                      value={planForm.frecuencia_recordatorios}
                      onChange={(e) => setPlanForm({ ...planForm, frecuencia_recordatorios: e.target.value })}
                      label="Frecuencia Recordatorios"
                    >
                      <MenuItem value="Diario">Diario</MenuItem>
                      <MenuItem value="Cada_2_dias">Cada 2 días</MenuItem>
                      <MenuItem value="Semanal">Semanal</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={planForm.notificaciones_habilitadas}
                        onChange={(e) =>
                          setPlanForm({ ...planForm, notificaciones_habilitadas: e.target.checked })
                        }
                      />
                    }
                    label="Notificaciones Habilitadas"
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClosePlanDialog}>Cancelar</Button>
              <Button onClick={handleSubmitPlan} variant="contained" disabled={createPlanMutation.isPending}>
                Crear
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}

      {/* Tab: Seguimientos */}
      {tabValue === 2 && (
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Seguimientos Nutricionales</Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenSeguimientoDialog()}>
              Nuevo Seguimiento
            </Button>
          </Box>

          {loadingSeguimientos ? (
            <Typography>Cargando...</Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Paciente</TableCell>
                    <TableCell>Plan</TableCell>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Peso (kg)</TableCell>
                    <TableCell>Nivel Energía</TableCell>
                    <TableCell>Adherencia</TableCell>
                    <TableCell>Alerta</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {seguimientos?.map((seguimiento: any) => (
                    <TableRow key={seguimiento.seguimiento_id}>
                      <TableCell>
                        {seguimiento.patient?.nombre} {seguimiento.patient?.apellido}
                      </TableCell>
                      <TableCell>{seguimiento.plan?.nombre_plan || '-'}</TableCell>
                      <TableCell>
                        {format(new Date(seguimiento.fecha_seguimiento), 'dd/MM/yyyy', { locale: es })}
                      </TableCell>
                      <TableCell>{seguimiento.peso_kg ? Number(seguimiento.peso_kg).toFixed(2) : '-'}</TableCell>
                      <TableCell>{seguimiento.nivel_energia || '-'}</TableCell>
                      <TableCell>
                        <Chip
                          label={seguimiento.adherencia_plan || '-'}
                          size="small"
                          color={seguimiento.adherencia_plan === 'Alta' || seguimiento.adherencia_plan === 'Completa' ? 'success' : 'warning'}
                        />
                      </TableCell>
                      <TableCell>
                        {seguimiento.alerta_retroceso && (
                          <Chip label="⚠️ Alerta" color="error" size="small" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Dialog: Nuevo Seguimiento */}
          <Dialog open={openSeguimientoDialog} onClose={handleCloseSeguimientoDialog} maxWidth="sm" fullWidth>
            <DialogTitle>Nuevo Seguimiento Nutricional</DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Plan Nutricional *</InputLabel>
                    <Select
                      value={seguimientoForm.plan_id}
                      onChange={(e) => setSeguimientoForm({ ...seguimientoForm, plan_id: e.target.value })}
                      label="Plan Nutricional *"
                      disabled={!!selectedPlanId}
                    >
                      {planes?.filter((p: any) => p.estado === 'Activo').map((plan: any) => (
                        <MenuItem key={plan.plan_id} value={plan.plan_id}>
                          {plan.nombre_plan} - {plan.patient?.nombre}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Fecha Seguimiento"
                    value={seguimientoForm.fecha_seguimiento}
                    onChange={(e) => setSeguimientoForm({ ...seguimientoForm, fecha_seguimiento: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Peso (kg)"
                    value={seguimientoForm.peso_kg}
                    onChange={(e) => setSeguimientoForm({ ...seguimientoForm, peso_kg: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Nivel de Energía</InputLabel>
                    <Select
                      value={seguimientoForm.nivel_energia}
                      onChange={(e) => setSeguimientoForm({ ...seguimientoForm, nivel_energia: e.target.value })}
                      label="Nivel de Energía"
                    >
                      {NIVELES_ENERGIA.map((nivel) => (
                        <MenuItem key={nivel} value={nivel}>
                          {nivel.replace('_', ' ')}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Adherencia al Plan</InputLabel>
                    <Select
                      value={seguimientoForm.adherencia_plan}
                      onChange={(e) => setSeguimientoForm({ ...seguimientoForm, adherencia_plan: e.target.value })}
                      label="Adherencia al Plan"
                    >
                      {ADHERENCIAS.map((adherencia) => (
                        <MenuItem key={adherencia} value={adherencia}>
                          {adherencia}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
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
              <Button
                onClick={handleSubmitSeguimiento}
                variant="contained"
                disabled={createSeguimientoMutation.isPending}
              >
                Registrar
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}
    </Box>
  );
}

