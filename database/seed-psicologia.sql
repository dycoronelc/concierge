-- ============================================
-- Datos de Prueba - EPIC 13: Psicología, Psiquiatría y Apoyo Emocional
-- Generado para colaboradores de la Policía de Panamá
-- ============================================

-- Obtener algunos pacientes y usuarios para las relaciones
DO $$
DECLARE
    patient_ids UUID[];
    user_ids UUID[];
    consulta_ids UUID[];
    sesion_ids UUID[];
    familiar_ids UUID[];
    i INTEGER;
BEGIN
    -- Obtener IDs de pacientes (primeros 20)
    SELECT ARRAY_AGG(patient_id) INTO patient_ids
    FROM patients
    LIMIT 20;

    -- Obtener IDs de usuarios (agentes y administradores)
    SELECT ARRAY_AGG(user_id) INTO user_ids
    FROM users
    WHERE role IN ('Agente', 'Admin', 'Medico')
    LIMIT 5;

    -- Si no hay usuarios suficientes, usar cualquier usuario
    IF array_length(user_ids, 1) IS NULL OR array_length(user_ids, 1) < 2 THEN
        SELECT ARRAY_AGG(user_id) INTO user_ids
        FROM users
        LIMIT 3;
    END IF;

    -- ============================================
    -- Consultas Psicológicas
    -- ============================================

    -- Crear 18 consultas psicológicas
    FOR i IN 1..18 LOOP
        DECLARE
            patient_id_val UUID;
            user_id_val UUID;
            consulta_id_val UUID;
            fecha_solicitud TIMESTAMP;
            fecha_programada TIMESTAMP;
        BEGIN
            -- Seleccionar paciente aleatorio
            patient_id_val := patient_ids[1 + floor(random() * least(array_length(patient_ids, 1), 20))::int];
            user_id_val := user_ids[1 + floor(random() * array_length(user_ids, 1))::int];
            
            fecha_solicitud := CURRENT_TIMESTAMP - INTERVAL '1 day' * (10 + floor(random() * 30)::int);
            fecha_programada := fecha_solicitud + INTERVAL '1 day' * (1 + floor(random() * 14)::int);

            -- Insertar consulta
            INSERT INTO consultas_psicologicas (
                consulta_id,
                patient_id,
                psicologo_id,
                tipo_consulta,
                modalidad,
                fecha_solicitud,
                fecha_programada,
                disponibilidad_paciente,
                motivo_consulta,
                estado,
                notas_previas,
                creado_por_id,
                created_at,
                updated_at
            ) VALUES (
                uuid_generate_v4(),
                patient_id_val,
                user_id_val,
                CASE floor(random() * 2)::int
                    WHEN 0 THEN 'Psicologica'
                    ELSE 'Psiquiatrica'
                END,
                CASE floor(random() * 3)::int
                    WHEN 0 THEN 'Presencial'
                    WHEN 1 THEN 'Telefonica'
                    ELSE 'Videollamada'
                END,
                fecha_solicitud,
                fecha_programada,
                CASE floor(random() * 3)::int
                    WHEN 0 THEN 'Lunes a Viernes, 8:00 AM - 5:00 PM'
                    WHEN 1 THEN 'Fines de semana, 9:00 AM - 2:00 PM'
                    ELSE 'Cualquier horario disponible'
                END,
                CASE floor(random() * 5)::int
                    WHEN 0 THEN 'Ansiedad relacionada con el trabajo'
                    WHEN 1 THEN 'Estrés postraumático'
                    WHEN 2 THEN 'Depresión y estado de ánimo bajo'
                    WHEN 3 THEN 'Problemas de adaptación'
                    ELSE 'Seguimiento psicológico continuo'
                END,
                CASE floor(random() * 5)::int
                    WHEN 0 THEN 'Solicitada'
                    WHEN 1 THEN 'Confirmada'
                    WHEN 2 THEN 'En_Proceso'
                    WHEN 3 THEN 'Completada'
                    ELSE 'Solicitada'
                END,
                'Consulta solicitada por el paciente. Requiere evaluación inicial.',
                user_id_val,
                fecha_solicitud,
                CURRENT_TIMESTAMP
            ) RETURNING consulta_id INTO consulta_id_val;

            -- Guardar ID para usar en sesiones
            consulta_ids := array_append(consulta_ids, consulta_id_val);
        END;
    END LOOP;

    -- ============================================
    -- Sesiones Psicológicas
    -- ============================================

    -- Crear 15 sesiones basadas en las consultas
    FOR i IN 1..15 LOOP
        DECLARE
            consulta_id_val UUID;
            patient_id_val UUID;
            user_id_val UUID;
            sesion_id_val UUID;
            fecha_sesion TIMESTAMP;
            tipo_sesion_val TEXT;
        BEGIN
            -- Seleccionar consulta aleatoria
            IF array_length(consulta_ids, 1) > 0 THEN
                consulta_id_val := consulta_ids[1 + floor(random() * array_length(consulta_ids, 1))::int];
            ELSE
                CONTINUE;
            END IF;

            -- Obtener patient_id de la consulta
            SELECT patient_id INTO patient_id_val
            FROM consultas_psicologicas
            WHERE consulta_id = consulta_id_val;

            user_id_val := user_ids[1 + floor(random() * array_length(user_ids, 1))::int];
            fecha_sesion := CURRENT_TIMESTAMP - INTERVAL '1 day' * floor(random() * 20)::int;
            tipo_sesion_val := CASE floor(random() * 3)::int
                WHEN 0 THEN 'Individual'
                WHEN 1 THEN 'Grupal'
                ELSE 'Familiar'
            END;

            -- Insertar sesión
            INSERT INTO sesiones_psicologicas (
                sesion_id,
                consulta_id,
                patient_id,
                psicologo_id,
                fecha_sesion,
                duracion_minutos,
                tipo_sesion,
                participantes,
                resumen_sesion,
                observaciones,
                plan_tratamiento,
                proxima_sesion_programada,
                estado,
                created_at,
                updated_at
            ) VALUES (
                uuid_generate_v4(),
                consulta_id_val,
                patient_id_val,
                user_id_val,
                fecha_sesion,
                45 + floor(random() * 30)::int, -- Entre 45 y 75 minutos
                tipo_sesion_val,
                CASE 
                    WHEN tipo_sesion_val = 'Individual' THEN ARRAY[]::UUID[]
                    WHEN tipo_sesion_val = 'Grupal' THEN ARRAY[user_ids[1 + floor(random() * array_length(user_ids, 1))::int]]::UUID[]
                    ELSE ARRAY[user_ids[1 + floor(random() * array_length(user_ids, 1))::int]]::UUID[]
                END,
                CASE floor(random() * 3)::int
                    WHEN 0 THEN 'Sesión enfocada en técnicas de relajación y manejo de ansiedad. Paciente mostró buena disposición.'
                    WHEN 1 THEN 'Se trabajó en identificación de factores estresantes y estrategias de afrontamiento.'
                    ELSE 'Sesión de seguimiento. Se observó mejoría en el estado de ánimo del paciente.'
                END,
                CASE floor(random() * 2)::int
                    WHEN 0 THEN 'Paciente colaborativo y participativo durante la sesión.'
                    ELSE 'Se recomienda continuar con el tratamiento.'
                END,
                CASE floor(random() * 2)::int
                    WHEN 0 THEN 'Continuar con sesiones semanales. Practicar ejercicios de respiración diarios.'
                    ELSE 'Incluir técnicas de mindfulness y seguimiento en 2 semanas.'
                END,
                fecha_sesion + INTERVAL '1 week' * (1 + floor(random() * 3)::int),
                CASE floor(random() * 4)::int
                    WHEN 0 THEN 'Programada'
                    WHEN 1 THEN 'Completada'
                    WHEN 2 THEN 'En_Curso'
                    ELSE 'Completada'
                END,
                fecha_sesion,
                CURRENT_TIMESTAMP
            ) RETURNING sesion_id INTO sesion_id_val;

            -- Guardar ID para usar en seguimientos
            sesion_ids := array_append(sesion_ids, sesion_id_val);
        END;
    END LOOP;

    -- ============================================
    -- Seguimiento Emocional
    -- ============================================

    -- Crear 25 seguimientos emocionales
    FOR i IN 1..25 LOOP
        DECLARE
            patient_id_val UUID;
            sesion_id_val UUID;
            user_id_val UUID;
            fecha_registro TIMESTAMP;
            escala_ansiedad_val INTEGER;
            escala_depresion_val INTEGER;
            escala_estres_val INTEGER;
            estado_animo_val TEXT;
            alerta_critica_val BOOLEAN;
            motivo_alerta_val TEXT;
        BEGIN
            -- Seleccionar paciente aleatorio
            patient_id_val := patient_ids[1 + floor(random() * least(array_length(patient_ids, 1), 20))::int];
            user_id_val := user_ids[1 + floor(random() * array_length(user_ids, 1))::int];
            fecha_registro := CURRENT_TIMESTAMP - INTERVAL '1 day' * floor(random() * 15)::int;

            -- Seleccionar sesión aleatoria (opcional)
            IF array_length(sesion_ids, 1) > 0 AND random() < 0.6 THEN
                sesion_id_val := sesion_ids[1 + floor(random() * array_length(sesion_ids, 1))::int];
            ELSE
                sesion_id_val := NULL;
            END IF;

            -- Generar escalas (0-10)
            escala_ansiedad_val := floor(random() * 11)::int;
            escala_depresion_val := floor(random() * 11)::int;
            escala_estres_val := floor(random() * 11)::int;

            -- Determinar estado de ánimo basado en escalas
            IF escala_depresion_val >= 8 OR escala_ansiedad_val >= 8 THEN
                estado_animo_val := CASE floor(random() * 2)::int
                    WHEN 0 THEN 'Deprimido'
                    ELSE 'Ansioso'
                END;
            ELSIF escala_depresion_val >= 6 OR escala_ansiedad_val >= 6 THEN
                estado_animo_val := 'Negativo';
            ELSIF escala_depresion_val <= 2 AND escala_ansiedad_val <= 2 THEN
                estado_animo_val := CASE floor(random() * 2)::int
                    WHEN 0 THEN 'Positivo'
                    ELSE 'Muy_Positivo'
                END;
            ELSE
                estado_animo_val := CASE floor(random() * 3)::int
                    WHEN 0 THEN 'Neutro'
                    WHEN 1 THEN 'Positivo'
                    ELSE 'Negativo'
                END;
            END IF;

            -- Determinar si hay alerta crítica (20% de probabilidad o si escalas >= 8)
            alerta_critica_val := (escala_ansiedad_val >= 8 OR escala_depresion_val >= 8 OR escala_estres_val >= 8) OR random() < 0.2;
            motivo_alerta_val := NULL;
            IF alerta_critica_val THEN
                motivo_alerta_val := '';
                IF escala_ansiedad_val >= 8 THEN
                    motivo_alerta_val := motivo_alerta_val || 'Ansiedad alta (' || escala_ansiedad_val || '/10). ';
                END IF;
                IF escala_depresion_val >= 8 THEN
                    motivo_alerta_val := motivo_alerta_val || 'Depresión alta (' || escala_depresion_val || '/10). ';
                END IF;
                IF escala_estres_val >= 8 THEN
                    motivo_alerta_val := motivo_alerta_val || 'Estrés alto (' || escala_estres_val || '/10). ';
                END IF;
                IF estado_animo_val IN ('Deprimido', 'Muy_Negativo') THEN
                    motivo_alerta_val := motivo_alerta_val || 'Estado de ánimo: ' || estado_animo_val || '.';
                END IF;
            END IF;

            -- Insertar seguimiento
            INSERT INTO seguimiento_emocional (
                seguimiento_id,
                patient_id,
                sesion_id,
                fecha_registro,
                estado_animo,
                escala_ansiedad,
                escala_depresion,
                escala_estres,
                sintomas,
                factores_estresantes,
                apoyo_social,
                observaciones,
                alerta_critica,
                motivo_alerta,
                registrado_por_id,
                created_at,
                updated_at
            ) VALUES (
                uuid_generate_v4(),
                patient_id_val,
                sesion_id_val,
                fecha_registro,
                estado_animo_val,
                escala_ansiedad_val,
                escala_depresion_val,
                escala_estres_val,
                CASE floor(random() * 4)::int
                    WHEN 0 THEN ARRAY['Insomnio', 'Fatiga']::TEXT[]
                    WHEN 1 THEN ARRAY['Irritabilidad', 'Dificultad para concentrarse']::TEXT[]
                    WHEN 2 THEN ARRAY['Dolores de cabeza']::TEXT[]
                    ELSE ARRAY[]::TEXT[]
                END,
                CASE floor(random() * 3)::int
                    WHEN 0 THEN 'Presión laboral y responsabilidades familiares'
                    WHEN 1 THEN 'Problemas económicos y preocupaciones de salud'
                    ELSE 'Cambios recientes en el entorno laboral'
                END,
                CASE floor(random() * 2)::int
                    WHEN 0 THEN 'Cuenta con apoyo familiar cercano'
                    ELSE 'Apoyo limitado, principalmente de compañeros de trabajo'
                END,
                CASE floor(random() * 2)::int
                    WHEN 0 THEN 'Paciente reporta mejoría gradual en el manejo del estrés.'
                    ELSE 'Se observa necesidad de seguimiento más cercano.'
                END,
                alerta_critica_val,
                motivo_alerta_val,
                user_id_val,
                fecha_registro,
                CURRENT_TIMESTAMP
            );
        END;
    END LOOP;

    -- ============================================
    -- Familiares y Cuidadores
    -- ============================================

    -- Crear 30 familiares/cuidadores para los pacientes
    FOR i IN 1..30 LOOP
        DECLARE
            patient_id_val UUID;
            familiar_id_val UUID;
            es_cuidador_principal_val BOOLEAN;
            relacion_val TEXT;
        BEGIN
            -- Seleccionar paciente aleatorio
            patient_id_val := patient_ids[1 + floor(random() * least(array_length(patient_ids, 1), 20))::int];
            
            relacion_val := CASE floor(random() * 6)::int
                WHEN 0 THEN 'Cónyuge'
                WHEN 1 THEN 'Hijo/a'
                WHEN 2 THEN 'Padre'
                WHEN 3 THEN 'Madre'
                WHEN 4 THEN 'Hermano/a'
                ELSE 'Cuidador'
            END;

            es_cuidador_principal_val := random() < 0.3; -- 30% son cuidadores principales

            -- Insertar familiar
            INSERT INTO familiares_cuidadores (
                familiar_id,
                patient_id,
                nombre,
                apellido,
                relacion,
                telefono,
                email,
                direccion,
                es_cuidador_principal,
                puede_participar_sesiones,
                notas,
                created_at,
                updated_at
            ) VALUES (
                uuid_generate_v4(),
                patient_id_val,
                CASE floor(random() * 10)::int
                    WHEN 0 THEN 'María'
                    WHEN 1 THEN 'Juan'
                    WHEN 2 THEN 'Ana'
                    WHEN 3 THEN 'Carlos'
                    WHEN 4 THEN 'Laura'
                    WHEN 5 THEN 'Pedro'
                    WHEN 6 THEN 'Carmen'
                    WHEN 7 THEN 'Luis'
                    WHEN 8 THEN 'Sofía'
                    ELSE 'Roberto'
                END,
                CASE floor(random() * 10)::int
                    WHEN 0 THEN 'González'
                    WHEN 1 THEN 'Rodríguez'
                    WHEN 2 THEN 'Martínez'
                    WHEN 3 THEN 'López'
                    WHEN 4 THEN 'Pérez'
                    WHEN 5 THEN 'Sánchez'
                    WHEN 6 THEN 'Ramírez'
                    WHEN 7 THEN 'Torres'
                    WHEN 8 THEN 'Flores'
                    ELSE 'Rivera'
                END,
                relacion_val,
                '507-' || (6000000 + floor(random() * 9999999)::int)::TEXT,
                LOWER(
                    CASE floor(random() * 10)::int
                        WHEN 0 THEN 'maria'
                        WHEN 1 THEN 'juan'
                        WHEN 2 THEN 'ana'
                        WHEN 3 THEN 'carlos'
                        WHEN 4 THEN 'laura'
                        WHEN 5 THEN 'pedro'
                        WHEN 6 THEN 'carmen'
                        WHEN 7 THEN 'luis'
                        WHEN 8 THEN 'sofia'
                        ELSE 'roberto'
                    END || '.' ||
                    CASE floor(random() * 10)::int
                        WHEN 0 THEN 'gonzalez'
                        WHEN 1 THEN 'rodriguez'
                        WHEN 2 THEN 'martinez'
                        WHEN 3 THEN 'lopez'
                        WHEN 4 THEN 'perez'
                        WHEN 5 THEN 'sanchez'
                        WHEN 6 THEN 'ramirez'
                        WHEN 7 THEN 'torres'
                        WHEN 8 THEN 'flores'
                        ELSE 'rivera'
                    END || '@email.com'
                ),
                'Ciudad de Panamá, Panamá',
                es_cuidador_principal_val,
                random() < 0.8, -- 80% pueden participar en sesiones
                CASE 
                    WHEN es_cuidador_principal_val THEN 'Cuidador principal del paciente. Disponible para sesiones familiares.'
                    ELSE 'Familiar disponible para apoyo emocional.'
                END,
                CURRENT_TIMESTAMP - INTERVAL '1 day' * floor(random() * 30)::int,
                CURRENT_TIMESTAMP
            ) RETURNING familiar_id INTO familiar_id_val;

            familiar_ids := array_append(familiar_ids, familiar_id_val);
        END;
    END LOOP;

    RAISE NOTICE '✅ Datos de prueba de psicología creados exitosamente';
    RAISE NOTICE '   - Consultas psicológicas: 18';
    RAISE NOTICE '   - Sesiones psicológicas: 15';
    RAISE NOTICE '   - Seguimientos emocionales: 25';
    RAISE NOTICE '   - Familiares/cuidadores: 30';
END $$;

-- ============================================
-- Resumen
-- ============================================
-- Total de registros creados:
-- - 18 Consultas psicológicas/psiquiátricas
-- - 15 Sesiones psicológicas (individuales, grupales, familiares)
-- - 25 Seguimientos emocionales (con escalas y alertas críticas)
-- - 30 Familiares/cuidadores
--
-- Los datos están asociados a los colaboradores de la Policía de Panamá
-- que ya existen en la base de datos.

