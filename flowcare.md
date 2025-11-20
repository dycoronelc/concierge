# 📄 Documento de Historias de Usuario — Plataforma Concierge MINSEG (FlowCare)
*(Versión Markdown)*

## 1. Introducción
Este documento detalla el conjunto de Historias de Usuario (HU) agrupadas en Épicas, que definen la funcionalidad a desarrollar para la Plataforma Concierge MINSEG. Sirve como fuente primaria de requerimientos para el equipo de desarrollo.

**Alcance:** Sistema de tickets de atención a la salud vía canales digitales (WhatsApp, Telefonía).  
**Objetivo Principal:** Centralizar, clasificar y gestionar las solicitudes de los asegurados, optimizando la asignación de prestadores y el cumplimiento de SLAs.

---

## 2. Estructura de Prioridad y Nomenclatura

| Tipo | Prefijo | Descripción |
|------|---------|-------------|
| Épica | EPIC-X | Conjunto de Historias de Usuario relacionadas a un objetivo grande. |
| Historia de Usuario | HU-X.Y | Requerimiento escrito como: *Como [rol], quiero [meta], para [beneficio].* |

---

## 3. Épicas y Historias de Usuario Detalladas

---

# 🟦 EPIC 1 · Captura y Creación de Tickets
Define cómo las solicitudes entrantes desde WhatsApp y llamadas telefónicas se convierten en tickets gestionables.

### Historias

| ID | Título | Rol |
|-----|--------|------|
| HU-1.1 | Crear ticket desde mensaje de WhatsApp | Agente de concierge |
| HU-1.2 | Actualizar ticket existente desde WhatsApp | Agente de concierge |
| HU-1.3 | Crear ticket desde llamada telefónica | Agente de concierge |
| HU-1.4 | Edición manual de datos del ticket | Agente de concierge |
| HU-1.5 | Unificar tickets duplicados | Supervisor de concierge |

---

### 📌 Detalle de la Épica 1

#### HU-1.1 — Crear ticket desde WhatsApp
**Criterios de aceptación**
- Al recibir un mensaje desde 2chat.co sin ticket asociado, se crea un ticket nuevo.
- Se registra canal = WhatsApp.
- Se guarda `fecha_hora_creacion_ticket`.
- El mensaje original se guarda como primera interacción.
- Estado inicial del ticket: **Creado**.
- Si el número no corresponde a un paciente existente → marcar como `Paciente_sin_perfil`.

#### HU-1.2 — Actualizar ticket existente desde WhatsApp
**Criterios de aceptación**
- Si hay ticket abierto vinculado al número → se adjunta la interacción.
- Si hay solo tickets cerrados → se aplica lógica configurable (por defecto: crear nuevo ticket).
- Cada mensaje se guarda en la tabla `Interacciones_Canal`.

#### HU-1.3 — Crear ticket desde llamada telefónica
**Criterios de aceptación**
- Toda llamada entrante desde 2chat.co genera evento.
- Si no hay ticket abierto asociado → crear uno.
- Canal = Telefónico.
- Registrar duración y timestamp.
- La llamada se registra como interacción tipo *Llamada*.
- Se debe poder vincular posteriormente con un paciente.

#### HU-1.4 — Edición manual de ticket
**Criterios de aceptación**
- El agente puede editar datos del paciente, descripción, observaciones.
- No puede editar timestamps automáticos.
- Todos los cambios quedan auditados.

#### HU-1.5 — Unificar tickets duplicados
**Criterios de aceptación**
- Función “Fusionar tickets”.
- Seleccionar ticket principal.
- Interacciones de secundarios → migran al principal.
- Tickets secundarios quedan marcados como `Fusionados`.
- No se pierde histórico.

---

# 🟦 EPIC 2 · Clasificación Automática de Solicitudes

### Historias

| ID | Título | Rol |
|-----|--------|------|
| HU-2.1 | Clasificar solicitud en categoría clínica | Sistema |
| HU-2.2 | Reglas de validación por baja confianza | Agente |
| HU-2.3 | Corrección manual de categoría | Supervisor médico / Agente autorizado |

---

### 📌 Detalle de la Épica 2

#### HU-2.1 — Clasificación automática
**Criterios de aceptación**
- Categorías: Ambulatoria, Urgencia, Hospitalaria, Quirúrgica.
- Motor recibe descripción, canal y datos del paciente.
- El sistema guarda:
  - `categoria_solicitud`
  - `nivel_confianza`
  - `requiere_validacion_manual`
  - `justificacion_clasificacion`

#### HU-2.2 — Validación manual
**Criterios de aceptación**
- Umbral configurable (ej. < 0.7).
- Si confianza < umbral → va a cola de validación.
- El agente puede confirmar o cambiar categoría.

#### HU-2.3 — Corrección manual
**Criterios de aceptación**
- Solo perfiles autorizados.
- Debe mostrarse histórico de cambios.

---

# 🟦 EPIC 3 · Asignación de Prestador según Ubicación

### Historias

| ID | Título | Rol |
|-----|--------|------|
| HU-3.0 | Crear/actualizar perfil del paciente | Agente |
| HU-3.1 | Registrar ubicación del paciente | Agente |
| HU-3.2 | Asignación automática | Sistema |
| HU-3.3 | Reasignación manual | Agente o supervisor |
| HU-4.1 | Listado de prestadores | Agente |
| HU-4.2 | Asignación manual obligatoria (MVP) | Agente |
| HU-4.3 | Asignación automática (Fase 2) | Sistema |

---

### 📌 Detalle de la Épica 3

#### HU-3.0 — Crear/actualizar paciente
- Campos obligatorios: cédula, póliza, teléfono.
- No duplicidad de cédula o pólizas.
- Guardar histórico de cambios.

#### HU-3.1 — Registrar ubicación
- Puede ser textual o geocódigo (lat/lng).
- Es necesaria para la asignación.

#### HU-3.2 — Asignación automática
- Entradas: ubicación, categoría, catálogo.
- Salidas:
  - `prestador_asignado_id`
  - `prestadores_alternativos_ids`
  - `justificacion_asignacion`
- Solo prestadores que cubren ubicación y categoría.

#### HU-3.3 — Reasignación manual
- El agente puede elegir otro prestador.
- Se registra motivo.

#### HU-4.1 / 4.2 / 4.3 — Prestadores
- Mostrar listas separadas: aliados y red.
- Si se elige prestador no aliado → justificar.
- En Fase 2: sugerencias automáticas.

---

# 🟦 EPIC 4 · Ciclo de Vida del Ticket y SLA

### Historias

| ID | Título | Rol |
|-----|--------|------|
| HU-4.1 | Definir estados del ticket | Product Owner |
| HU-4.2 | Captura de timestamps | BI |
| HU-4.3 | Visualización de timeline | Agente |

---

### 📌 Detalle de la Épica 4

#### HU-4.1 — Estados
- Estados mínimos:
  - Creado
  - En_gestion
  - Asignado_a_prestador
  - En_atencion
  - Cerrado
- Cambios generan evento con usuario, hora y estado.

#### HU-4.2 — Timestamps
- Campos:
  - Creación
  - Primera respuesta
  - Asignación
  - Cierre
- BI debe poder calcular tiempos.

#### HU-4.3 — Timeline
- Visualiza eventos clave con fecha, hora y usuario.

---

# 🟦 EPIC 9 · Gestión Clínica por EVENTOS y ENCUENTROS (ICD + FlowCare)

*(Nuevo agregado)*

## HU-9.1 — Crear un EVENTO
**Criterios**
- Se crea cuando entra nueva solicitud o se identifica diagnóstico.
- Debe contener:
  - evento_id
  - ICD-10
  - Severidad
  - Categoría
  - Fechas
  - Estado (Activo/Seguimiento/Cerrado)
- No mezclar diagnósticos: si cambia → evento nuevo.

---

## HU-9.2 — Pre-cargar catálogo ICD-10
**Criterios**
- Cargar catálogo completo.
- Buscador inteligente.
- Autocompletado.
- Solo personal autorizado puede modificar.

---

## HU-9.3 — Validación clínica del diagnóstico
- Selección basada en motivo, síntomas y antecedentes.
- Puede marcarse como Diagnóstico Preliminar.
- Supervisor puede confirmar o ajustar.

---

## HU-9.4 — Crear ENCUENTROS
**Cada ENCUENTRO incluye:**
- encuentro_id
- evento_id
- tipo de encuentro
- fechas
- prestador
- estado
- notas/resultados

**Reglas**
- Un evento puede tener múltiples encuentros.
- No puede existir encuentro sin evento.

---

## HU-9.5 — Flujo operativo EVENTO → ENCUENTROS
1. Paciente inicia contacto → ticket.  
2. Concierge recopila información.  
3. Personal selecciona diagnóstico → se crea EVENTO.  
4. Concierge crea ENCUENTROS.  
5. Cada encuentro se asigna a prestador.  
6. Evento se cierra cuando todos los encuentros finalizan.

---

## HU-9.6 — Visualización de HISTORIAL clínico
- Mostrar diagnóstico, lista de encuentros, prestadores, tiempos, resultados.
- Permite filtrar y descargar.

---

## HU-9.7 — Cerrar EVENTO
- Solo si todos los encuentros están cerrados.
- Registrar usuario, motivo y fecha.

---

## HU-9.8 — Reglas críticas EVENTO ↔ Ticket ↔ Encuentro
- Un ticket pertenece a un único evento.
- Un evento puede contener múltiples tickets si están relacionados al mismo diagnóstico.
- Un evento puede contener múltiples encuentros.
- Diagnóstico distinto → evento nuevo.

---

# 🧠 Impacto en Modelo de Datos y Arquitectura

## Nueva entidad EVENTO
```
evento_id
paciente_id
diagnostico_icd_id
severidad
estado_evento
fecha_inicio
fecha_cierre
creado_por
validado_por
notas_clinicas
```

## Nueva entidad ENCUENTRO
```
encuentro_id
evento_id (FK)
ticket_id (FK opcional)
prestador_id
tipo_encuentro
estado
fecha_programada
fecha_real
resultado / notas
```

## Catálogo ICD-10

---

# 4. Estructura de Datos y Glosario

| Término | Descripción |
|----------|-------------|
| 2chat.co | Plataforma de integración de canales |
| ticket_id | Identificador único |
| Interacciones_Canal | Tabla de mensajes, llamadas y eventos |
| Prestador aliado | Prestador prioritario |
| Prestador de red | Prestador general |
| SLA | Tiempos de servicio |
