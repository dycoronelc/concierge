# Documento de Historias de,Usoario - Plataforma Concierge MINSEG (FlowCare)

# 1. Introduccion

Este documento detalla elconjunto de Historias de Opcode (HU) agrupadas en Épicas, que define la funcionalidad a desarrollar para la Plataforma Concierge MINSEG. Sirve como fuente primaria de requisimientos para el equipo de desarrollo.

- Alcance: Sistema de tickets de atencion a la salute vía canales digitales (WhatsApp, Telefonía).  
- Objetivo Principal: Centralizar, clasificar y gestionar las solicitudes de los asegurados, optimizar la asignación de prestadores y el cumplimiento de SLAs.

# 2. Estructura de Prioridad y Nomenclatura

<table><tr><td>Tipo</td><td>Prefijo</td><td>Descripción</td></tr><tr><td>Épica</td><td>EPIC-X</td><td>Conjunto de Historias de 用户 relacionadas a un objetivo grande.</td></tr><tr><td>Historia de��</td><td>HU-X.Y</td><td>Requerimiento spécifique escrito en formatting: Como [Roll], Quiero [Meta], Para [Beneficio].</td></tr></table>

# 3. Épicas y Historias de Nombre Detalladas

# EPIC 1 · Captura y Creación de Tickets

Define como las solicitudes entrantes desde WhatsApp y llamadas Telefonicas se converten en tickets gestionables.

<table><tr><td>ID</td><td>Túlio de la HU</td><td>Rol</td></tr><tr><td>HU-1.1</td><td>Crear ticket desde mensaje de WhatsApp</td><td>Agente de concierge</td></tr><tr><td>HU-1.2</td><td>Actualizar ticket existente desde WhatsApp</td><td>Agente de concierge</td></tr><tr><td>HU-1.3</td><td>Crear ticket desde llamada Telefonica</td><td>Agente de concierge</td></tr><tr><td>HU-1.4</td><td>Edición manual de datos del ticket</td><td>Agente de concierge</td></tr><tr><td>HU-1.5</td><td>Unificar tickets duplicates</td><td>Supervisor de concierge</td></tr></table>

Detalle de la Epica 1  

<table><tr><td>ID</td><td>Criterios de Aceptación (CA)</td></tr><tr><td>HU-1.1</td><td>* Al recibir un mensaje de WhatsApp desde 2chat.co sin ticket asociado, se create un ticket con un ticket_id únicos. * Se registra el canal = WhatsApp. * Se guarda Fecha hora 创建ación Ticket (timestamp). * El mensaje original se guarda como primera interacción. * El ticket queda en estado inicial Creado. * Si el número no se vincula a un paciente existente, el ticket semarca como Paciente_sin_perfil.</td></tr><tr><td>HU-1.2</td><td>* Si el sistemas encontrar un ticket abierto asociado al número/conversación, no create nuevo, sino que-agrega la interacción al existente. * Si solo hay tickets cerrados recentes con ese número, el sistemas aplicála lógica configurable (por defecto, create un nuevo ticket). * Cada mensaje se registra en la tabla Interaccións_Canal con referencia al ticket_id.</td></tr><tr><td>HU-1.3</td><td>* Toda llamada entrada desde 2chat.co genera un evento. * Si no hay ticket abierto asociado, se create uno. * El canal se registra como Telefonico. * Se guarda Fecha hora 创建ación Ticket y duración_Llamada. * La llamada se registra como interacción tipo Llamada. * Debe ser posible vincular la llamada a un paciente posteriormente.</td></tr><tr><td>HU-1.4</td><td>* El agente pueda editar: Datos del paciente (si faltan), Descripción, Observaciones internas. * No se permitte ediciones de timestamps automatéticos. * Todos losCambios queden registrados en un log de auditoría (quien y cuando).</td></tr><tr><td>HU-1.5</td><td>* Debe existir una función &quot;Fusionar tickets&quot;. * Al fusionar, se seleccióna un ticket principal y lasinteractionsde los secundarios se associan a este. * Los tickets</td></tr></table>

secundarios quean marcados como Fusionados y no son gestionables. * No se pierden datos historicos.

# EPIC 2  $\cdot$  Clasificacion Automática de Solicitudes

Cubre la functionalities de clasificacion inicial de la solicitud y los mecanismos de validacion manual.

<table><tr><td>ID</td><td>TÍTULO de la HU</td><td>Rol</td></tr><tr><td>HU-2.1</td><td>Clasificar solicitudes en una categoría clínica</td><td>Sistema de tickets</td></tr><tr><td>HU-2.2</td><td>Reglas de validación manual por bajo confianza</td><td>Agente de concierge</td></tr><tr><td>HU-2.3</td><td>Corrección manual de categoría</td><td>Supervisor Médico o agente autorizzato</td></tr></table>

Detalle de la Epica 2  

<table><tr><td>ID</td><td>Criterios de Aceptación (CA)</td></tr><tr><td>HU-2.1</td><td>* Categorías permitidas: Ambulatoria, Urgencia, Hospitalaria, Quirurgica. * El motor recibe: descripción_solicitud, canal, datos_paciente. * Laittersa se guarda en el ticket: categoria_solicitud,;nivel_confianzaclasificacion,requiree_validation_manual,justificacionclasificacion(JSON).</td></tr><tr><td>HU-2.2</td><td>* Umbral de confianza configurable (ej. $&lt; 0.7$). * Si;nivel_confianza &lt; umbral → require_validation_manual = &quot;sí&quot;. * Los tickets para validacionmanual se muestran en una cola española. * El agente pueda Confirmar o Cambiar la CATEGORY, registrardo el 用户 y la Fecha/hora.</td></tr><tr><td>HU-2.3</td><td>* Solo perfiles autorizados peuvent携带la CATEGORY. * Debe mostrarse el historieral dechangios con: Categoría anterior/nueva, Usuario, Motivo, Fecha/hora.</td></tr></table>

# EPIC 3 · Asignación de Prestador según Ubicación

Define la gestion de perfiles de paciente y la lógica para la asignación del prestador.

<table><tr><td>ID</td><td>TÍTULO de la HU</td><td>Rol</td></tr><tr><td>HU-3.0</td><td>Crear yactualizar/perfil del paciente</td><td>Agente del concierge</td></tr><tr><td>HU-3.1</td><td>Registrar urbicación del paciente</td><td>Agente del concierge</td></tr><tr><td>HU-3.2</td><td>Asignación automática de prestador</td><td>Sistema de tickets</td></tr><tr><td>HU-3.3</td><td>Reassignación manual de prestador</td><td>Agente de concierge o supervisor</td></tr><tr><td>HU-4.1</td><td>Mostrar lista de prestadores aliados y de red</td><td>Agente</td></tr><tr><td>HU-4.2</td><td>Asignaciónmanual obligatoria(MVP)</td><td>Agente</td></tr><tr><td>HU-4.3</td><td>Asignación automática(Fase 2)</td><td>Sistema</td></tr></table>

Detalle de la Epica 3  

<table><tr><td>ID</td><td>Criterios de Aceptación (CA)</td></tr><tr><td>HU-3.0</td><td>* Campos obligatorios:CEDula, numero_poliza o id_seguro,telefon 1.*No pueda haber 2 pacientes con la mesma cédula o misma póliza+identificador.*El sistemas debe permitiractualizar datos yguardar un historico.</td></tr><tr><td>HU-3.1</td><td>* Laubicacionuede ser:Direccióntextual,Ciudad/provincia,Coordenadas(lat/lng). * Se guarda en el perfil del paciente y/o en el ticket. * El systemavalidaunaubicaciónminimaobligatoria para correrelmotor deasignación.</td></tr><tr><td>HU-3.2</td><td>* Entradas:ubicacion_paciente,categoria,catalogoprestadores. * Salida (JSON):prestador asignado_id,prestadores_alternativos_ids,justificacion asignacion. *Solo selección prestadores que cubrenubicación ycatsióna. * El ticket seactualiza con los IDs y eltimestamp deasignación.</td></tr><tr><td>HU-3.3</td><td>* Elagentepuede selecciónarotoprestadorde la lista sugerida o del catálogo. *Al reassignar,seguarda un registrar con motivo,seactualiza elprestador asignado_idy se conservaelhistorial.</td></tr><tr><td>HU-4.1</td><td>*Muesstra doslistas separadas:Prestadoresaliados(prioritarios)yPrestadoresdela red. *Muestra:Nombre,Categorías,Cobertura,Disponibiliad.*Si selecciónaprestadorde la red,se requiere justificaciónobligatoria.</td></tr><tr><td>HU-4.2</td><td>*La asignaciónNOesautomáticaenMVP. *Flujo:SeLECTIONarcatsióna→Capturarubicación→Ver lista dealiados/red→Selectionarprestador. *Sisélege prestador NOaliado,se registraelmotivo_selectacion.</td></tr><tr><td>HU-4.3</td><td>*Orderedeparidadparasugerencia:Aliadosque cubren→Aliadosalternativos→Prestadoresde la red. *Elresultadoesuna sugerencia;elagentesiempreconfirma ladecision.</td></tr></table>

# EPIC 4 · Ciclo de Vida del Ticket y SLA de Tiempos

Define los estados, la captura de tiempos y la visualización de la trazabilidad.

<table><tr><td>ID</td><td>TÍntulo de la HU</td><td>Rol</td></tr><tr><td>HU-4.1</td><td>Definir y aplicar Estados del ticket</td><td>Product Owner</td></tr><tr><td>HU-4.2</td><td>Captura de timestamps clave</td><td>Analista de BI</td></tr><tr><td>HU-4.3</td><td>Visualización de linea de tiempo del ticket</td><td>Agente de concierge</td></tr></table>

Detalle de la Epica 4  

<table><tr><td>ID</td><td>Criterios de Aceptación (CA)</td></tr><tr><td>HU-4.1</td><td>* Estados míimos: Creado, En_gestion, Asignado_a_prestador, En_atencion, Cerrado. * Cada cambio de estado registra un evento con: Estado anterior/nueva, Nombre/sistema, Fecha/hora. * El estado actual es siempre visible.</td></tr><tr><td>HU-4.2</td><td>* Campos de timestamps míimos: Fecha_hora 创建ticket, Fecha_hora_primera_respecta, Fecha_hora asignacion_prestador, Fecha_hora_cierre Ticket. * El sistema guarda el tiempo stamp en el camino correspondiente si está=vacio. * Tiempos de gestion calculables a nivel de BI (ej. tiempo de Creación a Cierre).</td></tr><tr><td>HU-4.3</td><td>* Vista del ticket muestra una linea de tiempo con hitos clave (Creación, Primera respecta, Asignación, Cierre). * Cada hito indica: Fecha, Hora y Nombre/sistema que lo realizó.</td></tr></table>

(Incluir el detalle de las Épicas 5, 6, 7 y 8ships el mismofonto de tabla para Detalle de Epica para cada una, como se要注意 en las primeras Epicas.)

# 4. Estructura de datos y Glosario

<table><tr><td>Término</td><td>Descripción</td></tr><tr><td>2chat.co</td><td>Plataforma de integración de canales (WhatsApp/Telefonía).</td></tr><tr><td>Ticket_id</td><td>Identificador únicos de la solicitud.</td></tr><tr><td>Interaccións_Canal</td><td>Tabla que registra todos los mensajes, llamadas y eventos asociados al ticket.</td></tr><tr><td>Prestador Aliado</td><td>Prestador con acuerdo comercial preferencial (prioritario).</td></tr><tr><td>Prestador de la Red</td><td>Prestador con acuerdo general con la aseguradora.</td></tr><tr><td>SLA</td><td>Service Level Agreement (Tiempo de respecta y gestion objetivo).</td></tr></table>
