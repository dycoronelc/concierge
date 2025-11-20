# Configuración de Webhook 2Chat para Tickets Automáticos

Este documento explica cómo configurar el webhook de 2Chat para crear tickets automáticamente cuando se reciban mensajes de WhatsApp que comiencen con `#fc`.

## 📋 Requisitos Previos

1. Tener una cuenta de 2Chat configurada
2. Tener el `TWOCHAT_API_KEY` configurado como variable de entorno (ya creado)
3. Backend de FlowCare corriendo y accesible desde internet

## 🔧 Configuración

### 1. Variables de Entorno

Asegúrate de tener estas variables en tu archivo `.env` del backend:

```env
TWOCHAT_API_KEY=tu-api-key-de-2chat
```

### 2. URL del Webhook

El endpoint del webhook está disponible en:

```
POST http://tu-dominio.com/webhooks/2chat
```

O si estás en desarrollo local con un túnel (ngrok, localtunnel, etc.):

```
POST https://tu-tunel.ngrok.io/webhooks/2chat
```

### 3. Configurar Webhook en 2Chat

1. Inicia sesión en tu dashboard de 2Chat
2. Ve a la sección de **Webhooks** o **Integraciones**
3. Configura un nuevo webhook con:
   - **URL**: `https://tu-dominio.com/webhooks/2chat`
   - **Eventos**: Selecciona "Mensajes recibidos" o "message.received"
   - **Método**: POST
   - **Headers** (opcional): Si quieres validar con API key, agrega:
     - `x-api-key: tu-secret-key`

### 4. Formato del Payload

El webhook espera recibir un payload en formato JSON con la siguiente estructura:

```json
{
  "event": "message",
  "message": {
    "id": "msg_123",
    "from": "+1234567890",
    "to": "+0987654321",
    "text": "#fc Necesito ayuda con mi cita médica",
    "type": "text",
    "timestamp": 1234567890
  },
  "contact": {
    "phone": "+1234567890",
    "name": "Juan Pérez"
  }
}
```

**Nota**: El formato exacto puede variar según la versión de la API de 2Chat. El servicio está diseñado para ser flexible y extraer la información de diferentes campos posibles.

## 🎯 Funcionamiento

### Cómo Funciona

1. **Recepción del Mensaje**: Cuando 2Chat recibe un mensaje de WhatsApp, envía un webhook al endpoint configurado.

2. **Filtrado**: El servicio verifica si el mensaje comienza con `#fc` (case-insensitive).

3. **Creación Automática**: Si el mensaje comienza con `#fc`:
   - Extrae el número de teléfono del remitente
   - Extrae el mensaje (sin el hashtag `#fc`)
   - Crea automáticamente un ticket en el sistema
   - Si ya existe un ticket abierto para ese número, agrega el mensaje como interacción

4. **Respuesta**: El webhook retorna:
   ```json
   {
     "success": true,
     "ticketCreated": true,
     "message": "Ticket FC-2025-1234 creado exitosamente"
   }
   ```

### Ejemplos de Uso

#### ✅ Mensaje que crea ticket:
```
#fc Necesito una cita médica urgente
```
**Resultado**: Se crea un ticket automáticamente con la descripción "Necesito una cita médica urgente"

#### ✅ Mensaje con mayúsculas:
```
#FC Tengo una emergencia
```
**Resultado**: También funciona (case-insensitive)

#### ❌ Mensaje sin hashtag:
```
Necesito ayuda
```
**Resultado**: Se ignora, no se crea ticket

#### ❌ Mensaje solo con hashtag:
```
#fc
```
**Resultado**: Se rechaza porque no tiene contenido después del hashtag

## 🔍 Logs y Debugging

El servicio registra información útil en los logs:

- **Mensajes recibidos**: Se loguea el evento, número y texto del mensaje
- **Tickets creados**: Se loguea el número de ticket creado
- **Errores**: Se loguean errores con detalles para debugging

Ejemplo de logs:
```
[WebhooksService] Webhook recibido - Evento: message, From: +1234567890, Text: #fc Necesito ayuda...
[WebhooksService] Creando ticket automático para número: +1234567890
[WebhooksService] Ticket creado exitosamente: FC-2025-1234
```

## 🔒 Seguridad (Opcional)

Si quieres agregar validación adicional, puedes descomentar el código en `webhooks.controller.ts`:

```typescript
const expectedApiKey = process.env.TWOCHAT_WEBHOOK_SECRET;
if (expectedApiKey && apiKey !== expectedApiKey) {
  throw new UnauthorizedException('Invalid API key');
}
```

Y agregar en tu `.env`:
```env
TWOCHAT_WEBHOOK_SECRET=tu-secret-key-segura
```

## 🧪 Pruebas

### Probar con cURL:

```bash
curl -X POST http://localhost:3000/webhooks/2chat \
  -H "Content-Type: application/json" \
  -d '{
    "event": "message",
    "message": {
      "from": "+1234567890",
      "text": "#fc Este es un mensaje de prueba"
    }
  }'
```

### Probar con Postman:

1. Método: POST
2. URL: `http://localhost:3000/webhooks/2chat`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):
```json
{
  "event": "message",
  "message": {
    "from": "+1234567890",
    "text": "#fc Mensaje de prueba desde Postman"
  }
}
```

## 📝 Notas Importantes

1. **Normalización de Números**: El servicio normaliza automáticamente los números de teléfono, removiendo espacios, guiones y otros caracteres especiales.

2. **Tickets Existentes**: Si ya existe un ticket abierto para el mismo número, el mensaje se agrega como interacción en lugar de crear un nuevo ticket.

3. **Mensajes sin #fc**: Los mensajes que no comienzan con `#fc` se ignoran silenciosamente (no se crean tickets).

4. **Accesibilidad**: El webhook debe ser accesible desde internet. Si estás en desarrollo local, usa un túnel como ngrok o localtunnel.

## 🚀 Siguiente Paso

Una vez configurado, envía un mensaje de WhatsApp a tu número de 2Chat que comience con `#fc` y verifica que se cree el ticket automáticamente en el sistema.

