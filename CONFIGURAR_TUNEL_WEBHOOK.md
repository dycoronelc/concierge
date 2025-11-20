# Configurar Túnel para Webhook en Desarrollo Local

Para configurar el webhook de 2Chat durante el desarrollo, necesitas exponer tu servidor local a internet. Aquí tienes varias opciones:

## 🚀 Opción 1: ngrok (Recomendado)

### Instalación:

**Windows (con Chocolatey):**
```powershell
choco install ngrok
```

**Windows (descarga manual):**
1. Ve a https://ngrok.com/download
2. Descarga el ejecutable para Windows
3. Extrae `ngrok.exe` a una carpeta (ej: `C:\ngrok\`)
4. Agrega la carpeta al PATH o usa la ruta completa

**macOS:**
```bash
brew install ngrok
```

**Linux:**
```bash
# Descarga desde https://ngrok.com/download
# O con snap:
snap install ngrok
```

### Configuración:

1. **Crea una cuenta gratuita** en https://ngrok.com (opcional pero recomendado)

2. **Obtén tu authtoken** desde el dashboard de ngrok

3. **Configura el token:**
```bash
ngrok config add-authtoken TU_AUTHTOKEN
```

4. **Inicia el túnel:**
```bash
ngrok http 3000
```

Esto te dará una URL como:
```
https://abc123.ngrok-free.app
```

5. **Usa esta URL en 2Chat:**
```
https://abc123.ngrok-free.app/webhooks/2chat
```

### Ventajas:
- ✅ Gratis con cuenta
- ✅ HTTPS incluido
- ✅ Muy estable
- ✅ Dashboard web para ver requests

### Desventajas:
- ⚠️ La URL cambia cada vez que reinicias (a menos que tengas plan pago)
- ⚠️ Límite de conexiones simultáneas en plan gratuito

---

## 🌐 Opción 2: localtunnel

### Instalación:

```bash
npm install -g localtunnel
```

### Uso:

1. **Inicia el túnel:**
```bash
lt --port 3000
```

Esto te dará una URL como:
```
https://random-name.loca.lt
```

2. **Para usar un subdominio personalizado:**
```bash
lt --port 3000 --subdomain flowcare-webhook
```

Esto te dará:
```
https://flowcare-webhook.loca.lt
```

### Ventajas:
- ✅ Gratis
- ✅ Puedes usar subdominio personalizado
- ✅ Muy fácil de usar

### Desventajas:
- ⚠️ Menos estable que ngrok
- ⚠️ Puede requerir aceptar advertencia de seguridad en el navegador

---

## 🔧 Opción 3: Cloudflare Tunnel (cloudflared)

### Instalación:

**Windows:**
```powershell
# Descarga desde https://github.com/cloudflare/cloudflared/releases
# O con Chocolatey:
choco install cloudflared
```

**macOS:**
```bash
brew install cloudflared
```

**Linux:**
```bash
# Descarga desde https://github.com/cloudflare/cloudflared/releases
```

### Uso:

```bash
cloudflared tunnel --url http://localhost:3000
```

### Ventajas:
- ✅ Gratis
- ✅ Muy rápido
- ✅ Sin límites de conexiones

### Desventajas:
- ⚠️ URL cambia cada vez

---

## 📝 Configuración Completa del Webhook

### Paso 1: Inicia tu backend

```bash
cd backend
npm run start:dev
```

Asegúrate de que esté corriendo en `http://localhost:3000`

### Paso 2: Inicia el túnel

**Con ngrok:**
```bash
ngrok http 3000
```

**Con localtunnel:**
```bash
lt --port 3000
```

### Paso 3: Copia la URL del túnel

Ejemplo con ngrok:
```
Forwarding: https://abc123.ngrok-free.app -> http://localhost:3000
```

### Paso 4: Configura en 2Chat

1. Ve a tu dashboard de 2Chat
2. Busca la sección de **Webhooks** o **Integraciones**
3. Agrega un nuevo webhook:
   - **URL**: `https://abc123.ngrok-free.app/webhooks/2chat`
   - **Eventos**: Selecciona "Mensajes recibidos"
   - **Método**: POST

### Paso 5: Prueba el webhook

Puedes probar con cURL usando la URL del túnel:

```bash
curl -X POST https://abc123.ngrok-free.app/webhooks/2chat \
  -H "Content-Type: application/json" \
  -d '{
    "event": "message",
    "message": {
      "from": "+1234567890",
      "text": "#fc Mensaje de prueba"
    }
  }'
```

O envía un mensaje real de WhatsApp con `#fc` al inicio.

---

## 🔄 Mantener URL Estable (ngrok)

Si quieres mantener la misma URL en ngrok (requiere cuenta gratuita):

1. **Crea un túnel con nombre:**
```bash
ngrok http 3000 --domain=flowcare-webhook.ngrok-free.app
```

**Nota**: Necesitas configurar un dominio personalizado en ngrok (requiere plan pago o dominio configurado).

2. **O usa ngrok config file:**

Crea `ngrok.yml`:
```yaml
version: "2"
authtoken: TU_AUTHTOKEN
tunnels:
  flowcare:
    addr: 3000
    proto: http
    # domain: flowcare-webhook.ngrok-free.app  # Requiere plan pago
```

Luego ejecuta:
```bash
ngrok start flowcare
```

---

## 🛠️ Script de Inicio Automático (Windows)

Puedes crear un script PowerShell para iniciar todo automáticamente:

**start-dev-with-tunnel.ps1:**
```powershell
# Iniciar backend en una ventana
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run start:dev"

# Esperar un poco para que el backend inicie
Start-Sleep -Seconds 5

# Iniciar ngrok en otra ventana
Start-Process powershell -ArgumentList "-NoExit", "-Command", "ngrok http 3000"

Write-Host "Backend y túnel iniciados. Copia la URL de ngrok para configurar el webhook." -ForegroundColor Green
```

---

## ⚠️ Notas Importantes

1. **URL Temporal**: Las URLs de túneles gratuitos cambian cada vez que reinicias (excepto con configuraciones especiales).

2. **Seguridad**: Los túneles exponen tu servidor local. En producción, usa un dominio real con HTTPS.

3. **Límites**: Los planes gratuitos tienen límites de conexiones y ancho de banda.

4. **Producción**: Para producción, configura un dominio real y apunta el webhook a:
   ```
   https://tu-dominio.com/webhooks/2chat
   ```

---

## 🎯 Recomendación

Para desarrollo:
- **ngrok** es la mejor opción por estabilidad y facilidad de uso

Para producción:
- Usa un dominio real con certificado SSL
- Configura el webhook apuntando a tu dominio de producción

