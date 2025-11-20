# 🚂 Guía de Despliegue en Railway

Esta guía te ayudará a desplegar tanto el backend como el frontend de Concierge en Railway.

## 📋 Prerequisitos

1. Cuenta en [Railway](https://railway.app) (puedes usar GitHub para registrarte)
2. Repositorio en GitHub (recomendado) o puedes conectar directamente desde tu máquina
3. Base de datos Supabase configurada (o usar PostgreSQL de Railway)

## 🎯 Opción 1: Desplegar con Railway CLI (Recomendado)

### 1. Instalar Railway CLI

```bash
# Método recomendado: usando npm (funciona en todos los sistemas)
npm install -g @railway/cli

# Verificar instalación
railway --version
```

**Nota**: Si el script de instalación oficial no funciona, siempre puedes usar npm que es más confiable.

### 2. Iniciar sesión

```bash
railway login
```

Esto abrirá tu navegador para autenticarte con Railway.

### 3. Crear un nuevo proyecto

```bash
railway init
```

Esto creará un nuevo proyecto en Railway y lo conectará con tu directorio actual.

### 4. Desplegar Backend

```bash
cd backend
railway up
```

Railway detectará automáticamente que es un proyecto Node.js y usará el `Dockerfile` si existe.

### 5. Desplegar Frontend (en otro servicio)

En Railway Dashboard:
1. Haz clic en "New Service"
2. Selecciona "GitHub Repo" y elige tu repositorio
3. Selecciona la carpeta `frontend`
4. Railway detectará automáticamente que es un proyecto Vite/React

## 🎯 Opción 2: Desplegar desde Railway Dashboard

### ⚠️ IMPORTANTE: Necesitas Crear DOS Servicios Separados

Railway requiere que crees **servicios separados** para backend y frontend. Cada uno debe tener su propio Root Directory.

### Paso 1: Crear Proyecto

1. Ve a [railway.app](https://railway.app)
2. Haz clic en "New Project"
3. Selecciona "Deploy from GitHub repo" (o "Empty Project" si prefieres)

### Paso 2: Crear Servicio del Backend

1. En el proyecto, haz clic en **"New Service"**
2. Selecciona **"GitHub Repo"** y elige tu repositorio
3. **IMPORTANTE**: Busca **"Root Directory"** o **"Show Advanced Options"**
   - Si no lo ves, haz clic en "Configure" o "Show Advanced Options"
4. En **"Root Directory"**, escribe: `backend` (sin comillas, sin `/` al inicio)
   - ⚠️ **Este paso es CRÍTICO** - Si no configuras el Root Directory, Railway intentará ejecutar `npm run build` desde la raíz y fallará
5. Railway detectará automáticamente:
   - Tipo: Node.js
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start:prod`
6. Si Railway no detecta automáticamente, configura manualmente:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:prod`
7. Haz clic en **"Deploy"** o **"Add Service"**

**📖 Consulta [RAILWAY_SERVICIOS_SEPARADOS.md](./RAILWAY_SERVICIOS_SEPARADOS.md) para instrucciones detalladas**

### Paso 4: Configurar Variables de Entorno del Backend

En el servicio del backend, ve a "Variables" y agrega:

```env
# Base de Datos (Supabase)
DB_HOST=tu-host-supabase.supabase.co
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu-password
DB_DATABASE=postgres

# JWT
JWT_SECRET=tu-jwt-secret-super-seguro

# CORS (URL del frontend en Railway)
FRONTEND_URL=https://tu-frontend.railway.app

# Puerto (Railway lo asigna automáticamente, pero puedes especificarlo)
PORT=3000

# Node Environment
NODE_ENV=production
```

### Paso 3: Crear Servicio del Frontend

1. En el **mismo proyecto**, haz clic en **"New Service"** nuevamente
2. Selecciona **"GitHub Repo"** y elige el **mismo repositorio**
3. **IMPORTANTE**: Busca **"Root Directory"** o **"Show Advanced Options"**
   - Si no lo ves, haz clic en "Configure" o "Show Advanced Options"
4. En **"Root Directory"**, escribe: `frontend` (sin comillas, sin `/` al inicio)
   - ⚠️ **Este paso es CRÍTICO** - Si no configuras el Root Directory, Railway intentará ejecutar `npm run build` desde la raíz y fallará
5. Railway detectará automáticamente:
   - Tipo: Node.js (Vite)
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run preview`
6. Si Railway no detecta automáticamente, configura manualmente:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run preview`
7. Haz clic en **"Deploy"** o **"Add Service"**

**📖 Consulta [RAILWAY_SERVICIOS_SEPARADOS.md](./RAILWAY_SERVICIOS_SEPARADOS.md) para instrucciones detalladas**

### Paso 5: Configurar Variables de Entorno del Frontend

En el servicio del frontend, ve a "Variables" y agrega:

```env
# URL del Backend (usa la URL pública del servicio backend de Railway)
VITE_API_URL=https://tu-backend.railway.app

# Node Environment
NODE_ENV=production
```

### Paso 6: Actualizar Frontend para usar la URL del Backend

Railway asigna URLs automáticamente. Necesitas actualizar el frontend para usar la variable de entorno:

1. En `frontend/src/services/api.ts`, asegúrate de que use `import.meta.env.VITE_API_URL`
2. O configura el proxy en `vite.config.ts` para producción

## 🔧 Configuración Adicional

### Usar PostgreSQL de Railway (Opcional)

Si prefieres usar PostgreSQL de Railway en lugar de Supabase:

1. En Railway Dashboard, haz clic en "New" → "Database" → "PostgreSQL"
2. Railway creará automáticamente las variables de entorno:
   - `DATABASE_URL`
   - `PGHOST`
   - `PGPORT`
   - `PGUSER`
   - `PGPASSWORD`
   - `PGDATABASE`

3. Actualiza las variables de entorno del backend para usar estas variables

### Configurar Dominio Personalizado

1. En el servicio (backend o frontend), ve a "Settings"
2. Haz clic en "Generate Domain" para obtener un dominio `.railway.app`
3. O configura un dominio personalizado en "Custom Domain"

## 📝 Estructura del Proyecto en Railway

```
Proyecto: concierge
├── Servicio 1: backend
│   ├── Root Directory: backend
│   ├── Build Command: npm install && npm run build
│   ├── Start Command: npm run start:prod
│   └── Variables de Entorno: (ver arriba)
│
└── Servicio 2: frontend
    ├── Root Directory: frontend
    ├── Build Command: npm install && npm run build
    ├── Start Command: npm run preview
    └── Variables de Entorno: (ver arriba)
```

## 🚀 Comandos Útiles de Railway CLI

```bash
# Ver logs en tiempo real
railway logs

# Ver variables de entorno
railway variables

# Agregar variable de entorno
railway variables set KEY=value

# Abrir shell en el contenedor
railway shell

# Ver estado del servicio
railway status
```

## 🔍 Verificar el Despliegue

### Backend
1. Visita `https://tu-backend.railway.app/health` (si tienes endpoint de health)
2. O prueba `https://tu-backend.railway.app/api/tickets` (requiere autenticación)

### Frontend
1. Visita la URL pública del servicio frontend
2. Deberías ver la aplicación React funcionando

## 🐛 Solución de Problemas

### Error: "Could not read package.json" o "ENOENT: no such file or directory"
- **Causa**: Railway está ejecutando comandos desde la raíz del proyecto en lugar de `backend/` o `frontend/`
- **Solución**: 
  1. Ve a Settings del servicio en Railway Dashboard
  2. Configura **Root Directory** como `backend` o `frontend` según corresponda
  3. Guarda y haz redeploy
  4. Consulta [RAILWAY_MONOREPO.md](./RAILWAY_MONOREPO.md) para más detalles

### Error: "Cannot find module"
- **Solución**: Asegúrate de que `package.json` tenga todas las dependencias listadas
- Verifica que el build se complete correctamente

### Error: "Port already in use"
- **Solución**: Railway asigna el puerto automáticamente. Usa `process.env.PORT` en tu código

### Error: "Database connection failed"
- **Solución**: 
  - Verifica las variables de entorno de la base de datos
  - Asegúrate de que la IP de Railway esté en la whitelist de Supabase (si usas Supabase)

### Frontend no se conecta al backend
- **Solución**: 
  - Verifica que `VITE_API_URL` esté configurada correctamente
  - Asegúrate de que el backend esté desplegado y funcionando
  - Revisa los logs del frontend para ver errores de CORS

### Build falla
- **Solución**: 
  - Revisa los logs de build en Railway Dashboard
  - Asegúrate de que todas las dependencias estén en `package.json`
  - Verifica que no haya errores de TypeScript

## 📊 Monitoreo

Railway proporciona:
- **Logs en tiempo real**: Ve a "Deployments" → Selecciona un deployment → "View Logs"
- **Métricas**: CPU, Memoria, Red en tiempo real
- **Alertas**: Configura alertas para errores o uso excesivo

## 💰 Pricing

Railway ofrece:
- **Plan Hobby**: $5/mes con $5 de créditos gratis
- **Plan Pro**: $20/mes con más recursos
- **Pay-as-you-go**: Solo pagas por lo que usas

## 🔐 Seguridad

1. **Variables de Entorno**: Nunca commitees variables sensibles
2. **HTTPS**: Railway proporciona HTTPS automáticamente
3. **CORS**: Configura correctamente los orígenes permitidos en el backend

## 📚 Recursos Adicionales

- [Documentación de Railway](https://docs.railway.app)
- [Railway Discord](https://discord.gg/railway)
- [Ejemplos de Railway](https://github.com/railwayapp/examples)

## ✅ Checklist de Despliegue

- [ ] Backend desplegado y funcionando
- [ ] Variables de entorno del backend configuradas
- [ ] Frontend desplegado y funcionando
- [ ] Variables de entorno del frontend configuradas
- [ ] Base de datos conectada
- [ ] CORS configurado correctamente
- [ ] Dominios personalizados configurados (opcional)
- [ ] Logs verificados sin errores
- [ ] Pruebas de funcionalidad completadas

¡Listo! Tu aplicación debería estar funcionando en Railway. 🎉

