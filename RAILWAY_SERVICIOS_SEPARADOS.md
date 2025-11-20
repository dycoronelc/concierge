# 🚂 Crear Servicios Separados en Railway

## ⚠️ Importante: Necesitas DOS Servicios

Railway requiere que crees **servicios separados** para backend y frontend. No puedes desplegar ambos desde un solo servicio.

## 📋 Pasos para Crear los Servicios

### Paso 1: Crear el Servicio del Backend

1. Ve a [railway.app](https://railway.app) e inicia sesión
2. Si no tienes un proyecto, haz clic en **"New Project"**
3. Si ya tienes un proyecto, haz clic en **"New Service"**
4. Selecciona **"GitHub Repo"**
5. Elige tu repositorio de GitHub
6. **IMPORTANTE**: En la sección de configuración, busca **"Root Directory"**
7. Escribe: `backend` (sin comillas, sin `/` al inicio)
8. Railway detectará automáticamente que es un proyecto Node.js/NestJS
9. Haz clic en **"Deploy"** o **"Add Service"**

### Paso 2: Crear el Servicio del Frontend

1. En el **mismo proyecto**, haz clic en **"New Service"** nuevamente
2. Selecciona **"GitHub Repo"**
3. Elige el **mismo repositorio** de GitHub
4. **IMPORTANTE**: En la sección de configuración, busca **"Root Directory"**
5. Escribe: `frontend` (sin comillas, sin `/` al inicio)
6. Railway detectará automáticamente que es un proyecto Vite/React
7. Haz clic en **"Deploy"** o **"Add Service"**

## 🎯 Estructura Final en Railway

Tu proyecto en Railway debería verse así:

```
Proyecto: concierge
├── Servicio 1: backend
│   ├── Root Directory: backend
│   ├── Build Command: npm install && npm run build
│   ├── Start Command: npm run start:prod
│   └── Variables de Entorno: (DB_HOST, JWT_SECRET, etc.)
│
└── Servicio 2: frontend
    ├── Root Directory: frontend
    ├── Build Command: npm install && npm run build
    ├── Start Command: npm run preview
    └── Variables de Entorno: (VITE_API_URL)
```

## 🔧 Si Ya Creaste un Servicio Incorrecto

Si ya creaste un servicio sin Root Directory o con la configuración incorrecta:

### Opción A: Eliminar y Recrear (Recomendado)

1. Ve al servicio que está mal configurado
2. Haz clic en **"Settings"**
3. Desplázate hasta abajo y haz clic en **"Delete Service"**
4. Crea un nuevo servicio siguiendo los pasos de arriba

### Opción B: Editar el Servicio Existente

1. Ve al servicio
2. Haz clic en **"Settings"**
3. Busca **"Source"** o **"Root Directory"**
4. Cambia el Root Directory a `backend` o `frontend` según corresponda
5. Guarda los cambios
6. Haz clic en **"Redeploy"** en la pestaña "Deployments"

## 📸 Dónde Encontrar Root Directory al Crear Servicio

Cuando creas un nuevo servicio desde GitHub:

1. Selecciona tu repositorio
2. Railway mostrará una pantalla de configuración
3. Busca una sección que diga:
   - **"Configure Service"** o
   - **"Settings"** o
   - **"Advanced Options"**
4. Ahí encontrarás el campo **"Root Directory"**
5. Si no lo ves inmediatamente, haz clic en **"Show Advanced Options"** o **"Configure"**

## ✅ Verificación

Después de crear ambos servicios:

1. Ve a tu proyecto en Railway
2. Deberías ver **2 servicios** listados
3. Cada servicio debe tener su Root Directory configurado:
   - Servicio 1: `backend`
   - Servicio 2: `frontend`

## 🎯 Configuración Manual de Build Commands

Si Railway no detecta automáticamente los comandos, puedes configurarlos manualmente:

### Para el Backend:
1. Ve a Settings del servicio backend
2. Busca **"Build & Deploy"** o **"Deploy"**
3. Configura:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:prod`

### Para el Frontend:
1. Ve a Settings del servicio frontend
2. Busca **"Build & Deploy"** o **"Deploy"**
3. Configura:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run preview`

## 🔍 Verificar que Está Configurado Correctamente

1. Ve a cada servicio
2. Haz clic en **"Settings"**
3. Verifica que **"Root Directory"** sea:
   - `backend` para el servicio backend
   - `frontend` para el servicio frontend
4. Verifica los Build/Start Commands

## 💡 Tip: Usar Railway CLI

Si prefieres usar la CLI, puedes crear servicios desde la terminal:

```powershell
# Crear servicio para backend
cd backend
railway init
railway up

# En otra terminal o después, crear servicio para frontend
cd frontend
railway init
railway up
```

Pero asegúrate de que estén en el mismo proyecto de Railway.

## 🐛 Problemas Comunes

### "No veo la opción Root Directory"
- **Solución**: Haz clic en "Show Advanced Options" o "Configure" cuando creas el servicio
- O ve a Settings después de crear el servicio

### "Solo puedo crear un servicio"
- **Solución**: Puedes crear múltiples servicios en el mismo proyecto. Haz clic en "New Service" nuevamente

### "El Root Directory no se guarda"
- **Solución**: Asegúrate de hacer clic en "Save" o "Deploy" después de configurarlo
- Verifica que no tenga `/` al inicio (debe ser `backend`, no `/backend`)

## 📝 Resumen Rápido

1. **Crea DOS servicios separados** en el mismo proyecto
2. **Servicio 1**: Root Directory = `backend`
3. **Servicio 2**: Root Directory = `frontend`
4. Cada servicio se desplegará independientemente
5. Configura las variables de entorno en cada servicio

¡Eso es todo! Con esta configuración, Railway sabrá exactamente dónde ejecutar los comandos para cada servicio.

