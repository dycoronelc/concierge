# 📋 Épicas Pendientes - Plataforma Concierge

## ✅ Épicas Ya Implementadas

- **EPIC 1-9**: Funcionalidades base (Tickets, Clasificación, Asignación, SLA, Eventos, Encuentros)
- **EPIC 10**: Servicios de Enfermería y Atención Domiciliaria ✅
- **EPIC 11**: Transporte y Logística de Pacientes ✅
- **EPIC 14**: Diagnóstico Avanzado y Estudios Clínicos ✅
- **EPIC 16**: Omnicanalidad básica (WhatsApp webhook, chatbot) ✅

---

## 🚧 Épicas Pendientes

### EPIC 12: Nutrición Personalizada y Planes Alimenticios
**Prioridad: Media**

**Funcionalidades a implementar:**
- HU-12.1: Evaluación nutricional del paciente
  - Formulario digital de evaluación
  - Registro de mediciones y hábitos
  - Carga de reportes previos

- HU-12.2: Crear plan nutricional personalizado
  - Asignación de nutriólogo
  - Generación de plan semanal
  - Notificaciones de recordatorio

- HU-12.3: Seguimiento nutricional continuo
  - Control de peso, energía, síntomas
  - Alertas automáticas si hay retrocesos

**Entidades necesarias:**
- `evaluaciones_nutricionales`
- `planes_nutricionales`
- `seguimiento_nutricional`

---

### EPIC 13: Psicología, Psiquiatría y Apoyo Emocional
**Prioridad: Media**

**Funcionalidades a implementar:**
- HU-13.1: Solicitar consulta psicológica
  - Modalidad: presencial / telefónica / videollamada
  - Registro de disponibilidad del usuario

- HU-13.2: Seguimiento emocional
  - Registro de estado de ánimo
  - Alertas automáticas para casos críticos

- HU-13.3: Sesiones para familiares/cuidadores
  - Usuarios asociados al paciente
  - Registro de sesiones grupales

**Entidades necesarias:**
- `solicitudes_psicologia`
- `sesiones_psicologia`
- `seguimiento_emocional`
- `usuarios_asociados` (familiares/cuidadores)

---

### EPIC 15: Planificación Financiera de la Enfermedad y Derechohabiencia
**Prioridad: Media**

**Funcionalidades a implementar:**
- HU-15.1: Evaluación de cobertura del paciente
  - Verificación de póliza o seguro público
  - Reglas automáticas para determinar cobertura disponible

- HU-15.2: Plan financiero del tratamiento
  - Estimación de costo de medicamentos y servicios
  - Reembolso proyectado
  - Asignación de trabajador social

- HU-15.3: Alertas de trámites pendientes
  - Vencimiento de autorizaciones
  - Solicitudes pendientes del paciente

**Entidades necesarias:**
- `coberturas_paciente` (pólizas y seguros)
- `planes_financieros`
- `autorizaciones_medicas`
- `reembolsos`
- `tramites_pendientes`

---

### EPIC 16: Mejoras de Omnicanalidad (Parcialmente Implementado)
**Prioridad: Alta**

**Ya implementado:**
- ✅ Integración básica con WhatsApp (webhook 2chat)
- ✅ Chatbot básico

**Pendiente de implementar:**
- HU-16.2: Contacto por Llamada Telefónica mejorado
  - Registro automático de llamadas entrantes y salientes
  - Integración opcional con PBX / VoIP
  - Grabación, transcript y vinculación a ticket

- HU-16.3: Contacto por Videollamada
  - Integración con WebRTC, Zoom o Google Meet
  - Registro de fecha, duración y profesional asignado

- HU-16.4: Portal Web del Paciente
  - Autoservicio completo: citas, documentos, pagos, historial
  - Chat en tiempo real
  - Formularios inteligentes

- HU-16.5: App Móvil
  - Push notifications
  - Chat seguro
  - Seguimiento de citas y solicitudes

- HU-16.6: Chatbots y Automatización IA mejorados
  - Creación automática de tickets
  - Clasificación clínica preliminar
  - Flujo conversacional cognitivo
  - Transferencia automatizada a agente humano

- HU-16.7: Omnicanalidad Integrada
  - Línea de tiempo consolidada
  - SLA por canal
  - Enrutamiento inteligente
  - KPI por canal, volumen, tiempos

**Entidades necesarias:**
- `llamadas_telefonicas` (mejorado)
- `videollamadas`
- `interacciones_omnicanal` (consolidación)
- `transcripts_llamadas`

---

## 🎯 Orden de Implementación Recomendado

1. **EPIC 12** - Nutrición Personalizada (media prioridad, funcionalidad completa)
2. **EPIC 13** - Psicología y Apoyo Emocional (media prioridad, funcionalidad completa)
3. **EPIC 15** - Planificación Financiera (media prioridad, funcionalidad completa)
4. **EPIC 16** - Mejoras de Omnicanalidad (alta prioridad, mejoras incrementales)

---

## 📝 Notas de Implementación

- Todas las nuevas entidades deben relacionarse con `patients` y `eventos` cuando aplique
- Los servicios deben seguir el patrón NestJS existente
- Las interfaces frontend deben seguir el diseño Material-UI actual
- Considerar integraciones futuras con sistemas externos
- Mantener consistencia con las épicas ya implementadas (EPIC 10, 11, 14)

