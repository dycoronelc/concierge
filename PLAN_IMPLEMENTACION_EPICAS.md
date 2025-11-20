# 📋 Plan de Implementación - Nuevas Épicas FlowCare

## ✅ Ya Implementado

- **EPIC 1**: Captura y Creación de Tickets ✅
- **EPIC 2**: Clasificación Automática ✅
- **EPIC 3**: Asignación de Prestadores ✅
- **EPIC 4**: Ciclo de Vida del Ticket y SLA ✅
- **EPIC 9**: Gestión Clínica por EVENTOS y ENCUENTROS ✅
- **EPIC 16**: Omnicanalidad parcial (WhatsApp webhook, chatbot básico) ✅

## 🆕 Nuevas Épicas a Implementar

### EPIC 10: Servicios de Enfermería y Atención Domiciliaria
**Prioridad: Alta**

**Entidades necesarias:**
- `servicios_enfermeria` (solicitudes de enfermería)
- `visitas_enfermeria` (registro de visitas)
- `administracion_medicamentos` (medicamentos administrados)

**Funcionalidades:**
- Solicitar visita de enfermería
- Administración de medicamentos a domicilio
- Seguimiento post-visita

---

### EPIC 11: Transporte y Logística de Pacientes
**Prioridad: Alta**

**Entidades necesarias:**
- `solicitudes_transporte` (solicitudes de traslado)
- `vehiculos` (catálogo de vehículos)
- `traslados` (registro de traslados)
- `incidentes_transporte` (incidentes durante traslado)

**Funcionalidades:**
- Solicitar traslado médico
- Seguimiento GPS en tiempo real
- Registro de incidentes

---

### EPIC 12: Nutrición Personalizada y Planes Alimenticios
**Prioridad: Media**

**Entidades necesarias:**
- `evaluaciones_nutricionales` (evaluaciones)
- `planes_nutricionales` (planes personalizados)
- `seguimiento_nutricional` (seguimiento continuo)

**Funcionalidades:**
- Evaluación nutricional
- Crear plan nutricional personalizado
- Seguimiento nutricional continuo

---

### EPIC 13: Psicología, Psiquiatría y Apoyo Emocional
**Prioridad: Media**

**Entidades necesarias:**
- `solicitudes_psicologia` (solicitudes de consulta)
- `sesiones_psicologia` (registro de sesiones)
- `seguimiento_emocional` (estado de ánimo)

**Funcionalidades:**
- Solicitar consulta psicológica
- Seguimiento emocional
- Sesiones para familiares/cuidadores

---

### EPIC 14: Diagnóstico Avanzado, Genómica y Estudios Clínicos
**Prioridad: Alta**

**Entidades necesarias:**
- `solicitudes_estudios` (solicitudes de estudios)
- `estudios_clinicos` (catálogo de estudios)
- `muestras` (toma de muestras)
- `resultados_estudios` (resultados)
- `consentimientos` (consentimientos informados)

**Funcionalidades:**
- Solicitar toma de muestras a domicilio
- Estudio genómico/genético
- Integración con EVENTOS y ENCUENTROS

---

### EPIC 15: Planificación Financiera de la Enfermedad
**Prioridad: Media**

**Entidades necesarias:**
- `coberturas_paciente` (pólizas y seguros)
- `planes_financieros` (planes de tratamiento)
- `autorizaciones` (autorizaciones médicas)
- `reembolsos` (reembolsos proyectados)

**Funcionalidades:**
- Evaluación de cobertura
- Plan financiero del tratamiento
- Alertas de trámites pendientes

---

### EPIC 16: Omnicanalidad Mejorada
**Prioridad: Alta**

**Mejoras necesarias:**
- Registro de llamadas telefónicas (ya parcialmente implementado)
- Integración con videollamadas (WebRTC, Zoom, Google Meet)
- Portal web del paciente (frontend adicional)
- App móvil (React Native)
- Chatbots mejorados con IA

---

## 🎯 Orden de Implementación Recomendado

1. **EPIC 14** - Diagnóstico Avanzado (alta prioridad, se integra con Eventos)
2. **EPIC 10** - Servicios de Enfermería (alta prioridad, uso frecuente)
3. **EPIC 11** - Transporte (alta prioridad, logística crítica)
4. **EPIC 16** - Mejoras de Omnicanalidad (alta prioridad, experiencia de usuario)
5. **EPIC 12** - Nutrición (media prioridad)
6. **EPIC 13** - Psicología (media prioridad)
7. **EPIC 15** - Planificación Financiera (media prioridad)

---

## 📝 Notas de Implementación

- Todas las nuevas entidades deben relacionarse con `patients` y `eventos` cuando aplique
- Los servicios deben seguir el patrón NestJS existente
- Las interfaces frontend deben seguir el diseño Material-UI actual
- Considerar integraciones futuras con sistemas externos

