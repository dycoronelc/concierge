# 🚂 Configuración de Railway para Monorepo

## ⚠️ Problema Común

Si ves este error:
```
npm error enoent Could not read package.json: Error: ENOENT: no such file or directory
```

**Causa**: Railway está intentando ejecutar comandos desde la raíz del proyecto, pero tu proyecto es un monorepo con `backend/` y `frontend/` como carpetas separadas.

## ✅ Solución: Configurar Root Directory

Railway necesita saber en qué carpeta está cada servicio. Debes configurar el **Root Directory** para cada servicio.

## 📋 Pasos Detallados

### Para el Backend:

1. En Railway Dashboard, ve a tu servicio del backend
2. Haz clic en **"Settings"** (Configuración)
3. Busca la sección **"Source"** o **"Root Directory"**
4. En **"Root Directory"**, escribe: `backend`
5. Guarda los cambios
6. Railway ahora ejecutará todos los comandos desde `backend/`

### Para el Frontend:

1. En Railway Dashboard, ve a tu servicio del frontend
2. Haz clic en **"Settings"** (Configuración)
3. Busca la sección **"Source"** o **"Root Directory"**
4. En **"Root Directory"**, escribe: `frontend`
5. Guarda los cambios
6. Railway ahora ejecutará todos los comandos desde `frontend/`

## 🔧 Configuración Manual de Build Commands

Si Railway no detecta automáticamente los comandos, configúralos manualmente:

### Backend:
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run start:prod`

### Frontend:
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run preview`

## 📍 Dónde Configurar en Railway Dashboard

1. Ve a tu proyecto en Railway
2. Selecciona el servicio (backend o frontend)
3. Haz clic en el tab **"Settings"**
4. Busca **"Source"** o **"Root Directory"**
5. Cambia el valor a `backend` o `frontend` según corresponda
6. Haz clic en **"Save"**

## 🎯 Verificación

Después de configurar el Root Directory:

1. Ve a **"Deployments"**
2. Haz clic en **"Redeploy"** o crea un nuevo deployment
3. Verifica los logs - deberías ver:
   ```
   Installing dependencies...
   Running build command...
   ```
4. El build debería completarse exitosamente

## 🐛 Si Sigue Fallando

### Verificar que el Root Directory esté configurado:

1. En Railway Dashboard → Settings → Source
2. Verifica que el Root Directory sea exactamente `backend` o `frontend` (sin `/` al inicio)
3. No debe ser `/backend` o `./backend`

### Verificar los logs:

1. Ve a "Deployments" → Selecciona el último deployment
2. Haz clic en "View Logs"
3. Busca el error específico
4. Verifica que los comandos se estén ejecutando desde la carpeta correcta

### Recrear el servicio:

Si nada funciona, puedes:
1. Eliminar el servicio actual
2. Crear un nuevo servicio
3. **Asegurarte de configurar el Root Directory ANTES del primer deployment**

## 📝 Estructura Esperada

Railway debería ver esta estructura:

```
tu-repositorio/
├── backend/          ← Root Directory para servicio backend
│   ├── package.json
│   ├── src/
│   └── ...
├── frontend/         ← Root Directory para servicio frontend
│   ├── package.json
│   ├── src/
│   └── ...
└── ...
```

## ✅ Checklist

- [ ] Root Directory del backend configurado como `backend`
- [ ] Root Directory del frontend configurado como `frontend`
- [ ] Build Command configurado correctamente
- [ ] Start Command configurado correctamente
- [ ] Variables de entorno configuradas
- [ ] Deployment exitoso sin errores

## 💡 Tip Pro

Puedes verificar la configuración actual ejecutando:

```bash
railway status
```

O desde Railway Dashboard, ve a Settings y verifica que todo esté configurado correctamente.

