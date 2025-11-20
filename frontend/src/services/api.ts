import axios from 'axios';

// En producción, usar la URL del backend desplegado (Railway)
// En desarrollo, usar localhost
const API_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD 
    ? '' // Se configurará con la variable de entorno VITE_API_URL en Railway
    : 'http://localhost:3000');

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (username: string, password: string) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },
  register: async (data: any) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
};

export const ticketsApi = {
  getAll: (params?: any) => api.get('/tickets', { params }),
  getOne: (id: string) => api.get(`/tickets/${id}`),
  create: (data: any) => api.post('/tickets', data),
  createFromWhatsApp: (data: any) => api.post('/tickets/whatsapp', data),
  createFromCall: (data: any) => api.post('/tickets/call', data),
  update: (id: string, data: any) => api.put(`/tickets/${id}`, data),
  updateStatus: (id: string, data: any) => api.put(`/tickets/${id}/status`, data),
  merge: (id: string, data: any) => api.post(`/tickets/${id}/merge`, data),
  assignProvider: (id: string, data: any) => api.post(`/tickets/${id}/assign-provider`, data),
  reassignProvider: (id: string, data: any) => api.post(`/tickets/${id}/reassign-provider`, data),
};

export const patientsApi = {
  getAll: () => api.get('/patients'),
  getOne: (id: string) => api.get(`/patients/${id}`),
  create: (data: any) => api.post('/patients', data),
  update: (id: string, data: any) => api.put(`/patients/${id}`, data),
};

export const providersApi = {
  getAll: () => api.get('/providers'),
  getOne: (id: string) => api.get(`/providers/${id}`),
  getAvailable: (params: any) => api.get('/providers/available', { params }),
};

export const classificationsApi = {
  classify: (ticketId: string, data: any) =>
    api.post(`/classifications/${ticketId}`, data),
  update: (ticketId: string, data: any) =>
    api.put(`/classifications/${ticketId}`, data),
};

export const eventosApi = {
  getAll: (params?: any) => api.get('/eventos', { params }),
  getOne: (id: string) => api.get(`/eventos/${id}`),
  create: (data: any) => api.post('/eventos', data),
  update: (id: string, data: any) => api.put(`/eventos/${id}`, data),
  close: (id: string, data?: { motivo?: string }) => api.put(`/eventos/${id}/close`, data),
  getHistorialClinico: (patientId: string) => api.get(`/eventos/historial/${patientId}`),
};

export const encuentrosApi = {
  getAll: (params?: any) => api.get('/encuentros', { params }),
  getOne: (id: string) => api.get(`/encuentros/${id}`),
  create: (data: any) => api.post('/encuentros', data),
  update: (id: string, data: any) => api.put(`/encuentros/${id}`, data),
  delete: (id: string) => api.delete(`/encuentros/${id}`),
};

export const icd10Api = {
  getAll: (params?: any) => api.get('/icd10', { params }),
  getOne: (id: string) => api.get(`/icd10/${id}`),
  search: (query: string, limit?: number) => api.get('/icd10/search', { params: { q: query, limit } }),
  findByCode: (code: string) => api.get(`/icd10/code/${code}`),
  create: (data: any) => api.post('/icd10', data),
  update: (id: string, data: any) => api.put(`/icd10/${id}`, data),
  delete: (id: string) => api.delete(`/icd10/${id}`),
};

export const chatbotApi = {
  sendMessage: async (message: string) => {
    const response = await api.post('/chatbot/message', { message });
    return response.data;
  },
};

export const enfermeriaApi = {
  createServicio: (data: any) => api.post('/enfermeria/servicios', data),
  getAllServicios: (params?: any) => api.get('/enfermeria/servicios', { params }),
  getServicio: (id: string) => api.get(`/enfermeria/servicios/${id}`),
  asignarEnfermero: (id: string, data: { enfermero_id: string }) =>
    api.put(`/enfermeria/servicios/${id}/asignar`, data),
  completarVisita: (id: string, data: { notas: string }) =>
    api.put(`/enfermeria/servicios/${id}/completar`, data),
  registrarMedicamento: (data: any) => api.post('/enfermeria/medicamentos', data),
  getMedicamentosPorPaciente: (patient_id: string) =>
    api.get(`/enfermeria/medicamentos/patient/${patient_id}`),
};

export const transporteApi = {
  createSolicitud: (data: any) => api.post('/transporte/solicitudes', data),
  getAllSolicitudes: (params?: any) => api.get('/transporte/solicitudes', { params }),
  getSolicitud: (id: string) => api.get(`/transporte/solicitudes/${id}`),
  asignarVehiculo: (id: string, data: { vehiculo_id: string; conductor_id: string }) =>
    api.put(`/transporte/solicitudes/${id}/asignar`, data),
  iniciarTraslado: (id: string) => api.put(`/transporte/solicitudes/${id}/iniciar`),
  completarTraslado: (id: string, data: { observaciones?: string }) =>
    api.put(`/transporte/solicitudes/${id}/completar`, data),
  actualizarUbicacion: (id: string, data: { latitud: number; longitud: number }) =>
    api.put(`/transporte/vehiculos/${id}/ubicacion`, data),
  getVehiculosDisponibles: () => api.get('/transporte/vehiculos/disponibles'),
  getAllVehiculos: () => api.get('/transporte/vehiculos'),
  createVehiculo: (data: any) => api.post('/transporte/vehiculos', data),
};

export const estudiosApi = {
  createSolicitud: (data: any) => api.post('/estudios/solicitudes', data),
  getAllSolicitudes: (params?: any) => api.get('/estudios/solicitudes', { params }),
  getSolicitud: (id: string) => api.get(`/estudios/solicitudes/${id}`),
  asignarTecnico: (id: string, data: { tecnico_id: string }) =>
    api.put(`/estudios/solicitudes/${id}/asignar`, data),
  registrarTomaMuestra: (id: string, data: { cadena_custodia: string }) =>
    api.put(`/estudios/solicitudes/${id}/toma-muestra`, data),
  registrarResultado: (data: any) => api.post('/estudios/resultados', data),
  getResultadosPorEvento: (evento_id: string) =>
    api.get(`/estudios/resultados/evento/${evento_id}`),
  getResultadosPorPaciente: (patient_id: string) =>
    api.get(`/estudios/resultados/patient/${patient_id}`),
};

export const nutricionApi = {
  // Evaluaciones
  createEvaluacion: (data: any) => api.post('/nutricion/evaluaciones', data),
  getAllEvaluaciones: (params?: any) => api.get('/nutricion/evaluaciones', { params }),
  getEvaluacion: (id: string) => api.get(`/nutricion/evaluaciones/${id}`),
  // Planes
  createPlan: (data: any) => api.post('/nutricion/planes', data),
  getAllPlanes: (params?: any) => api.get('/nutricion/planes', { params }),
  getPlan: (id: string) => api.get(`/nutricion/planes/${id}`),
  updatePlan: (id: string, data: any) => api.put(`/nutricion/planes/${id}`, data),
  updatePlanEstado: (id: string, estado: string) => api.put(`/nutricion/planes/${id}/estado`, { estado }),
  // Seguimientos
  createSeguimiento: (data: any) => api.post('/nutricion/seguimientos', data),
  getAllSeguimientos: (params?: any) => api.get('/nutricion/seguimientos', { params }),
  getSeguimiento: (id: string) => api.get(`/nutricion/seguimientos/${id}`),
  getSeguimientosConAlertas: (patient_id?: string) => api.get('/nutricion/seguimientos/alertas', { params: { patient_id } }),
};

export const psicologiaApi = {
  // Consultas Psicológicas
  createConsulta: (data: any) => api.post('/psicologia/consultas', data),
  getAllConsultas: (params?: any) => api.get('/psicologia/consultas', { params }),
  getConsulta: (id: string) => api.get(`/psicologia/consultas/${id}`),
  updateConsulta: (id: string, data: any) => api.put(`/psicologia/consultas/${id}`, data),
  // Sesiones Psicológicas
  createSesion: (data: any) => api.post('/psicologia/sesiones', data),
  getAllSesiones: (params?: any) => api.get('/psicologia/sesiones', { params }),
  getSesion: (id: string) => api.get(`/psicologia/sesiones/${id}`),
  updateSesion: (id: string, data: any) => api.put(`/psicologia/sesiones/${id}`, data),
  // Seguimiento Emocional
  createSeguimiento: (data: any) => api.post('/psicologia/seguimientos', data),
  getAllSeguimientos: (params?: any) => api.get('/psicologia/seguimientos', { params }),
  getSeguimiento: (id: string) => api.get(`/psicologia/seguimientos/${id}`),
  getSeguimientosConAlertas: (patient_id?: string) => api.get('/psicologia/seguimientos/alertas', { params: { patient_id } }),
  // Familiares y Cuidadores
  createFamiliar: (data: any) => api.post('/psicologia/familiares', data),
  getAllFamiliares: (patient_id: string) => api.get('/psicologia/familiares', { params: { patient_id } }),
  getFamiliar: (id: string) => api.get(`/psicologia/familiares/${id}`),
  updateFamiliar: (id: string, data: any) => api.put(`/psicologia/familiares/${id}`, data),
  deleteFamiliar: (id: string) => api.delete(`/psicologia/familiares/${id}`),
};

export const statisticsApi = {
  getDashboardStats: () => api.get('/statistics/dashboard'),
  getPredictiveStats: () => api.get('/statistics/predictive'),
  getSLAStats: () => api.get('/statistics/sla'),
  getDiagnosticStats: () => api.get('/statistics/diagnostics'),
};

