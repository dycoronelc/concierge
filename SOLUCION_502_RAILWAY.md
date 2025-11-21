# 🔧 Solución Error 502 Bad Gateway en Railway

El error **502 Bad Gateway** significa que Railway no puede comunicarse con tu aplicación. Sigue estos pasos para diagnosticar y solucionar.

## ⚠️ Problema Específico: 502 sin Errores en Logs

Si ves **502 Bad Gateway** pero **NO hay errores** en Build/Deploy logs, el problema es que:

1. **El servicio se inicia pero crashea silenciosamente** (probablemente al conectar a la DB)
2. **El servicio no está escuchando en el puerto correcto**
3. **TypeORM está fallando al inicializar** pero el error no se muestra

### Solución Inmediata:

1. **Busca en los logs el mensaje de inicio:**
   ```
   🚀 Concierge API running on: http://0.0.0.0:XXXX
   ```
   Si **NO ves este mensaje**, el backend no se está iniciando correctamente.

2. **Busca errores de TypeORM:**
   ```
   Unable to connect to the database
   ```
   Si ves esto, el problema es la conexión a la base de datos.

3. **Verifica que todas las variables de entorno estén configuradas:**
   - `DB_HOST`
   - `DB_USERNAME`
   - `DB_PASSWORD`
   - `DB_PORT`
   - `DB_DATABASE`

## 🔍 Paso 1: Verificar Logs en Railway

### Para el Backend:
1. Ve a Railway Dashboard → tu proyecto → servicio **Backend**
2. Haz clic en la pestaña **"Deployments"**
3. Selecciona el deployment más reciente
4. Haz clic en **"View Logs"**
5. Busca errores como:
   - `Unable to connect to the database`
   - `Error: listen EADDRINUSE`
   - `Cannot find module`
   - Cualquier error de TypeScript o Node.js

### Para el Frontend:
1. Ve a Railway Dashboard → tu proyecto → servicio **Frontend**
2. Haz clic en la pestaña **"Deployments"**
3. Selecciona el deployment más reciente
4. Haz clic en **"View Logs"**
5. Busca errores de build o runtime

## ✅ Paso 2: Verificar Variables de Entorno

### Backend - Variables Requeridas:
```env
DB_HOST=aws-1-us-east-1.pooler.supabase.com
DB_USERNAME=postgres.hofhdghzixrryzxelbfb
DB_PASSWORD=tu-password-de-supabase
DB_PORT=6543
DB_DATABASE=postgres
JWT_SECRET=tu-secret-key-super-segura
JWT_EXPIRES_IN=24h
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://concierge-front-production.up.railway.app
```

### Frontend - Variables Requeridas:
```env
VITE_API_URL=https://concierge-back-production.up.railway.app
```

**⚠️ IMPORTANTE:** 
- Asegúrate de que `VITE_API_URL` esté configurada en el frontend
- Asegúrate de que `FRONTEND_URL` en el backend coincida exactamente con la URL del frontend (sin trailing slash `/`)

## 🔧 Paso 3: Verificar que el Backend Esté Escuchando

El backend debe estar escuchando en el puerto que Railway asigna (variable `PORT`). Verifica en los logs que veas:

```
🚀 Concierge API running on: http://0.0.0.0:3000
```

Si no ves este mensaje, el backend no se inició correctamente.

## 🔧 Paso 4: Verificar Health Check del Backend

Intenta acceder directamente al endpoint de health:

```
https://concierge-back-production.up.railway.app/health
```

**Si funciona:** Deberías ver un JSON como:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Si no funciona:** El backend no está respondiendo. Revisa los logs.

## 🔧 Paso 5: Verificar el Frontend

El frontend debe estar sirviendo los archivos estáticos. Verifica:

1. **Build exitoso:** Los logs deben mostrar `✓ built in X.XXs`
2. **Servidor corriendo:** Debe mostrar que `vite preview` está corriendo
3. **Puerto correcto:** Debe usar la variable `PORT` de Railway

## 🐛 Problemas Comunes y Soluciones

### Problema 1: Backend no inicia - Error de Base de Datos

**Síntomas:**
- Logs muestran: `Unable to connect to the database`
- `TypeError [ERR_INVALID_IP_ADDRESS]: Invalid IP address: undefined`

**Solución:**
1. Verifica que todas las variables de base de datos estén configuradas
2. Verifica que `DB_HOST` no esté vacío
3. Elimina `DB_HOST_IPV6` si está causando problemas
4. Verifica que las credenciales sean correctas

### Problema 2: Backend crashea al iniciar

**Síntomas:**
- El servicio se reinicia constantemente
- Logs muestran errores de TypeScript o módulos faltantes

**Solución:**
1. Verifica que el build se completó correctamente
2. Revisa los logs del build para errores de compilación
3. Asegúrate de que `NODE_ENV=production` esté configurado

### Problema 3: Frontend muestra 502

**Síntomas:**
- El frontend muestra 502 al cargar
- Los logs muestran errores de `vite preview`

**Solución:**
1. Verifica que `VITE_API_URL` esté configurada
2. Verifica que el build se completó: `npm run build` debe funcionar
3. Asegúrate de que `vite preview` esté instalado (viene con Vite)

### Problema 4: Puerto incorrecto

**Síntomas:**
- El servicio inicia pero Railway no puede conectarse
- Logs muestran que escucha en un puerto diferente

**Solución:**
1. El backend debe usar `process.env.PORT || 3000`
2. El frontend debe usar `${PORT:-4173}` en el comando de inicio
3. Railway asigna el puerto automáticamente, no lo configures manualmente

### Problema 5: CORS bloqueando requests

**Síntomas:**
- El frontend carga pero no puede hacer requests al backend
- Errores en la consola del navegador sobre CORS

**Solución:**
1. Verifica que `FRONTEND_URL` en el backend sea exactamente: `https://concierge-front-production.up.railway.app`
2. Sin trailing slash `/` al final
3. Reinicia el backend después de cambiar `FRONTEND_URL`

## 📋 Checklist de Verificación

- [ ] Backend muestra "Concierge API running" en los logs
- [ ] Backend responde en `/health`
- [ ] Frontend build se completó sin errores
- [ ] `VITE_API_URL` está configurada en el frontend
- [ ] `FRONTEND_URL` está configurada en el backend
- [ ] Todas las variables de base de datos están configuradas
- [ ] No hay errores en los logs de Railway
- [ ] Los servicios están en estado "Running" (no "Failed")

## 🚀 Pasos de Recuperación Rápida

1. **Revisa los logs** de ambos servicios
2. **Verifica las variables de entorno** (especialmente `VITE_API_URL` y `FRONTEND_URL`)
3. **Haz redeploy** de ambos servicios:
   - Ve a Deployments → Haz clic en "Redeploy"
4. **Espera 2-3 minutos** para que los servicios se reinicien
5. **Prueba el health check** del backend: `/health`
6. **Prueba el frontend** en el navegador

## 💡 Consejos Adicionales

- **Railway puede tardar 1-2 minutos** en iniciar los servicios después del deploy
- **Los logs se actualizan en tiempo real** - espera unos segundos si no ves nada
- **Si un servicio falla**, Railway lo reiniciará automáticamente (hasta 10 veces según la configuración)
- **Verifica siempre los logs más recientes** - haz clic en el deployment más nuevo

## 📞 Si el Problema Persiste

1. **Copia los logs completos** de ambos servicios
2. **Verifica el estado de Supabase** (que no esté pausado)
3. **Prueba el backend localmente** con las mismas variables de entorno
4. **Verifica que las URLs de Railway sean correctas** (sin typos)

