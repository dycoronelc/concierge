-- ============================================
-- Datos de Prueba - EPIC 12: Nutrición Personalizada
-- Generado para colaboradores de la Policía de Panamá
-- ============================================

-- Obtener algunos pacientes y usuarios para las relaciones
DO $$
DECLARE
    patient_ids UUID[];
    user_ids UUID[];
    evaluacion_ids UUID[];
    plan_ids UUID[];
    i INTEGER;
    j INTEGER;
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
    -- Evaluaciones Nutricionales
    -- ============================================

    -- Crear 15 evaluaciones nutricionales
    FOR i IN 1..15 LOOP
        DECLARE
            patient_id_val UUID;
            user_id_val UUID;
            evaluacion_id_val UUID;
            peso DECIMAL;
            talla DECIMAL;
            imc_calculado DECIMAL;
            fecha_eval TIMESTAMP;
        BEGIN
            -- Seleccionar paciente aleatorio
            patient_id_val := patient_ids[1 + floor(random() * least(array_length(patient_ids, 1), 20))::int];
            user_id_val := user_ids[1 + floor(random() * array_length(user_ids, 1))::int];
            
            -- Generar datos realistas
            peso := 60 + (random() * 40); -- Entre 60 y 100 kg
            talla := 150 + (random() * 30); -- Entre 150 y 180 cm
            imc_calculado := peso / POWER(talla / 100, 2);
            fecha_eval := CURRENT_TIMESTAMP - INTERVAL '1 day' * (30 + floor(random() * 60)::int);

            -- Insertar evaluación
            INSERT INTO evaluaciones_nutricionales (
                evaluacion_id,
                patient_id,
                nutriologo_asignado_id,
                fecha_evaluacion,
                peso_kg,
                talla_cm,
                imc,
                circunferencia_cintura_cm,
                porcentaje_grasa_corporal,
                nivel_actividad_fisica,
                alergias_alimentarias,
                restricciones_dieteticas,
                preferencias_alimentarias,
                enfermedades_cronicas,
                medicamentos_actuales,
                objetivos_nutricionales,
                notas_evaluacion,
                evaluado_por_id,
                created_at,
                updated_at
            ) VALUES (
                uuid_generate_v4(),
                patient_id_val,
                user_id_val,
                fecha_eval,
                ROUND(peso::numeric, 2),
                ROUND(talla::numeric, 2),
                ROUND(imc_calculado::numeric, 2),
                ROUND((70 + random() * 20)::numeric, 2), -- Circunferencia cintura
                ROUND((15 + random() * 15)::numeric, 2), -- % grasa corporal
                CASE floor(random() * 5)::int
                    WHEN 0 THEN 'Sedentario'
                    WHEN 1 THEN 'Ligero'
                    WHEN 2 THEN 'Moderado'
                    WHEN 3 THEN 'Intenso'
                    ELSE 'Muy_Intenso'
                END,
                ARRAY['Lactosa', 'Gluten']::TEXT[],
                ARRAY['Bajo en sodio', 'Sin azúcar refinada']::TEXT[],
                ARRAY['Vegetariano', 'Alto en proteínas']::TEXT[],
                ARRAY['Hipertensión', 'Diabetes tipo 2']::TEXT[],
                ARRAY['Metformina', 'Losartán']::TEXT[],
                CASE floor(random() * 3)::int
                    WHEN 0 THEN 'Bajar de peso de forma saludable'
                    WHEN 1 THEN 'Aumentar masa muscular'
                    ELSE 'Mantener peso y mejorar energía'
                END,
                'Evaluación nutricional completa realizada. Paciente presenta buen estado general.',
                user_id_val,
                fecha_eval,
                CURRENT_TIMESTAMP
            ) RETURNING evaluacion_id INTO evaluacion_id_val;

            -- Guardar ID para usar en planes
            evaluacion_ids := array_append(evaluacion_ids, evaluacion_id_val);
        END;
    END LOOP;

    -- ============================================
    -- Planes Nutricionales
    -- ============================================

    -- Crear 12 planes nutricionales basados en las evaluaciones
    FOR i IN 1..12 LOOP
        DECLARE
            evaluacion_id_val UUID;
            patient_id_val UUID;
            user_id_val UUID;
            plan_id_val UUID;
            calorias INTEGER;
            fecha_inicio DATE;
            fecha_fin DATE;
        BEGIN
            -- Seleccionar evaluación aleatoria
            IF array_length(evaluacion_ids, 1) > 0 THEN
                evaluacion_id_val := evaluacion_ids[1 + floor(random() * array_length(evaluacion_ids, 1))::int];
            ELSE
                CONTINUE;
            END IF;

            -- Obtener patient_id de la evaluación
            SELECT patient_id INTO patient_id_val
            FROM evaluaciones_nutricionales
            WHERE evaluacion_id = evaluacion_id_val;

            user_id_val := user_ids[1 + floor(random() * array_length(user_ids, 1))::int];
            calorias := 1500 + floor(random() * 1000)::int; -- Entre 1500 y 2500 kcal
            fecha_inicio := CURRENT_DATE - INTERVAL '1 day' * floor(random() * 30)::int;
            fecha_fin := fecha_inicio + INTERVAL '1 day' * (30 + floor(random() * 60)::int);

            -- Insertar plan
            INSERT INTO planes_nutricionales (
                plan_id,
                evaluacion_id,
                patient_id,
                nutriologo_asignado_id,
                nombre_plan,
                descripcion,
                fecha_inicio,
                fecha_fin,
                calorias_diarias,
                proteinas_g,
                carbohidratos_g,
                grasas_g,
                fibra_g,
                plan_semanal,
                recomendaciones,
                estado,
                notificaciones_habilitadas,
                frecuencia_recordatorios,
                creado_por_id,
                created_at,
                updated_at
            ) VALUES (
                uuid_generate_v4(),
                evaluacion_id_val,
                patient_id_val,
                user_id_val,
                CASE floor(random() * 4)::int
                    WHEN 0 THEN 'Plan de Pérdida de Peso Saludable'
                    WHEN 1 THEN 'Plan de Ganancia Muscular'
                    WHEN 2 THEN 'Plan de Mantenimiento y Energía'
                    ELSE 'Plan Nutricional Personalizado'
                END,
                'Plan nutricional diseñado específicamente para las necesidades del paciente basado en su evaluación nutricional.',
                fecha_inicio,
                fecha_fin,
                calorias,
                ROUND((calorias * 0.25 / 4)::numeric, 2), -- 25% proteínas
                ROUND((calorias * 0.45 / 4)::numeric, 2), -- 45% carbohidratos
                ROUND((calorias * 0.30 / 9)::numeric, 2), -- 30% grasas
                ROUND((25 + random() * 10)::numeric, 2), -- Fibra
                jsonb_build_object(
                    'lunes', jsonb_build_object(
                        'desayuno', ARRAY['Avena con frutas', 'Yogur griego']::TEXT[],
                        'almuerzo', ARRAY['Pollo a la plancha', 'Arroz integral', 'Ensalada']::TEXT[],
                        'cena', ARRAY['Pescado al horno', 'Verduras']::TEXT[],
                        'snacks', ARRAY['Nueces', 'Manzana']::TEXT[]
                    )
                ),
                ARRAY[
                    'Beber al menos 2 litros de agua al día',
                    'Realizar 5 comidas al día',
                    'Evitar alimentos procesados',
                    'Incluir proteína en cada comida',
                    'Consumir frutas y verduras diariamente'
                ]::TEXT[],
                CASE floor(random() * 4)::int
                    WHEN 0 THEN 'Activo'
                    WHEN 1 THEN 'Activo'
                    WHEN 2 THEN 'Pausado'
                    ELSE 'Completado'
                END,
                true,
                CASE floor(random() * 3)::int
                    WHEN 0 THEN 'Diario'
                    WHEN 1 THEN 'Cada_2_dias'
                    ELSE 'Semanal'
                END,
                user_id_val,
                fecha_inicio,
                CURRENT_TIMESTAMP
            ) RETURNING plan_id INTO plan_id_val;

            -- Guardar ID para usar en seguimientos
            plan_ids := array_append(plan_ids, plan_id_val);
        END;
    END LOOP;

    -- ============================================
    -- Seguimientos Nutricionales
    -- ============================================

    -- Crear 25 seguimientos para los planes activos
    FOR i IN 1..25 LOOP
        DECLARE
            plan_id_val UUID;
            patient_id_val UUID;
            user_id_val UUID;
            fecha_seg DATE;
            peso DECIMAL;
            alerta BOOLEAN;
            motivo_alerta TEXT;
        BEGIN
            -- Seleccionar plan aleatorio
            IF array_length(plan_ids, 1) > 0 THEN
                plan_id_val := plan_ids[1 + floor(random() * array_length(plan_ids, 1))::int];
            ELSE
                CONTINUE;
            END IF;

            -- Obtener patient_id del plan
            SELECT patient_id INTO patient_id_val
            FROM planes_nutricionales
            WHERE plan_id = plan_id_val;

            user_id_val := user_ids[1 + floor(random() * array_length(user_ids, 1))::int];
            fecha_seg := CURRENT_DATE - INTERVAL '1 day' * floor(random() * 20)::int;
            
            -- Peso con variación pequeña
            SELECT peso_kg INTO peso
            FROM evaluaciones_nutricionales
            WHERE evaluacion_id = (
                SELECT evaluacion_id FROM planes_nutricionales WHERE plan_id = plan_id_val
            );
            
            IF peso IS NULL THEN
                peso := 70 + (random() * 20);
            ELSE
                -- Variación de ±3kg
                peso := peso + (random() * 6 - 3);
            END IF;

            -- Determinar si hay alerta (20% de probabilidad)
            alerta := random() < 0.2;
            motivo_alerta := NULL;
            IF alerta THEN
                motivo_alerta := CASE floor(random() * 3)::int
                    WHEN 0 THEN 'Aumento de peso significativo: +2.5 kg'
                    WHEN 1 THEN 'Adherencia al plan: Baja'
                    ELSE 'Disminución de energía y síntomas de fatiga'
                END;
            END IF;

            -- Insertar seguimiento
            INSERT INTO seguimiento_nutricional (
                seguimiento_id,
                plan_id,
                patient_id,
                fecha_seguimiento,
                peso_kg,
                sintomas,
                nivel_energia,
                adherencia_plan,
                observaciones,
                alerta_retroceso,
                motivo_alerta,
                registrado_por_id,
                created_at,
                updated_at
            ) VALUES (
                uuid_generate_v4(),
                plan_id_val,
                patient_id_val,
                fecha_seg,
                ROUND(peso::numeric, 2),
                CASE floor(random() * 4)::int
                    WHEN 0 THEN ARRAY['Fatiga leve']::TEXT[]
                    WHEN 1 THEN ARRAY['Dolor de cabeza', 'Náuseas']::TEXT[]
                    WHEN 2 THEN ARRAY[]::TEXT[]
                    ELSE ARRAY['Mejoría en energía']::TEXT[]
                END,
                CASE floor(random() * 5)::int
                    WHEN 0 THEN 'Muy_Bajo'
                    WHEN 1 THEN 'Bajo'
                    WHEN 2 THEN 'Normal'
                    WHEN 3 THEN 'Alto'
                    ELSE 'Muy_Alto'
                END,
                CASE floor(random() * 4)::int
                    WHEN 0 THEN 'Baja'
                    WHEN 1 THEN 'Media'
                    WHEN 2 THEN 'Alta'
                    ELSE 'Completa'
                END,
                CASE floor(random() * 3)::int
                    WHEN 0 THEN 'Paciente reporta mejoría en energía y bienestar general.'
                    WHEN 1 THEN 'Se observa buena adherencia al plan nutricional.'
                    ELSE 'Paciente requiere seguimiento más cercano.'
                END,
                alerta,
                motivo_alerta,
                user_id_val,
                fecha_seg,
                CURRENT_TIMESTAMP
            );
        END;
    END LOOP;

    RAISE NOTICE '✅ Datos de prueba de nutrición creados exitosamente';
    RAISE NOTICE '   - Evaluaciones nutricionales: 15';
    RAISE NOTICE '   - Planes nutricionales: 12';
    RAISE NOTICE '   - Seguimientos nutricionales: 25';
END $$;

-- ============================================
-- Resumen
-- ============================================
-- Total de registros creados:
-- - 15 Evaluaciones nutricionales
-- - 12 Planes nutricionales
-- - 25 Seguimientos nutricionales
--
-- Los datos están asociados a los colaboradores de la Policía de Panamá
-- que ya existen en la base de datos.

