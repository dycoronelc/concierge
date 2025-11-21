# 🚀 Pasos Post-Deployment en Railway

> ⚠️ **Si ves error 502 Bad Gateway**, consulta [SOLUCION_502_RAILWAY.md](./SOLUCION_502_RAILWAY.md) para diagnóstico y solución.

Una vez que ambos servicios (backend y frontend) están desplegados en Railway, sigue estos pasos para configurar todo correctamente.

## 📋 Paso 1: Obtener las URLs de tus Servicios

1. Ve a tu proyecto en [Railway Dashboard](https://railway.app/dashboard)
2. Para cada servicio (backend y frontend):
   - Haz clic en el servicio
   - Ve a la pestaña **"Settings"**
   - Busca **"Domains"** o **"Generate Domain"**
   - Copia la URL generada (ejemplo: `https://concierge-backend-xxxxx.railway.app`)

**Anota estas URLs:**
- Backend URL: `https://concierge-backend-xxxxx.railway.app`
- Frontend URL: `https://concierge-frontend-xxxxx.railway.app`

## 🔌 Configuración de Puertos en Railway

**IMPORTANTE:** Railway automáticamente asigna puertos a tus servicios. Cuando Railway te pregunte por el puerto:

### Para el Backend:
- **Puerto:** Deja el campo vacío o pon `3000` (Railway lo manejará automáticamente)
- La aplicación ya está configurada para usar `process.env.PORT` que Railway proporciona

### Para el Frontend:
- **Puerto:** Deja el campo vacío o pon `4173` (Railway lo manejará automáticamente)
- La aplicación está configurada para usar `PORT` que Railway proporciona

**Nota:** Railway automáticamente expone tus servicios a través de URLs públicas, no necesitas configurar puertos manualmente.

## ⚙️ Paso 2: Configurar Variables de Entorno del Backend

1. En Railway, selecciona el servicio del **Backend**
2. Ve a la pestaña **"Variables"**
3. Agrega las siguientes variables de entorno:

### Variables Requeridas:

```env
# Base de Datos (Supabase) - ⚠️ OBLIGATORIO
# Opción 1: Conexión directa (recomendado si funciona)
DB_HOST=db.xxxxx.supabase.co
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu-password-de-supabase
DB_DATABASE=postgres

# Opción 2: Usar Pooler (RECOMENDADO para Railway)
DB_HOST=aws-1-us-east-1.pooler.supabase.com
DB_USERNAME=postgres.xxxxx  # Formato: postgres.PROJECT_REF
DB_PORT=5432  # Puerto del pooler: 5432 (transaction mode) o 6543 (session mode)
# NOTA: 
# - Puerto 5432: Transaction mode (recomendado para TypeORM, abre/cierra conexiones)
# - Puerto 6543: Session mode (mantiene sesión abierta, mejor para muchas conexiones)
# - No uses DB_HOST_IPV6 con pooler, Railway puede no tener soporte IPv6

# Opción 3: IP IPv6 directa (NO RECOMENDADO para Railway)
# Railway puede no tener soporte IPv6 habilitado, causando error ENETUNREACH
# DB_HOST_IPV6=2600:1f18:2e13:9d3a:4eed:6b96:4d6d:4207
# Solo usar si Railway tiene IPv6 habilitado y la conexión directa falla
```

**⚠️ IMPORTANTE:** Si `DB_HOST` no está configurado, verás el error:
```
TypeError [ERR_INVALID_IP_ADDRESS]: Invalid IP address: undefined
```

Asegúrate de configurar **TODAS** las variables de base de datos antes de hacer deploy.

# JWT
JWT_SECRET=tu-secret-key-super-segura-cambiar-en-produccion
JWT_EXPIRES_IN=24h

# Servidor
PORT=3000
NODE_ENV=production

# CORS - URL del Frontend
FRONTEND_URL=https://concierge-frontend-xxxxx.railway.app
```

**Nota:** 
- Reemplaza `xxxxx` con los valores reales de tu proyecto Supabase
- Railway puede proporcionar automáticamente `RAILWAY_PUBLIC_DOMAIN` si configuras un dominio público, pero es mejor usar `FRONTEND_URL` explícitamente

### Cómo obtener las credenciales de Supabase:

**Opción 1: Conexión Directa (Recomendado)**
1. Ve a tu proyecto en [Supabase Dashboard](https://app.supabase.com)
2. Ve a **Settings** → **Database**
3. Copia:
   - **Host:** `db.xxxxx.supabase.co` (en "Connection string")
   - **Password:** Tu contraseña de base de datos
   - **Port:** `5432`
   - **Database:** `postgres`

**Opción 2: Usar Pooler (Si la conexión directa falla)**
1. En Supabase Dashboard → **Settings** → **Database**
2. Busca la sección **"Connection Pooling"**
3. Copia:
   - **Host:** `aws-0-us-east-1.pooler.supabase.com` (o similar según tu región)
   - **Username:** `postgres.xxxxx` (formato: `postgres.PROJECT_REF`)
   - **Port:** `6543` (session mode) o `5432` (transaction mode)
   - **Password:** Tu contraseña de base de datos

**Opción 3: IP IPv6 Directa (Si hay problemas de DNS)**
1. Resuelve la IP IPv6 de tu hostname:
   ```bash
   # En Windows PowerShell:
   Resolve-DnsName -Name db.xxxxx.supabase.co -Type AAAA
   
   # O en Linux/Mac:
   dig AAAA db.xxxxx.supabase.co
   ```
2. Copia la IP IPv6 (ejemplo: `2600:1f18:2e13:9d3a:4eed:6b96:4d6d:4207`)
3. Configura `DB_HOST_IPV6` con esa IP

## ⚙️ Paso 3: Configurar Variables de Entorno del Frontend

1. En Railway, selecciona el servicio del **Frontend**
2. Ve a la pestaña **"Variables"**
3. Agrega la siguiente variable:

```env
VITE_API_URL=https://concierge-backend-xxxxx.railway.app
```

**Importante:** Reemplaza `xxxxx` con la URL real de tu backend en Railway.

## 🔄 Paso 4: Reiniciar los Servicios

Después de agregar las variables de entorno:

1. **Backend:**
   - Ve al servicio del backend
   - Haz clic en **"Deployments"**
   - Haz clic en **"Redeploy"** o espera a que se reinicie automáticamente

2. **Frontend:**
   - Ve al servicio del frontend
   - Haz clic en **"Deployments"**
   - Haz clic en **"Redeploy"** o espera a que se reinicie automáticamente

## ✅ Paso 5: Verificar que Todo Funcione

### 5.1 Verificar Backend

1. Abre en tu navegador: `https://concierge-backend-xxxxx.railway.app/health`
2. Deberías ver una respuesta JSON como:
   ```json
   {
     "status": "ok",
     "timestamp": "2024-01-01T00:00:00.000Z"
   }
   ```

### 5.2 Verificar Frontend

1. Abre en tu navegador: `https://concierge-frontend-xxxxx.railway.app`
2. Deberías ver la página de login de Concierge

### 5.3 Verificar Conexión Frontend-Backend

1. Abre la consola del navegador (F12)
2. Intenta hacer login con:
   - **Username:** `admin`
   - **Password:** `admin123`
3. Si hay errores de CORS, verifica que:
   - `FRONTEND_URL` en el backend esté configurada correctamente
   - La URL del frontend coincida exactamente (sin trailing slash)

## 🔧 Paso 6: Configurar Dominio Personalizado (Opcional)

Si quieres usar un dominio personalizado:

1. En Railway, ve a **Settings** → **Domains**
2. Agrega tu dominio personalizado
3. Configura los registros DNS según las instrucciones de Railway
4. Actualiza `FRONTEND_URL` en el backend con el nuevo dominio

## 🐛 Solución de Problemas

### Error: "Cannot connect to database" o "Invalid IP address: undefined"

**Solución:**
- **Verifica que `DB_HOST` esté configurado** en Railway → Variables
- Verifica que las credenciales de Supabase sean correctas
- Asegúrate de que `DB_HOST` no tenga `https://` o `http://` (solo el hostname: `db.xxxxx.supabase.co`)
- Verifica que el proyecto de Supabase no esté pausado
- Asegúrate de que todas las variables de base de datos estén configuradas:
  - `DB_HOST`
  - `DB_PORT`
  - `DB_USERNAME`
  - `DB_PASSWORD`
  - `DB_DATABASE`

### Error: "connect ENETUNREACH" con IPv6

**Solución:**
- **Railway puede no tener soporte IPv6 habilitado**
- **NO uses `DB_HOST_IPV6` con pooler** - siempre usa el hostname del pooler
- Si estás usando pooler, configura:
  ```env
  DB_HOST=aws-1-us-east-1.pooler.supabase.com
  DB_USERNAME=postgres.xxxxx
  DB_PORT=6543
  ```
- **Elimina `DB_HOST_IPV6`** de las variables de entorno si está causando problemas
- El código ahora prioriza el hostname sobre IPv6 directa para mejor compatibilidad

### Error: "CORS policy"

**Solución:**
- Verifica que `FRONTEND_URL` en el backend coincida exactamente con la URL del frontend
- Asegúrate de que no haya trailing slashes (`/`) al final
- Reinicia el servicio del backend después de cambiar `FRONTEND_URL`

### Error: "Failed to fetch" en el frontend

**Solución:**
- Verifica que `VITE_API_URL` esté configurada correctamente en el frontend
- Asegúrate de que la URL del backend sea accesible (prueba `/health`)
- Verifica que el backend esté corriendo (revisa los logs en Railway)

### El frontend muestra "localhost:3000" en las peticiones

**Solución:**
- Verifica que `VITE_API_URL` esté configurada en Railway
- Reinicia el servicio del frontend
- Limpia la caché del navegador (Ctrl+Shift+R)

### Error 500 en el backend

**Solución:**
- Revisa los logs del servicio en Railway
- Verifica que todas las variables de entorno estén configuradas
- Asegúrate de que la base de datos esté accesible

## 📊 Paso 7: Monitoreo y Logs

### Ver Logs en Railway:

1. Ve al servicio en Railway
2. Haz clic en la pestaña **"Deployments"**
3. Selecciona el deployment más reciente
4. Haz clic en **"View Logs"**

### Verificar Estado de los Servicios:

- **Backend:** Debe mostrar "Running" y responder en `/health`
- **Frontend:** Debe mostrar "Running" y servir la aplicación React

## 🎯 Paso 8: Pruebas Finales

Una vez que todo esté configurado, prueba:

1. ✅ **Login:** Inicia sesión con `admin` / `admin123`
2. ✅ **Dashboard:** Verifica que se carguen los datos
3. ✅ **Pacientes:** Crea un paciente de prueba
4. ✅ **Tickets:** Crea un ticket de prueba
5. ✅ **Eventos:** Crea un evento de prueba

## 📝 Checklist Final

- [ ] URLs de backend y frontend obtenidas
- [ ] Variables de entorno del backend configuradas
- [ ] Variable `VITE_API_URL` del frontend configurada
- [ ] Servicios reiniciados
- [ ] Backend responde en `/health`
- [ ] Frontend carga correctamente
- [ ] Login funciona
- [ ] No hay errores de CORS en la consola
- [ ] Las peticiones del frontend van al backend correcto

## 🎉 ¡Listo!

Tu aplicación Concierge está desplegada y funcionando en Railway. 

**Próximos pasos sugeridos:**
- Configurar dominio personalizado
- Configurar backups automáticos de la base de datos
- Configurar monitoreo y alertas
- Optimizar el rendimiento según sea necesario

