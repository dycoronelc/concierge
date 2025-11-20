const fs = require('fs');
const path = require('path');

// Leer el archivo CSV
const csvPath = path.join(__dirname, '../../icds.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');

// Parsear CSV
const lines = csvContent.split('\n');
const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());

console.log('📊 Columnas encontradas:', headers);
console.log(`📋 Total de líneas: ${lines.length}`);

// Función para parsear una línea CSV (maneja comillas y comas dentro de campos)
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

// Parsear todas las líneas
const data = [];
for (let i = 1; i < lines.length; i++) {
  if (lines[i].trim()) {
    const values = parseCSVLine(lines[i]);
    if (values.length >= headers.length) {
      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index]?.replace(/^"|"$/g, '') || '';
      });
      data.push(row);
    }
  }
}

console.log(`✅ ${data.length} registros parseados`);
console.log('\n📄 Muestra de datos (primeros 3 registros):');
console.log(JSON.stringify(data.slice(0, 3), null, 2));

// Generar SQL
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

let sql = `-- ============================================
-- Importación de Códigos ICD-10
-- Generado desde icds.csv
-- Total de registros: ${data.length}
-- ============================================

-- Limpiar tabla existente (opcional, descomentar si quieres reemplazar)
-- TRUNCATE TABLE icd10 CASCADE;

-- Insertar códigos ICD-10
INSERT INTO icd10 (icd10_id, codigo, descripcion, descripcion_completa, categoria, activo, created_at, updated_at)
VALUES

`;

const values = [];
data.forEach((row, index) => {
  const codigo = (row.codigo || '').trim();
  const nombre = (row.nombre || '').trim();
  const grupo = (row.grupo || '').trim();
  const estado = (row.estado || '').trim().toLowerCase();
  
  if (codigo && nombre) {
    const activo = estado === 'activo';
    const descripcion = nombre;
    const descripcionCompleta = nombre; // Puedes usar nombre completo si existe
    const categoria = grupo || null;
    
    // Escapar comillas simples para SQL
    const descripcionEscaped = descripcion.replace(/'/g, "''");
    const descripcionCompletaEscaped = descripcionCompleta.replace(/'/g, "''");
    const categoriaEscaped = categoria ? categoria.replace(/'/g, "''") : null;
    
    const uuid = generateUUID();
    values.push(`('${uuid}', '${codigo}', '${descripcionEscaped}', '${descripcionCompletaEscaped}', ${categoriaEscaped ? `'${categoriaEscaped}'` : 'NULL'}, ${activo}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`);
  }
});

sql += values.join(',\n');
sql += `
ON CONFLICT (codigo) DO UPDATE SET
  descripcion = EXCLUDED.descripcion,
  descripcion_completa = EXCLUDED.descripcion_completa,
  categoria = EXCLUDED.categoria,
  activo = EXCLUDED.activo,
  updated_at = CURRENT_TIMESTAMP;

-- ============================================
-- Resumen
-- ============================================
-- Total de códigos insertados/actualizados: ${values.length}
-- Códigos activos: ${values.filter((_, i) => data[i]?.estado?.toLowerCase() === 'activo').length}
-- Códigos inactivos: ${values.filter((_, i) => data[i]?.estado?.toLowerCase() !== 'activo').length}
`;

// Guardar archivo SQL
const outputPath = path.join(__dirname, '../../database/import-icd10.sql');
fs.writeFileSync(outputPath, sql, 'utf8');

console.log(`\n✅ Script SQL generado exitosamente!`);
console.log(`📁 Archivo guardado en: ${outputPath}`);
console.log(`\n📊 Resumen:`);
console.log(`   - Total de registros procesados: ${data.length}`);
console.log(`   - Registros válidos (con código y nombre): ${values.length}`);
console.log(`   - Códigos activos: ${values.filter((_, i) => data[i]?.estado?.toLowerCase() === 'activo').length}`);
console.log(`   - Códigos inactivos: ${values.filter((_, i) => data[i]?.estado?.toLowerCase() !== 'activo').length}`);
console.log(`\n💡 Para ejecutar el script:`);
console.log(`   1. Abre el SQL Editor en Supabase`);
console.log(`   2. Copia y pega el contenido de database/import-icd10.sql`);
console.log(`   3. Ejecuta el script`);

