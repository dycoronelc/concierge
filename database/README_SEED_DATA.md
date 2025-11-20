# 📊 Script de Datos de Prueba - Policía de Panamá

## 📋 Descripción

Este script genera datos de prueba basados en el archivo Excel `Planillas-Policia.xlsx` que contiene información de colaboradores de la Policía Nacional de Panamá.

## 🚀 Cómo Usar

### 1. Generar el Script SQL

```bash
cd backend
node scripts/seed-data.js
```

Esto leerá el archivo Excel y generará `database/seed-data.sql` con todos los datos de prueba.

### 2. Ejecutar en Supabase

1. Abre el **SQL Editor** en Supabase
2. Copia todo el contenido de `database/seed-data.sql`
3. Pega en el editor
4. Haz clic en **"Run"** o presiona `Ctrl+Enter`

## 📦 Datos Generados

El script genera los siguientes datos de prueba:

- **50 Pacientes**: Colaboradores de la Policía Nacional extraídos del Excel
- **8 Prestadores**: Hospitales y clínicas principales de Panamá
- **30 Tickets**: Solicitudes de atención médica con diferentes estados
- **15 Eventos Clínicos**: Eventos médicos asociados a pacientes
- **20 Encuentros**: Encuentros clínicos con prestadores
- **10 Servicios de Enfermería**: Visitas de enfermería a domicilio
- **8 Solicitudes de Transporte**: Traslados médicos
- **12 Solicitudes de Estudios**: Estudios clínicos solicitados

## 📝 Notas Importantes

- Los datos se generan con fechas aleatorias en los últimos 60-90 días
- Los pacientes usan cédulas reales del Excel (formato panameño: 8-xxx-xxxx)
- Los emails se generan automáticamente con el formato: `nombre.apellido@policia.gob.pa`
- Los conflictos de cédulas duplicadas se manejan con `ON CONFLICT DO NOTHING`
- Las relaciones entre tablas se crean aleatoriamente pero de forma coherente

## 🔄 Regenerar Datos

Si necesitas regenerar los datos:

1. Ejecuta nuevamente: `node scripts/seed-data.js`
2. Esto sobrescribirá el archivo `seed-data.sql`
3. Ejecuta el nuevo script en Supabase

## ⚠️ Advertencia

- Este script está diseñado para **desarrollo y demostración**
- No ejecutes en producción sin revisar y ajustar los datos
- Los datos de prueba incluyen información real de colaboradores (solo nombres y cédulas)
- Considera la privacidad y seguridad de los datos

## 📊 Estructura del Excel

El script espera las siguientes columnas en el Excel:

- `Nombre`: Nombre del colaborador
- `Apellido`: Apellido del colaborador
- `Cédula`: Cédula de identidad (formato panameño)
- `Cargo`: Cargo o puesto
- `Teléfono`: Número de teléfono (opcional)
- `Email`: Correo electrónico (opcional, se genera si no existe)

## 🛠️ Personalización

Puedes modificar `backend/scripts/seed-data.js` para:

- Cambiar la cantidad de registros generados
- Ajustar las fechas de los datos
- Modificar las descripciones de tickets
- Agregar más prestadores
- Personalizar los diagnósticos ICD-10

