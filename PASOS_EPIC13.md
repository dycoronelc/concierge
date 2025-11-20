# 📋 Pasos para Implementar y Probar EPIC 13: Psicología y Apoyo Emocional

## ✅ Estado Actual
La EPIC 13 ha sido completamente implementada en el código:
- ✅ Esquema de base de datos creado
- ✅ Entidades TypeORM creadas
- ✅ Módulo NestJS implementado (service, controller, module)
- ✅ Página frontend creada con 4 tabs
- ✅ API endpoints agregados
- ✅ Navegación configurada

## 🔧 Pasos para Ejecutar

### 1. Actualizar la Base de Datos

Ejecuta el esquema actualizado en Supabase:

1. Abre el **SQL Editor** en Supabase
2. Copia y ejecuta el contenido de `database/schema.sql` (o solo la sección de EPIC 13 si ya tienes el resto)
3. Verifica que las tablas se hayan creado:
   - `consultas_psicologicas`
   - `sesiones_psicologicas`
   - `seguimiento_emocional`
   - `familiares_cuidadores`

### 2. Cargar Datos de Prueba

1. Abre el **SQL Editor** en Supabase
2. Copia y ejecuta el contenido de `database/seed-psicologia.sql`
3. Verifica que se hayan creado los registros:
   ```sql
   SELECT COUNT(*) FROM consultas_psicologicas;
   SELECT COUNT(*) FROM sesiones_psicologicas;
   SELECT COUNT(*) FROM seguimiento_emocional;
   SELECT COUNT(*) FROM familiares_cuidadores;
   ```

### 3. Reiniciar el Backend

Si el backend está corriendo, reinícialo para que cargue el nuevo módulo:

```bash
cd backend
# Detén el servidor (Ctrl+C) y reinícialo
npm run start:dev
```

Verifica que no haya errores de compilación y que el módulo `PsicologiaModule` se haya cargado correctamente.

### 4. Verificar el Frontend

1. Asegúrate de que el frontend esté corriendo:
   ```bash
   cd frontend
   npm run dev
   ```

2. Inicia sesión en la aplicación

3. Navega al menú lateral y busca **"Psicología"** (icono de psicología 🧠)

4. Verifica que puedas ver:
   - Tab "Consultas": Lista de consultas psicológicas/psiquiátricas
   - Tab "Sesiones": Sesiones programadas y completadas
   - Tab "Seguimiento Emocional": Registros de estado de ánimo y escalas
   - Tab "Familiares/Cuidadores": Gestión de familiares

### 5. Probar Funcionalidades

#### Crear una Nueva Consulta:
1. Haz clic en "Nueva Consulta"
2. Selecciona un paciente
3. Elige tipo (Psicológica/Psiquiátrica) y modalidad (Presencial/Telefónica/Videollamada)
4. Completa los campos y guarda

#### Crear una Sesión:
1. Ve al tab "Sesiones"
2. Haz clic en "Nueva Sesión"
3. Asocia a una consulta (opcional)
4. Selecciona paciente, fecha, tipo de sesión
5. Guarda

#### Registrar Seguimiento Emocional:
1. Ve al tab "Seguimiento Emocional"
2. Haz clic en "Nuevo Seguimiento"
3. Selecciona paciente
4. Completa escalas (0-10) para ansiedad, depresión, estrés
5. Observa que se generen alertas automáticas si las escalas son ≥ 8

#### Agregar Familiar/Cuidador:
1. Ve al tab "Familiares/Cuidadores"
2. Selecciona un paciente del dropdown
3. Haz clic en "Agregar Familiar"
4. Completa los datos y guarda

## 🐛 Solución de Problemas

### Error: "Table does not exist"
- **Solución**: Asegúrate de haber ejecutado el esquema SQL completo en Supabase

### Error: "Module not found" en el backend
- **Solución**: Verifica que `PsicologiaModule` esté importado en `backend/src/app.module.ts`

### Error: "Route not found" en el frontend
- **Solución**: Verifica que la ruta `/psicologia` esté en `frontend/src/App.tsx`

### No aparecen datos en el frontend
- **Solución**: 
  1. Verifica que hayas ejecutado el script de datos de prueba
  2. Revisa la consola del navegador para errores
  3. Verifica que el backend esté corriendo y respondiendo

### Alertas no se generan automáticamente
- **Solución**: Las alertas se generan cuando:
  - Escala de ansiedad ≥ 8
  - Escala de depresión ≥ 8
  - Escala de estrés ≥ 8
  - Estado de ánimo es "Deprimido" o "Muy_Negativo"

## 📊 Datos de Prueba Incluidos

El script `seed-psicologia.sql` crea:
- **18 Consultas** psicológicas/psiquiátricas con diferentes modalidades
- **15 Sesiones** (individuales, grupales, familiares)
- **25 Seguimientos** emocionales con escalas variadas
- **30 Familiares/Cuidadores** asociados a pacientes

## 🎯 Próximos Pasos

Una vez que hayas probado la funcionalidad:
1. Verifica que las alertas críticas se muestren correctamente
2. Prueba crear nuevos registros desde el frontend
3. Verifica la integración con pacientes, eventos y tickets existentes
4. Considera agregar más funcionalidades según las necesidades del negocio

## 📝 Notas Importantes

- Las alertas críticas se generan automáticamente en el backend cuando se crea un seguimiento emocional
- Los familiares/cuidadores están asociados a pacientes específicos
- Las sesiones pueden ser individuales, grupales o familiares
- Las consultas pueden ser psicológicas o psiquiátricas
- Las modalidades soportadas son: Presencial, Telefónica, Videollamada

