-- Concierge Database Schema
-- PostgreSQL 15+

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Tabla de Usuarios
CREATE TABLE IF NOT EXISTS users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100),
    role VARCHAR(50) DEFAULT 'Agente' CHECK (role IN ('Agente', 'Supervisor', 'Supervisor_Medico', 'Admin')),
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Pacientes
CREATE TABLE IF NOT EXISTS patients (
    patient_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cedula VARCHAR(20) UNIQUE NOT NULL,
    numero_poliza VARCHAR(50),
    id_seguro VARCHAR(50),
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100),
    telefono_1 VARCHAR(20) NOT NULL,
    telefono_2 VARCHAR(20),
    email VARCHAR(255),
    direccion_textual TEXT,
    ciudad VARCHAR(100),
    provincia VARCHAR(100),
    latitud DECIMAL(10, 8),
    longitud DECIMAL(11, 8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_poliza_seguro UNIQUE (numero_poliza, id_seguro)
);

-- Tabla de Prestadores
CREATE TABLE IF NOT EXISTS providers (
    provider_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(200) NOT NULL,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('Aliado', 'Red')),
    categorias TEXT[] DEFAULT '{}',
    ciudades TEXT[] DEFAULT '{}',
    provincias TEXT[] DEFAULT '{}',
    latitud DECIMAL(10, 8),
    longitud DECIMAL(11, 8),
    radio_cobertura_km DECIMAL(10, 2),
    disponible BOOLEAN DEFAULT TRUE,
    carga_trabajo_actual INTEGER DEFAULT 0,
    telefono VARCHAR(20),
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Catálogo ICD-10
CREATE TABLE IF NOT EXISTS icd10 (
    icd10_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo VARCHAR(20) UNIQUE NOT NULL,
    descripcion TEXT NOT NULL,
    descripcion_completa TEXT,
    categoria VARCHAR(50),
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Eventos Clínicos
CREATE TABLE IF NOT EXISTS eventos (
    evento_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(patient_id),
    diagnostico_icd_id UUID REFERENCES icd10(icd10_id),
    severidad VARCHAR(20) CHECK (severidad IN ('Leve', 'Moderada', 'Grave', 'Critica')),
    categoria VARCHAR(20),
    estado_evento VARCHAR(30) DEFAULT 'Activo' CHECK (estado_evento IN ('Activo', 'Seguimiento', 'Cerrado')),
    fecha_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_cierre TIMESTAMP,
    creado_por VARCHAR(100),
    validado_por VARCHAR(100),
    fecha_validacion TIMESTAMP,
    diagnostico_preliminar BOOLEAN DEFAULT FALSE,
    notas_clinicas TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Migración: Agregar columna evento_id a tickets si ya existe la tabla (para bases de datos existentes)
-- Esto debe ejecutarse después de crear la tabla eventos pero antes de crear encuentros
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'tickets') THEN
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'tickets' AND column_name = 'evento_id'
        ) THEN
            ALTER TABLE tickets ADD COLUMN evento_id UUID REFERENCES eventos(evento_id);
        END IF;
    END IF;
END $$;

-- Tabla de Tickets (debe crearse antes de encuentros porque encuentros referencia tickets)
CREATE TABLE IF NOT EXISTS tickets (
    ticket_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_number VARCHAR(50) UNIQUE NOT NULL,
    patient_id UUID REFERENCES patients(patient_id),
    evento_id UUID REFERENCES eventos(evento_id),
    channel VARCHAR(20) NOT NULL CHECK (channel IN ('WhatsApp', 'Telefonico', 'Web')),
    description TEXT,
    observations TEXT,
    categoria_solicitud VARCHAR(20) CHECK (categoria_solicitud IN ('Ambulatoria', 'Urgencia', 'Hospitalaria', 'Quirurgica')),
    nivel_confianza_clasificacion DECIMAL(3, 2),
    requiere_validacion_manual BOOLEAN DEFAULT FALSE,
    justificacion_clasificacion JSONB,
    prestador_asignado_id UUID REFERENCES providers(provider_id),
    prestadores_alternativos_ids UUID[],
    justificacion_asignacion TEXT,
    status VARCHAR(30) DEFAULT 'Creado' CHECK (status IN ('Creado', 'En_gestion', 'Asignado_a_prestador', 'En_atencion', 'Cerrado', 'Fusionado')),
    paciente_sin_perfil BOOLEAN DEFAULT FALSE,
    fecha_hora_creacion_ticket TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_hora_primera_respuesta TIMESTAMP,
    fecha_hora_asignacion_prestador TIMESTAMP,
    fecha_hora_cierre_ticket TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Encuentros (debe crearse después de tickets porque referencia tickets)
CREATE TABLE IF NOT EXISTS encuentros (
    encuentro_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    evento_id UUID NOT NULL REFERENCES eventos(evento_id) ON DELETE CASCADE,
    ticket_id UUID REFERENCES tickets(ticket_id),
    prestador_id UUID REFERENCES providers(provider_id),
    tipo_encuentro VARCHAR(30) NOT NULL CHECK (tipo_encuentro IN ('Consulta', 'Urgencia', 'Hospitalizacion', 'Cirugia', 'Examen', 'Seguimiento')),
    estado VARCHAR(30) DEFAULT 'Programado' CHECK (estado IN ('Programado', 'En_curso', 'Completado', 'Cancelado')),
    fecha_programada TIMESTAMP,
    fecha_real TIMESTAMP,
    resultado TEXT,
    notas TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Interacciones de Canal
CREATE TABLE IF NOT EXISTS channel_interactions (
    interaction_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID NOT NULL REFERENCES tickets(ticket_id) ON DELETE CASCADE,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('Mensaje', 'Llamada', 'Evento')),
    contenido TEXT NOT NULL,
    numero_origen VARCHAR(50),
    numero_destino VARCHAR(50),
    duracion_llamada_segundos INTEGER,
    metadata JSONB,
    fecha_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Historial de Estados
CREATE TABLE IF NOT EXISTS ticket_status_history (
    history_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID NOT NULL REFERENCES tickets(ticket_id) ON DELETE CASCADE,
    estado_anterior VARCHAR(30) NOT NULL,
    estado_nuevo VARCHAR(30) NOT NULL,
    usuario VARCHAR(100),
    nombre_sistema VARCHAR(50) DEFAULT 'Sistema',
    motivo TEXT,
    fecha_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_channel ON tickets(channel);
CREATE INDEX IF NOT EXISTS idx_tickets_patient_id ON tickets(patient_id);
CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON tickets(fecha_hora_creacion_ticket);
CREATE INDEX IF NOT EXISTS idx_interactions_ticket_id ON channel_interactions(ticket_id);
CREATE INDEX IF NOT EXISTS idx_status_history_ticket_id ON ticket_status_history(ticket_id);
CREATE INDEX IF NOT EXISTS idx_patients_cedula ON patients(cedula);
CREATE INDEX IF NOT EXISTS idx_providers_tipo ON providers(tipo);
CREATE INDEX IF NOT EXISTS idx_providers_disponible ON providers(disponible);
CREATE INDEX IF NOT EXISTS idx_icd10_codigo ON icd10(codigo);
CREATE INDEX IF NOT EXISTS idx_eventos_patient_id ON eventos(patient_id);
CREATE INDEX IF NOT EXISTS idx_eventos_estado ON eventos(estado_evento);
CREATE INDEX IF NOT EXISTS idx_encuentros_evento_id ON encuentros(evento_id);
CREATE INDEX IF NOT EXISTS idx_tickets_evento_id ON tickets(evento_id);

-- Índice geoespacial para búsquedas por ubicación (requiere PostGIS)
-- CREATE INDEX IF NOT EXISTS idx_patients_location ON patients USING GIST(ST_MakePoint(longitud, latitud));
-- CREATE INDEX IF NOT EXISTS idx_providers_location ON providers USING GIST(ST_MakePoint(longitud, latitud));

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at (con verificación para evitar errores si ya existen)
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_patients_updated_at ON patients;
CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_providers_updated_at ON providers;
CREATE TRIGGER update_providers_updated_at BEFORE UPDATE ON providers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_tickets_updated_at ON tickets;
CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON tickets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_icd10_updated_at ON icd10;
CREATE TRIGGER update_icd10_updated_at BEFORE UPDATE ON icd10
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_eventos_updated_at ON eventos;
CREATE TRIGGER update_eventos_updated_at BEFORE UPDATE ON eventos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_encuentros_updated_at ON encuentros;
CREATE TRIGGER update_encuentros_updated_at BEFORE UPDATE ON encuentros
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- EPIC 10: Servicios de Enfermería
-- ============================================

CREATE TABLE IF NOT EXISTS servicios_enfermeria (
    servicio_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(patient_id),
    ticket_id UUID REFERENCES tickets(ticket_id),
    tipo_cuidado VARCHAR(50) DEFAULT 'Otro' CHECK (tipo_cuidado IN ('Heridas', 'Inyecciones', 'Educación', 'Monitoreo', 'Otro')),
    descripcion TEXT,
    estado VARCHAR(50) DEFAULT 'Solicitado' CHECK (estado IN ('Solicitado', 'Asignado', 'En_Camino', 'En_Proceso', 'Completado', 'Cancelado')),
    enfermero_asignado_id UUID REFERENCES users(user_id),
    fecha_programada TIMESTAMP,
    fecha_realizada TIMESTAMP,
    notas_visita TEXT,
    creado_por_id UUID NOT NULL REFERENCES users(user_id),
    requiere_seguimiento BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS administracion_medicamentos (
    administracion_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(patient_id),
    servicio_enfermeria_id UUID REFERENCES servicios_enfermeria(servicio_id),
    nombre_medicamento VARCHAR(200) NOT NULL,
    dosis VARCHAR(50),
    via_administracion VARCHAR(50),
    fecha_hora_administracion TIMESTAMP NOT NULL,
    responsable_id UUID NOT NULL REFERENCES users(user_id),
    prescripcion_validada BOOLEAN DEFAULT FALSE,
    notas_clinicas TEXT,
    reacciones_adversas TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- EPIC 11: Transporte y Logística
-- ============================================

CREATE TABLE IF NOT EXISTS vehiculos (
    vehiculo_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    placa VARCHAR(20) UNIQUE NOT NULL,
    marca VARCHAR(100) NOT NULL,
    modelo VARCHAR(100) NOT NULL,
    año INTEGER,
    tipo VARCHAR(50) DEFAULT 'Sedan' CHECK (tipo IN ('Sedan', 'SUV', 'Ambulancia', 'UCI_Movil', 'Otro')),
    estado VARCHAR(50) DEFAULT 'Disponible' CHECK (estado IN ('Disponible', 'En_Uso', 'Mantenimiento', 'No_Disponible')),
    conductor_asignado VARCHAR(100),
    latitud_actual DECIMAL(10, 8),
    longitud_actual DECIMAL(11, 8),
    ultima_actualizacion_gps TIMESTAMP,
    notas TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS solicitudes_transporte (
    solicitud_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(patient_id),
    ticket_id UUID REFERENCES tickets(ticket_id),
    tipo_traslado VARCHAR(50) DEFAULT 'Ordinario' CHECK (tipo_traslado IN ('Ordinario', 'Asistido', 'Urgente', 'Ambulancia')),
    direccion_origen TEXT NOT NULL,
    latitud_origen DECIMAL(10, 8),
    longitud_origen DECIMAL(11, 8),
    direccion_destino TEXT NOT NULL,
    latitud_destino DECIMAL(10, 8),
    longitud_destino DECIMAL(11, 8),
    estado VARCHAR(50) DEFAULT 'Solicitado' CHECK (estado IN ('Solicitado', 'Asignado', 'En_Camino_Origen', 'En_Origen', 'En_Traslado', 'Completado', 'Cancelado')),
    vehiculo_asignado_id UUID,
    conductor_asignado_id UUID REFERENCES users(user_id),
    fecha_programada TIMESTAMP,
    fecha_inicio TIMESTAMP,
    fecha_llegada_origen TIMESTAMP,
    fecha_llegada_destino TIMESTAMP,
    duracion_minutos INTEGER,
    observaciones TEXT,
    creado_por_id UUID NOT NULL REFERENCES users(user_id),
    requiere_gps BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- EPIC 14: Diagnóstico Avanzado y Estudios
-- ============================================

CREATE TABLE IF NOT EXISTS solicitudes_estudios (
    solicitud_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(patient_id),
    evento_id UUID REFERENCES eventos(evento_id),
    ticket_id UUID REFERENCES tickets(ticket_id),
    tipo_estudio VARCHAR(50) NOT NULL CHECK (tipo_estudio IN ('Sangre', 'Orina', 'Heces', 'Imagen', 'Genético', 'Genómico', 'Otro')),
    nombre_estudio VARCHAR(200) NOT NULL,
    descripcion TEXT,
    estado VARCHAR(50) DEFAULT 'Solicitado' CHECK (estado IN ('Solicitado', 'Autorizado', 'Programado', 'En_Proceso', 'Completado', 'Cancelado')),
    toma_domicilio BOOLEAN DEFAULT FALSE,
    tecnico_asignado_id UUID REFERENCES users(user_id),
    fecha_programada TIMESTAMP,
    fecha_toma_muestra TIMESTAMP,
    cadena_custodia TEXT,
    requiere_consentimiento BOOLEAN DEFAULT FALSE,
    consentimiento_id UUID,
    solicitado_por_id UUID NOT NULL REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS resultados_estudios (
    resultado_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    solicitud_estudio_id UUID NOT NULL REFERENCES solicitudes_estudios(solicitud_id),
    evento_id UUID REFERENCES eventos(evento_id),
    resultado_texto TEXT,
    resultado_json TEXT,
    archivo_resultado_url VARCHAR(255),
    fecha_resultado TIMESTAMP,
    revisado_por_id UUID REFERENCES users(user_id),
    requiere_seguimiento BOOLEAN DEFAULT FALSE,
    notas_medicas TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Triggers para nuevas tablas
DROP TRIGGER IF EXISTS update_servicios_enfermeria_updated_at ON servicios_enfermeria;
CREATE TRIGGER update_servicios_enfermeria_updated_at BEFORE UPDATE ON servicios_enfermeria
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_administracion_medicamentos_updated_at ON administracion_medicamentos;
CREATE TRIGGER update_administracion_medicamentos_updated_at BEFORE UPDATE ON administracion_medicamentos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_vehiculos_updated_at ON vehiculos;
CREATE TRIGGER update_vehiculos_updated_at BEFORE UPDATE ON vehiculos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_solicitudes_transporte_updated_at ON solicitudes_transporte;
CREATE TRIGGER update_solicitudes_transporte_updated_at BEFORE UPDATE ON solicitudes_transporte
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_solicitudes_estudios_updated_at ON solicitudes_estudios;
CREATE TRIGGER update_solicitudes_estudios_updated_at BEFORE UPDATE ON solicitudes_estudios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_resultados_estudios_updated_at ON resultados_estudios;
CREATE TRIGGER update_resultados_estudios_updated_at BEFORE UPDATE ON resultados_estudios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- EPIC 12: Nutrición Personalizada y Planes Alimenticios
-- ============================================

CREATE TABLE IF NOT EXISTS evaluaciones_nutricionales (
    evaluacion_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(patient_id),
    evento_id UUID REFERENCES eventos(evento_id),
    ticket_id UUID REFERENCES tickets(ticket_id),
    nutriologo_asignado_id UUID REFERENCES users(user_id),
    fecha_evaluacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    peso_kg DECIMAL(5, 2),
    talla_cm DECIMAL(5, 2),
    imc DECIMAL(4, 2),
    circunferencia_cintura_cm DECIMAL(5, 2),
    porcentaje_grasa_corporal DECIMAL(4, 2),
    nivel_actividad_fisica VARCHAR(50) CHECK (nivel_actividad_fisica IN ('Sedentario', 'Ligero', 'Moderado', 'Intenso', 'Muy_Intenso')),
    alergias_alimentarias TEXT[],
    restricciones_dieteticas TEXT[],
    preferencias_alimentarias TEXT[],
    enfermedades_cronicas TEXT[],
    medicamentos_actuales TEXT[],
    objetivos_nutricionales TEXT,
    notas_evaluacion TEXT,
    reportes_previos_urls TEXT[],
    evaluado_por_id UUID NOT NULL REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS planes_nutricionales (
    plan_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    evaluacion_id UUID NOT NULL REFERENCES evaluaciones_nutricionales(evaluacion_id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(patient_id),
    nutriologo_asignado_id UUID NOT NULL REFERENCES users(user_id),
    nombre_plan VARCHAR(255) NOT NULL,
    descripcion TEXT,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    calorias_diarias INTEGER,
    proteinas_g DECIMAL(6, 2),
    carbohidratos_g DECIMAL(6, 2),
    grasas_g DECIMAL(6, 2),
    fibra_g DECIMAL(6, 2),
    plan_semanal JSONB,
    recomendaciones TEXT[],
    estado VARCHAR(50) DEFAULT 'Activo' CHECK (estado IN ('Activo', 'Pausado', 'Completado', 'Cancelado')),
    notificaciones_habilitadas BOOLEAN DEFAULT TRUE,
    frecuencia_recordatorios VARCHAR(50) DEFAULT 'Diario' CHECK (frecuencia_recordatorios IN ('Diario', 'Cada_2_dias', 'Semanal')),
    creado_por_id UUID NOT NULL REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS seguimiento_nutricional (
    seguimiento_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_id UUID NOT NULL REFERENCES planes_nutricionales(plan_id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(patient_id),
    fecha_seguimiento DATE NOT NULL DEFAULT CURRENT_DATE,
    peso_kg DECIMAL(5, 2),
    sintomas TEXT[],
    nivel_energia VARCHAR(50) CHECK (nivel_energia IN ('Muy_Bajo', 'Bajo', 'Normal', 'Alto', 'Muy_Alto')),
    adherencia_plan VARCHAR(50) CHECK (adherencia_plan IN ('Baja', 'Media', 'Alta', 'Completa')),
    observaciones TEXT,
    alerta_retroceso BOOLEAN DEFAULT FALSE,
    motivo_alerta TEXT,
    registrado_por_id UUID REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para optimización
CREATE INDEX IF NOT EXISTS idx_evaluaciones_patient ON evaluaciones_nutricionales(patient_id);
CREATE INDEX IF NOT EXISTS idx_evaluaciones_evento ON evaluaciones_nutricionales(evento_id);
CREATE INDEX IF NOT EXISTS idx_evaluaciones_fecha ON evaluaciones_nutricionales(fecha_evaluacion);

CREATE INDEX IF NOT EXISTS idx_planes_evaluacion ON planes_nutricionales(evaluacion_id);
CREATE INDEX IF NOT EXISTS idx_planes_patient ON planes_nutricionales(patient_id);
CREATE INDEX IF NOT EXISTS idx_planes_estado ON planes_nutricionales(estado);
CREATE INDEX IF NOT EXISTS idx_planes_fecha_inicio ON planes_nutricionales(fecha_inicio);

CREATE INDEX IF NOT EXISTS idx_seguimiento_plan ON seguimiento_nutricional(plan_id);
CREATE INDEX IF NOT EXISTS idx_seguimiento_patient ON seguimiento_nutricional(patient_id);
CREATE INDEX IF NOT EXISTS idx_seguimiento_fecha ON seguimiento_nutricional(fecha_seguimiento);
CREATE INDEX IF NOT EXISTS idx_seguimiento_alerta ON seguimiento_nutricional(alerta_retroceso);

-- Triggers para updated_at
DROP TRIGGER IF EXISTS update_evaluaciones_nutricionales_updated_at ON evaluaciones_nutricionales;
CREATE TRIGGER update_evaluaciones_nutricionales_updated_at BEFORE UPDATE ON evaluaciones_nutricionales
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_planes_nutricionales_updated_at ON planes_nutricionales;
CREATE TRIGGER update_planes_nutricionales_updated_at BEFORE UPDATE ON planes_nutricionales
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_seguimiento_nutricional_updated_at ON seguimiento_nutricional;
CREATE TRIGGER update_seguimiento_nutricional_updated_at BEFORE UPDATE ON seguimiento_nutricional
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- EPIC 13: Psicología, Psiquiatría y Apoyo Emocional
-- ============================================

CREATE TABLE IF NOT EXISTS consultas_psicologicas (
    consulta_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(patient_id),
    evento_id UUID REFERENCES eventos(evento_id),
    ticket_id UUID REFERENCES tickets(ticket_id),
    psicologo_id UUID REFERENCES users(user_id),
    tipo_consulta VARCHAR(50) NOT NULL CHECK (tipo_consulta IN ('Psicologica', 'Psiquiatrica')),
    modalidad VARCHAR(50) NOT NULL CHECK (modalidad IN ('Presencial', 'Telefonica', 'Videollamada')),
    fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_programada TIMESTAMP,
    disponibilidad_paciente TEXT, -- Horarios preferidos del paciente
    motivo_consulta TEXT,
    estado VARCHAR(50) DEFAULT 'Solicitada' CHECK (estado IN ('Solicitada', 'Confirmada', 'En_Proceso', 'Completada', 'Cancelada')),
    notas_previas TEXT,
    creado_por_id UUID NOT NULL REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sesiones_psicologicas (
    sesion_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    consulta_id UUID NOT NULL REFERENCES consultas_psicologicas(consulta_id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(patient_id),
    psicologo_id UUID NOT NULL REFERENCES users(user_id),
    fecha_sesion TIMESTAMP NOT NULL,
    duracion_minutos INTEGER DEFAULT 60,
    tipo_sesion VARCHAR(50) DEFAULT 'Individual' CHECK (tipo_sesion IN ('Individual', 'Grupal', 'Familiar')),
    participantes UUID[], -- IDs de usuarios/familiares participantes (para sesiones grupales)
    resumen_sesion TEXT,
    observaciones TEXT,
    plan_tratamiento TEXT,
    proxima_sesion_programada TIMESTAMP,
    estado VARCHAR(50) DEFAULT 'Programada' CHECK (estado IN ('Programada', 'En_Curso', 'Completada', 'Cancelada', 'No_Asistio')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS seguimiento_emocional (
    seguimiento_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(patient_id),
    sesion_id UUID REFERENCES sesiones_psicologicas(sesion_id),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado_animo VARCHAR(50) CHECK (estado_animo IN ('Muy_Positivo', 'Positivo', 'Neutro', 'Negativo', 'Muy_Negativo', 'Ansioso', 'Deprimido', 'Eufórico')),
    escala_ansiedad INTEGER CHECK (escala_ansiedad >= 0 AND escala_ansiedad <= 10), -- Escala 0-10
    escala_depresion INTEGER CHECK (escala_depresion >= 0 AND escala_depresion <= 10), -- Escala 0-10
    escala_estres INTEGER CHECK (escala_estres >= 0 AND escala_estres <= 10), -- Escala 0-10
    sintomas TEXT[], -- Array de síntomas reportados
    factores_estresantes TEXT,
    apoyo_social TEXT, -- Descripción del apoyo social disponible
    observaciones TEXT,
    alerta_critica BOOLEAN DEFAULT FALSE, -- Alerta automática para casos críticos
    motivo_alerta TEXT, -- Razón de la alerta crítica
    registrado_por_id UUID REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS familiares_cuidadores (
    familiar_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(patient_id) ON DELETE CASCADE,
    nombre VARCHAR(255) NOT NULL,
    apellido VARCHAR(255),
    relacion VARCHAR(100), -- Padre, Madre, Cónyuge, Hijo/a, Cuidador, etc.
    telefono VARCHAR(20),
    email VARCHAR(255),
    direccion TEXT,
    es_cuidador_principal BOOLEAN DEFAULT FALSE,
    puede_participar_sesiones BOOLEAN DEFAULT TRUE,
    notas TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para optimización
CREATE INDEX IF NOT EXISTS idx_consultas_psicologicas_patient ON consultas_psicologicas(patient_id);
CREATE INDEX IF NOT EXISTS idx_consultas_psicologicas_psicologo ON consultas_psicologicas(psicologo_id);
CREATE INDEX IF NOT EXISTS idx_consultas_psicologicas_estado ON consultas_psicologicas(estado);
CREATE INDEX IF NOT EXISTS idx_consultas_psicologicas_fecha ON consultas_psicologicas(fecha_programada);

CREATE INDEX IF NOT EXISTS idx_sesiones_psicologicas_consulta ON sesiones_psicologicas(consulta_id);
CREATE INDEX IF NOT EXISTS idx_sesiones_psicologicas_patient ON sesiones_psicologicas(patient_id);
CREATE INDEX IF NOT EXISTS idx_sesiones_psicologicas_fecha ON sesiones_psicologicas(fecha_sesion);

CREATE INDEX IF NOT EXISTS idx_seguimiento_emocional_patient ON seguimiento_emocional(patient_id);
CREATE INDEX IF NOT EXISTS idx_seguimiento_emocional_sesion ON seguimiento_emocional(sesion_id);
CREATE INDEX IF NOT EXISTS idx_seguimiento_emocional_alerta ON seguimiento_emocional(alerta_critica);
CREATE INDEX IF NOT EXISTS idx_seguimiento_emocional_fecha ON seguimiento_emocional(fecha_registro);

CREATE INDEX IF NOT EXISTS idx_familiares_cuidadores_patient ON familiares_cuidadores(patient_id);

-- Triggers para updated_at
DROP TRIGGER IF EXISTS update_consultas_psicologicas_updated_at ON consultas_psicologicas;
CREATE TRIGGER update_consultas_psicologicas_updated_at BEFORE UPDATE ON consultas_psicologicas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_sesiones_psicologicas_updated_at ON sesiones_psicologicas;
CREATE TRIGGER update_sesiones_psicologicas_updated_at BEFORE UPDATE ON sesiones_psicologicas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_seguimiento_emocional_updated_at ON seguimiento_emocional;
CREATE TRIGGER update_seguimiento_emocional_updated_at BEFORE UPDATE ON seguimiento_emocional
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_familiares_cuidadores_updated_at ON familiares_cuidadores;
CREATE TRIGGER update_familiares_cuidadores_updated_at BEFORE UPDATE ON familiares_cuidadores
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Datos de ejemplo (opcional para desarrollo)
-- Credenciales:
-- Usuario: admin / Password: admin123
-- Usuario: agente1 / Password: agente123
INSERT INTO users (username, email, password, nombre, role) VALUES
('admin', 'admin@concierge.com', '$2b$10$2NkXgpjh8Hv660v4GGPl..4IN8AUQxpFfDz7B10d.Mu2oS3xnBAq6', 'Administrador', 'Admin'),
('agente1', 'agente1@concierge.com', '$2b$10$wvv5up65.Kg3QD8F.nIjM.Hd9BxNFZOAV9kd/OQNwLLvSUeXU/oGS', 'Agente Uno', 'Agente')
ON CONFLICT (username) DO NOTHING;

