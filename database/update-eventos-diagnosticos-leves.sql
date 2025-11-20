-- ============================================
-- Actualización de Diagnósticos ICD-10 en Eventos
-- Reemplazando diagnósticos graves por códigos más leves
-- (Controles, chequeos, exámenes rutinarios)
-- ============================================

-- Actualizar eventos con diagnósticos más leves y apropiados
-- Estos códigos Z son para contactos con servicios de salud, exámenes y controles

-- 1. Examen médico general (Z00.0)
UPDATE eventos 
SET diagnostico_icd_id = (SELECT icd10_id FROM icd10 WHERE codigo = 'Z00.0' LIMIT 1),
    updated_at = CURRENT_TIMESTAMP
WHERE evento_id = '5a64099d-d714-489b-bb03-e31bde582aab'
  AND EXISTS (SELECT 1 FROM icd10 WHERE codigo = 'Z00.0');

-- 2. Examen de la presión sanguínea (Z01.3)
UPDATE eventos 
SET diagnostico_icd_id = (SELECT icd10_id FROM icd10 WHERE codigo = 'Z01.3' LIMIT 1),
    updated_at = CURRENT_TIMESTAMP
WHERE evento_id = '88d4d900-736a-4d38-8e86-2757f1d10fd9'
  AND EXISTS (SELECT 1 FROM icd10 WHERE codigo = 'Z01.3');

-- 3. Examen de laboratorio (Z01.7)
UPDATE eventos 
SET diagnostico_icd_id = (SELECT icd10_id FROM icd10 WHERE codigo = 'Z01.7' LIMIT 1),
    updated_at = CURRENT_TIMESTAMP
WHERE evento_id = '75f5665b-e972-443d-a940-9e200cdb0fc6'
  AND EXISTS (SELECT 1 FROM icd10 WHERE codigo = 'Z01.7');

-- 4. Examen ginecológico (Z01.4)
UPDATE eventos 
SET diagnostico_icd_id = (SELECT icd10_id FROM icd10 WHERE codigo = 'Z01.4' LIMIT 1),
    updated_at = CURRENT_TIMESTAMP
WHERE evento_id = '1092af8c-41d0-4b98-823b-084be252187e'
  AND EXISTS (SELECT 1 FROM icd10 WHERE codigo = 'Z01.4');

-- 5. Examen y observación consecutivos a accidente de trabajo (Z04.2)
UPDATE eventos 
SET diagnostico_icd_id = (SELECT icd10_id FROM icd10 WHERE codigo = 'Z04.2' LIMIT 1),
    updated_at = CURRENT_TIMESTAMP
WHERE evento_id = 'bd41c24d-395f-44ff-88be-70ef002112c1'
  AND EXISTS (SELECT 1 FROM icd10 WHERE codigo = 'Z04.2');

-- 6. Examen psiquiátrico general (Z00.4)
UPDATE eventos 
SET diagnostico_icd_id = (SELECT icd10_id FROM icd10 WHERE codigo = 'Z00.4' LIMIT 1),
    updated_at = CURRENT_TIMESTAMP
WHERE evento_id = '22902590-2e8b-4909-9f3a-ebf7b2bb4f42'
  AND EXISTS (SELECT 1 FROM icd10 WHERE codigo = 'Z00.4');

-- 7. Examen y observación consecutivos a accidente de transporte (Z04.1)
UPDATE eventos 
SET diagnostico_icd_id = (SELECT icd10_id FROM icd10 WHERE codigo = 'Z04.1' LIMIT 1),
    updated_at = CURRENT_TIMESTAMP
WHERE evento_id = '18153245-5095-4c1f-b9bc-8da636b6c768'
  AND EXISTS (SELECT 1 FROM icd10 WHERE codigo = 'Z04.1');

-- 8. Examen de ojos y de la visión (Z01.0)
UPDATE eventos 
SET diagnostico_icd_id = (SELECT icd10_id FROM icd10 WHERE codigo = 'Z01.0' LIMIT 1),
    updated_at = CURRENT_TIMESTAMP
WHERE evento_id = '543dd110-605f-4d4a-ad5d-6ee33908bc55'
  AND EXISTS (SELECT 1 FROM icd10 WHERE codigo = 'Z01.0');

-- 9. Examen de oídos y de la audición (Z01.1)
UPDATE eventos 
SET diagnostico_icd_id = (SELECT icd10_id FROM icd10 WHERE codigo = 'Z01.1' LIMIT 1),
    updated_at = CURRENT_TIMESTAMP
WHERE evento_id = '5640659f-077c-49bb-895d-c4f4956f00dd'
  AND EXISTS (SELECT 1 FROM icd10 WHERE codigo = 'Z01.1');

-- 10. Examen para reclutamiento en las fuerzas armadas (Z02.3) - Apropiado para policía
UPDATE eventos 
SET diagnostico_icd_id = (SELECT icd10_id FROM icd10 WHERE codigo = 'Z02.3' LIMIT 1),
    updated_at = CURRENT_TIMESTAMP
WHERE evento_id = '1ee1414b-b870-4e13-b5f4-ed126beb25f1'
  AND EXISTS (SELECT 1 FROM icd10 WHERE codigo = 'Z02.3');

-- 11. Examen preempleo (Z02.1)
UPDATE eventos 
SET diagnostico_icd_id = (SELECT icd10_id FROM icd10 WHERE codigo = 'Z02.1' LIMIT 1),
    updated_at = CURRENT_TIMESTAMP
WHERE evento_id = '3bb2512b-9c4e-4c7d-88a9-9d32b050d03e'
  AND EXISTS (SELECT 1 FROM icd10 WHERE codigo = 'Z02.1');

-- 12. Examen odontológico (Z01.2)
UPDATE eventos 
SET diagnostico_icd_id = (SELECT icd10_id FROM icd10 WHERE codigo = 'Z01.2' LIMIT 1),
    updated_at = CURRENT_TIMESTAMP
WHERE evento_id = 'a55cf12a-5b9b-48df-9950-cd41f6aab4c2'
  AND EXISTS (SELECT 1 FROM icd10 WHERE codigo = 'Z01.2');

-- 13. Examen radiológico (Z01.6)
UPDATE eventos 
SET diagnostico_icd_id = (SELECT icd10_id FROM icd10 WHERE codigo = 'Z01.6' LIMIT 1),
    updated_at = CURRENT_TIMESTAMP
WHERE evento_id = 'd3d21c74-0a64-4ca5-a814-b5b5ba44123a'
  AND EXISTS (SELECT 1 FROM icd10 WHERE codigo = 'Z01.6');

-- 14. Control de salud de rutina (Z00.1)
UPDATE eventos 
SET diagnostico_icd_id = (SELECT icd10_id FROM icd10 WHERE codigo = 'Z00.1' LIMIT 1),
    updated_at = CURRENT_TIMESTAMP
WHERE evento_id = '103fa1df-a5f8-4a4e-b69c-eeb541a320df'
  AND EXISTS (SELECT 1 FROM icd10 WHERE codigo = 'Z00.1');

-- 15. Examen especial no especificado (Z01.9)
UPDATE eventos 
SET diagnostico_icd_id = (SELECT icd10_id FROM icd10 WHERE codigo = 'Z01.9' LIMIT 1),
    updated_at = CURRENT_TIMESTAMP
WHERE evento_id = '580c3cb8-3142-4745-918a-25268c067de0'
  AND EXISTS (SELECT 1 FROM icd10 WHERE codigo = 'Z01.9');

-- ============================================
-- Resumen de actualizaciones
-- ============================================
-- Total de eventos actualizados: 15
-- 
-- Códigos ICD-10 utilizados (todos leves/apropiados):
-- - Z00.0: Examen médico general
-- - Z00.1: Control de salud de rutina
-- - Z00.4: Examen psiquiátrico general
-- - Z01.0: Examen de ojos y de la visión
-- - Z01.1: Examen de oídos y de la audición
-- - Z01.2: Examen odontológico
-- - Z01.3: Examen de la presión sanguínea
-- - Z01.4: Examen ginecológico
-- - Z01.6: Examen radiológico
-- - Z01.7: Examen de laboratorio
-- - Z01.9: Examen especial no especificado
-- - Z02.1: Examen preempleo
-- - Z02.3: Examen para reclutamiento en las fuerzas armadas
-- - Z04.1: Examen y observación consecutivos a accidente de transporte
-- - Z04.2: Examen y observación consecutivos a accidente de trabajo
--
-- Nota: Todos estos códigos son apropiados para controles, chequeos y exámenes rutinarios,
-- no representan enfermedades graves.

