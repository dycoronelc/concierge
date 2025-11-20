# 📄 Documento de Historias de Usuario — Plataforma Concierge MINSEG (FlowCare)
*(Versión Markdown ampliada con servicios tipo Concierge SOHIN y Omnicanalidad)*

## 1. Introducción
Este documento detalla el conjunto de Historias de Usuario (HU) agrupadas en Épicas para la Plataforma Concierge MINSEG, ampliada para incluir servicios encontrados en el análisis del sitio Concierge SOHIN y nuevas funcionalidades de omnicanalidad para una atención integral.

---

## 2. Estructura de Prioridad y Nomenclatura

| Tipo | Prefijo | Descripción |
|------|---------|-------------|
| Épica | EPIC-X | Conjunto de Historias de Usuario relacionadas a un objetivo grande. |
| Historia de Usuario | HU-X.Y | Requerimiento escrito como: *Como [rol], quiero [meta], para [beneficio].* |

---

## 3. Épicas y Historias de Usuario Detalladas

(Se mantienen todas las Épicas 1–9 del archivo anterior, más nuevas Épicas 10–16.)

---

# 🟦 EPIC 10 · Servicios de Enfermería y Atención Domiciliaria

### HU-10.1 – Solicitar visita de enfermería
**Como** paciente  
**Quiero** solicitar una visita de enfermería a domicilio  
**Para** recibir cuidados especializados sin desplazarme  

**Criterios**
- Registro de solicitud.
- Selección de tipo de cuidado (heridas, inyecciones, educación, monitoreo).
- Asignación automática/manual del profesional adecuado.

### HU-10.2 – Administración de medicamentos a domicilio
**Criterios**
- Registro de tipo de medicamento.
- Validación de prescripción.
- Registro de visita, hora, responsable y notas clínicas.

### HU-10.3 – Seguimiento post-visita
**Criterios**
- Encuesta de satisfacción.
- Seguimiento de síntomas.
- Alertas a la central si los síntomas empeoran.

---

# 🟦 EPIC 11 · Transporte y Logística de Pacientes

### HU-11.1 – Solicitar traslado médico
**Criterios**
- Seleccionar origen/destino.
- Determinar tipo de traslado (ordinario / asistido).
- Asignación de vehículo disponible.
- Integración GPS opcional.

### HU-11.2 – Seguimiento de vehículo en tiempo real
**Criterios**
- Ver ubicación del vehículo.
- Estimación de llegada.
- Notificaciones push/WhatsApp.

### HU-11.3 – Registro de incidentes durante traslado
**Criterios**
- Bitácora de viaje.
- Registro de observaciones clínicas si aplica.

---

# 🟦 EPIC 12 · Nutrición Personalizada y Planes Alimenticios

### HU-12.1 – Evaluación nutricional del paciente
**Criterios**
- Formulario digital.
- Registro de mediciones y hábitos.
- Carga de reportes previos.

### HU-12.2 – Crear plan nutricional personalizado
**Criterios**
- Nutriólogo asignado.
- Generación de plan semanal.
- Notificaciones de recordatorio.

### HU-12.3 – Seguimiento nutricional continuo
**Criterios**
- Control de peso, energía, síntomas.
- Alertas automáticas si hay retrocesos.

---

# 🟦 EPIC 13 · Psicología, Psiquiatría y Apoyo Emocional

### HU-13.1 – Solicitar consulta psicológica
**Criterios**
- Modalidad: presencial / telefónica / videollamada.
- Registro de disponibilidad del usuario.

### HU-13.2 – Seguimiento emocional
**Criterios**
- Registro de estado de ánimo.
- Alertas automáticas para casos críticos.

### HU-13.3 – Sesiones para familiares/cuidadores
**Criterios**
- Usuarios asociados al paciente.
- Registro de sesiones grupales.

---

# 🟦 EPIC 14 · Diagnóstico Avanzado, Genómica y Estudios Clínicos

### HU-14.1 – Solicitar toma de muestras a domicilio
**Criterios**
- Catálogo de estudios (sangre, orina, imagen).
- Asignación de flebotomista/técnico.
- Registro de cadena de custodia.

### HU-14.2 – Estudio genómico / genético
**Criterios**
- Carga de consentimiento informado.
- Seguimiento del laboratorio.
- Entrega de resultados al especialista.

### HU-14.3 – Integración de resultados con EVENTOS y ENCUENTROS
**Criterios**
- Resultados se asocian al EVENTO clínico correspondiente.
- Los nuevos diagnósticos pueden generar EVENTO nuevo.

---

# 🟦 EPIC 15 · Planificación Financiera de la Enfermedad y Derechohabiencia

### HU-15.1 – Evaluación de cobertura del paciente
**Criterios**
- Verificación de póliza o seguro público.
- Reglas automáticas para determinar cobertura disponible.

### HU-15.2 – Plan financiero del tratamiento
**Criterios**
- Estimación de costo de medicamentos y servicios.
- Reembolso proyectado.
- Asignación de trabajador social.

### HU-15.3 – Alertas de trámites pendientes
**Criterios**
- Vencimiento de autorizaciones.
- Solicitudes pendientes del paciente.

---

# 🟦 EPIC 16 · Omnicanalidad y Contacto Multicanal

La plataforma debe ser capaz de soportar múltiples canales simultáneamente y consolidar la información para evitar pérdida de contexto.

## HU-16.1 – Contacto por WhatsApp
**Criterios**
- Integración con proveedores como 2chat, Twilio o Meta Cloud API.
- Registro automático de mensajes.
- Flujos automáticos con IA para clasificación inicial.

## HU-16.2 – Contacto por Llamada Telefónica
**Criterios**
- Registro automático de llamadas entrantes y salientes.
- Integración opcional con PBX / VoIP.
- Grabación, transcript y vinculación a ticket.

## HU-16.3 – Contacto por Videollamada
**Criterios**
- Integración con WebRTC, Zoom o Google Meet.
- Registro de fecha, duración y profesional asignado.

## HU-16.4 – Portal Web del Paciente
**Criterios**
- Autoservicio completo: citas, documentos, pagos, historial.
- Chat en tiempo real.
- Formularios inteligentes.

## HU-16.5 – App Móvil
**Criterios**
- Push notifications.
- Chat seguro.
- Seguimiento de citas y solicitudes.

## HU-16.6 – Chatbots y Automatización IA
**Criterios**
- Creación automática de tickets.
- Clasificación clínica preliminar.
- Flujo conversacional cognitivo.
- Transferencia automatizada a agente humano.

## HU-16.7 – Omnicanalidad Integrada
**Criterios**
- Línea de tiempo consolidada.
- SLA por canal.
- Enrutamiento inteligente.
- KPI por canal, volumen, tiempos.

---

# Fin del Documento
