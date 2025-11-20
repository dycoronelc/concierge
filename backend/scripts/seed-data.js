const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

// Leer el archivo Excel
const excelPath = path.join(__dirname, '../../Planillas-Policia.xlsx');
const workbook = XLSX.readFile(excelPath);

// Obtener la primera hoja
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Convertir a JSON
const data = XLSX.utils.sheet_to_json(worksheet);

console.log(`📊 Archivo Excel leído: ${data.length} registros encontrados`);
console.log('📋 Columnas:', Object.keys(data[0] || {}));

// Mostrar una muestra de los datos
if (data.length > 0) {
  console.log('\n📄 Muestra de datos (primeros 3 registros):');
  console.log(JSON.stringify(data.slice(0, 3), null, 2));
}

// Generar script SQL de seeding
const generateSeedSQL = (data) => {
  let sql = `-- ============================================
-- Script de Datos de Prueba - Policía de Panamá
-- Generado automáticamente desde Planillas-Policia.xlsx
-- ============================================

-- Limpiar datos existentes (opcional, comentar si no quieres borrar)
-- TRUNCATE TABLE tickets CASCADE;
-- TRUNCATE TABLE eventos CASCADE;
-- TRUNCATE TABLE encuentros CASCADE;
-- TRUNCATE TABLE patients CASCADE;
-- TRUNCATE TABLE providers CASCADE;

`;

  // Extraer información de los colaboradores
  const colaboradores = data.map((row, index) => {
    // Intentar identificar columnas comunes
    const nombreCompleto = row['Nombre'] || row['NOMBRE'] || row['nombre'] || row['Nombre Completo'] || `Colaborador ${index + 1}`;
    const apellidoCompleto = row['Apellido'] || row['APELLIDO'] || row['apellido'] || '';
    const cedula = row['Cédula'] || row['CEDULA'] || row['cedula'] || row['Cedula'] || row['DNI'] || `8-${String(index + 1).padStart(3, '0')}-${Math.floor(Math.random() * 1000)}`;
    const telefono = row['Teléfono'] || row['TELEFONO'] || row['telefono'] || row['Celular'] || `507-6${Math.floor(Math.random() * 10000000)}`;
    const cargo = row['Cargo'] || row['CARGO'] || row['cargo'] || row['Puesto'] || 'Oficial';
    const unidad = row['Unidad'] || row['UNIDAD'] || row['unidad'] || row['Departamento'] || 'Unidad Operativa';
    
    // Separar nombre y apellido correctamente
    let nombre = nombreCompleto.split(' ')[0] || 'Nombre';
    let apellido = apellidoCompleto || nombreCompleto.split(' ').slice(1).join(' ') || 'Apellido';
    
    // Si el apellido está vacío, intentar extraer del nombre completo
    if (!apellidoCompleto && nombreCompleto.split(' ').length > 1) {
      nombre = nombreCompleto.split(' ')[0];
      apellido = nombreCompleto.split(' ').slice(1).join(' ');
    }
    
    // Generar email basado en nombre y apellido
    const emailBase = `${nombre.toLowerCase()}.${apellido.toLowerCase().split(' ')[0]}`.replace(/[^a-z0-9.]/g, '');
    const email = `${emailBase}@policia.gob.pa`;
    
    return {
      nombre: nombre,
      apellido: apellido,
      cedula: String(cedula).replace(/[^0-9-]/g, ''),
      telefono: String(telefono).replace(/[^0-9-]/g, ''),
      email: email,
      cargo: cargo,
      unidad: unidad,
    };
  });

  // Generar SQL para pacientes (colaboradores como pacientes)
  sql += `-- ============================================
-- Pacientes (Colaboradores de la Policía)
-- ============================================

`;

  colaboradores.slice(0, 50).forEach((colab, index) => {
    const patientId = `'${generateUUID()}'`;
    sql += `INSERT INTO patients (patient_id, cedula, nombre, apellido, telefono_1, email, direccion_textual, ciudad, provincia, created_at, updated_at)
VALUES (
  ${patientId},
  '${colab.cedula}',
  '${colab.nombre.replace(/'/g, "''")}',
  '${colab.apellido.replace(/'/g, "''")}',
  '${colab.telefono}',
  '${colab.email.replace(/'/g, "''")}',
  'Comando de la Policía Nacional - ${colab.unidad.replace(/'/g, "''")}',
  'Ciudad de Panamá',
  'Panamá',
  CURRENT_TIMESTAMP - INTERVAL '${Math.floor(Math.random() * 180)} days',
  CURRENT_TIMESTAMP
) ON CONFLICT (cedula) DO NOTHING;

`;
  });

  // Generar prestadores (hospitales y clínicas de Panamá)
  sql += `-- ============================================
-- Prestadores (Hospitales y Clínicas de Panamá)
-- ============================================

INSERT INTO providers (provider_id, nombre, tipo, categorias, ciudades, provincias, disponible, created_at, updated_at) VALUES
('${generateUUID()}', 'Hospital Santo Tomás', 'Aliado', ARRAY['Urgencia', 'Hospitalaria'], ARRAY['Ciudad de Panamá'], ARRAY['Panamá'], true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('${generateUUID()}', 'Hospital Nacional', 'Aliado', ARRAY['Urgencia', 'Hospitalaria', 'Quirurgica'], ARRAY['Ciudad de Panamá'], ARRAY['Panamá'], true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('${generateUUID()}', 'Centro Médico Paitilla', 'Aliado', ARRAY['Ambulatoria', 'Urgencia'], ARRAY['Ciudad de Panamá'], ARRAY['Panamá'], true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('${generateUUID()}', 'Hospital San Fernando', 'Red', ARRAY['Ambulatoria', 'Urgencia'], ARRAY['Ciudad de Panamá'], ARRAY['Panamá'], true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('${generateUUID()}', 'Clínica San Fernando', 'Red', ARRAY['Ambulatoria'], ARRAY['Ciudad de Panamá'], ARRAY['Panamá'], true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('${generateUUID()}', 'Hospital de Especialidades Pediátricas', 'Aliado', ARRAY['Hospitalaria'], ARRAY['Ciudad de Panamá'], ARRAY['Panamá'], true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('${generateUUID()}', 'Centro Médico Blue Medical', 'Red', ARRAY['Ambulatoria'], ARRAY['Ciudad de Panamá'], ARRAY['Panamá'], true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('${generateUUID()}', 'Hospital Punta Pacífica', 'Aliado', ARRAY['Urgencia', 'Hospitalaria', 'Quirurgica'], ARRAY['Ciudad de Panamá'], ARRAY['Panamá'], true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

`;

  // Obtener IDs de pacientes y prestadores para generar tickets
  sql += `-- ============================================
-- Tickets de Prueba
-- ============================================

`;

  const ticketDescriptions = [
    'Dolor de cabeza persistente desde hace 3 días',
    'Fiebre alta y malestar general',
    'Lesión en la rodilla durante patrullaje',
    'Dolor en el pecho y dificultad para respirar',
    'Consulta de seguimiento post-operación',
    'Revisión médica anual',
    'Dolor de espalda por esfuerzo físico',
    'Gripe con síntomas severos',
    'Herida que requiere sutura',
    'Control de presión arterial',
    'Dolor abdominal agudo',
    'Consulta por ansiedad y estrés laboral',
    'Revisión de lesión antigua',
    'Síntomas de resfriado',
    'Dolor en muñeca por uso repetitivo',
  ];

  const categorias = ['Ambulatoria', 'Urgencia', 'Hospitalaria', 'Quirurgica'];
  const canales = ['WhatsApp', 'Telefonico', 'Web'];
  const estados = ['Creado', 'En_gestion', 'Asignado_a_prestador', 'En_atencion', 'Cerrado'];

  // Generar 30 tickets de prueba
  for (let i = 0; i < 30; i++) {
    const ticketNumber = `TKT-${String(i + 1).padStart(6, '0')}`;
    const patientIndex = Math.floor(Math.random() * Math.min(50, colaboradores.length));
    const categoria = categorias[Math.floor(Math.random() * categorias.length)];
    const canal = canales[Math.floor(Math.random() * canales.length)];
    const estado = estados[Math.floor(Math.random() * estados.length)];
    const diasAtras = Math.floor(Math.random() * 60);
    
    sql += `INSERT INTO tickets (ticket_id, ticket_number, patient_id, channel, description, categoria_solicitud, nivel_confianza_clasificacion, status, fecha_hora_creacion_ticket, created_at, updated_at)
SELECT 
  '${generateUUID()}',
  '${ticketNumber}',
  patient_id,
  '${canal}',
  '${ticketDescriptions[i % ticketDescriptions.length].replace(/'/g, "''")}',
  '${categoria}',
  ${(0.7 + Math.random() * 0.3).toFixed(2)},
  '${estado}',
  CURRENT_TIMESTAMP - INTERVAL '${diasAtras} days',
  CURRENT_TIMESTAMP - INTERVAL '${diasAtras} days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

`;
  }

  // Generar eventos clínicos
  sql += `-- ============================================
-- Eventos Clínicos
-- ============================================

`;

  const diagnosticosICD = [
    'A00.9', 'I10', 'M54.5', 'J06.9', 'K59.0', 'F41.9', 'S72.0', 'R50.9', 'R51', 'I20.9'
  ];

  for (let i = 0; i < 15; i++) {
    const diasAtras = Math.floor(Math.random() * 90);
    const severidad = ['Leve', 'Moderado', 'Grave'][Math.floor(Math.random() * 3)];
    const estadoEvento = ['Activo', 'Seguimiento', 'Cerrado'][Math.floor(Math.random() * 3)];
    
    sql += `INSERT INTO eventos (evento_id, patient_id, diagnostico_icd_id, severidad, categoria, estado_evento, fecha_inicio, creado_por, created_at, updated_at)
SELECT 
  '${generateUUID()}',
  patient_id,
  (SELECT icd10_id FROM icd10 WHERE codigo = '${diagnosticosICD[i % diagnosticosICD.length]}' LIMIT 1),
  '${severidad}',
  '${categorias[Math.floor(Math.random() * categorias.length)]}',
  '${estadoEvento}',
  CURRENT_TIMESTAMP - INTERVAL '${diasAtras} days',
  (SELECT user_id FROM users WHERE role = 'Agente' LIMIT 1),
  CURRENT_TIMESTAMP - INTERVAL '${diasAtras} days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

`;
  }

  // Generar encuentros
  sql += `-- ============================================
-- Encuentros Clínicos
-- ============================================

`;

  for (let i = 0; i < 20; i++) {
    const tipoEncuentro = ['Consulta', 'Urgencia', 'Hospitalizacion', 'Seguimiento'][Math.floor(Math.random() * 4)];
    const estadoEncuentro = ['Programado', 'En_curso', 'Completado'][Math.floor(Math.random() * 3)];
    const diasAtras = Math.floor(Math.random() * 30);
    
    sql += `INSERT INTO encuentros (encuentro_id, evento_id, prestador_id, tipo_encuentro, estado, fecha_programada, fecha_real, resultado, created_at, updated_at)
SELECT 
  '${generateUUID()}',
  evento_id,
  (SELECT provider_id FROM providers ORDER BY RANDOM() LIMIT 1),
  '${tipoEncuentro}',
  '${estadoEncuentro}',
  CURRENT_TIMESTAMP - INTERVAL '${diasAtras} days',
  CASE WHEN '${estadoEncuentro}' = 'Completado' THEN CURRENT_TIMESTAMP - INTERVAL '${diasAtras} days' ELSE NULL END,
  CASE WHEN '${estadoEncuentro}' = 'Completado' THEN 'Consulta realizada exitosamente. Paciente estable.' ELSE NULL END,
  CURRENT_TIMESTAMP - INTERVAL '${diasAtras} days',
  CURRENT_TIMESTAMP
FROM eventos
ORDER BY RANDOM()
LIMIT 1;

`;
  }

  // Generar servicios de enfermería
  sql += `-- ============================================
-- Servicios de Enfermería
-- ============================================

`;

  const tiposCuidado = ['Heridas', 'Inyecciones', 'Educación', 'Monitoreo', 'Otro'];
  
  for (let i = 0; i < 10; i++) {
    const tipoCuidado = tiposCuidado[Math.floor(Math.random() * tiposCuidado.length)];
    const estado = ['Solicitado', 'Asignado', 'Completado'][Math.floor(Math.random() * 3)];
    const diasAtras = Math.floor(Math.random() * 45);
    
    sql += `INSERT INTO servicios_enfermeria (servicio_id, patient_id, tipo_cuidado, estado, fecha_programada, creado_por_id, created_at, updated_at)
SELECT 
  '${generateUUID()}',
  patient_id,
  '${tipoCuidado}',
  '${estado}',
  CURRENT_TIMESTAMP - INTERVAL '${diasAtras} days',
  (SELECT user_id FROM users WHERE role = 'Agente' LIMIT 1),
  CURRENT_TIMESTAMP - INTERVAL '${diasAtras} days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

`;
  }

  // Generar solicitudes de transporte
  sql += `-- ============================================
-- Solicitudes de Transporte
-- ============================================

`;

  for (let i = 0; i < 8; i++) {
    const tipoTraslado = ['Ordinario', 'Asistido', 'Urgente'][Math.floor(Math.random() * 3)];
    const estado = ['Solicitado', 'Asignado', 'Completado'][Math.floor(Math.random() * 3)];
    const diasAtras = Math.floor(Math.random() * 30);
    
    sql += `INSERT INTO solicitudes_transporte (solicitud_id, patient_id, tipo_traslado, direccion_origen, direccion_destino, estado, creado_por_id, created_at, updated_at)
SELECT 
  '${generateUUID()}',
  patient_id,
  '${tipoTraslado}',
  'Comando de la Policía Nacional',
  'Hospital Santo Tomás',
  '${estado}',
  (SELECT user_id FROM users WHERE role = 'Agente' LIMIT 1),
  CURRENT_TIMESTAMP - INTERVAL '${diasAtras} days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

`;
  }

  // Generar solicitudes de estudios
  sql += `-- ============================================
-- Solicitudes de Estudios Clínicos
-- ============================================

`;

  const tiposEstudio = ['Sangre', 'Orina', 'Imagen', 'Genético'];
  const nombresEstudios = [
    'Hemograma completo',
    'Perfil lipídico',
    'Radiografía de tórax',
    'Ecocardiograma',
    'Prueba de esfuerzo',
    'Análisis de orina',
    'Glucosa en ayunas',
  ];
  
  for (let i = 0; i < 12; i++) {
    const tipoEstudio = tiposEstudio[Math.floor(Math.random() * tiposEstudio.length)];
    const nombreEstudio = nombresEstudios[Math.floor(Math.random() * nombresEstudios.length)];
    const estado = ['Solicitado', 'Programado', 'Completado'][Math.floor(Math.random() * 3)];
    const diasAtras = Math.floor(Math.random() * 60);
    
    sql += `INSERT INTO solicitudes_estudios (solicitud_id, patient_id, tipo_estudio, nombre_estudio, estado, toma_domicilio, solicitado_por_id, created_at, updated_at)
SELECT 
  '${generateUUID()}',
  patient_id,
  '${tipoEstudio}',
  '${nombreEstudio}',
  '${estado}',
  ${Math.random() > 0.5},
  (SELECT user_id FROM users WHERE role = 'Agente' LIMIT 1),
  CURRENT_TIMESTAMP - INTERVAL '${diasAtras} days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

`;
  }

  sql += `-- ============================================
-- Fin del Script de Seeding
-- ============================================
`;

  return sql;
};

// Función para generar UUIDs simples (para el SQL)
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Generar el SQL
const seedSQL = generateSeedSQL(data);

// Guardar en archivo
const outputPath = path.join(__dirname, '../../database/seed-data.sql');
fs.writeFileSync(outputPath, seedSQL, 'utf8');

console.log(`\n✅ Script SQL generado exitosamente!`);
console.log(`📁 Archivo guardado en: ${outputPath}`);
console.log(`\n📊 Resumen de datos generados:`);
console.log(`   - Pacientes: 50`);
console.log(`   - Prestadores: 8`);
console.log(`   - Tickets: 30`);
console.log(`   - Eventos: 15`);
console.log(`   - Encuentros: 20`);
console.log(`   - Servicios de Enfermería: 10`);
console.log(`   - Solicitudes de Transporte: 8`);
console.log(`   - Solicitudes de Estudios: 12`);
console.log(`\n💡 Para ejecutar el script:`);
console.log(`   1. Abre el SQL Editor en Supabase`);
console.log(`   2. Copia y pega el contenido de database/seed-data.sql`);
console.log(`   3. Ejecuta el script`);

