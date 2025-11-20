# Guía de Instalación - FlowCare MVP

## 🚀 Instalación Rápida para MVP

Esta guía está optimizada para tener el prototipo funcionando lo más rápido posible usando **Supabase** como base de datos en la nube.

## Prerrequisitos

- **Node.js 20+** (LTS) - [Descargar](https://nodejs.org/)
- **Cuenta en Supabase** (gratis) - [Crear cuenta](https://supabase.com/)
- **npm** (incluido con Node.js)

## ⚡ Instalación en 5 Pasos

### 1. Crear Proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com/) y crea una cuenta (o inicia sesión)
2. Haz clic en **"New Project"**
3. Completa el formulario:
   - **Name:** `flowcare` (o el nombre que prefieras)
   - **Database Password:** Elige una contraseña segura (¡guárdala!)
   - **Region:** Elige la región más cercana
   - **Pricing Plan:** Free (suficiente para MVP)
4. Espera 1-2 minutos mientras se crea el proyecto

### 2. Obtener Credenciales de Supabase

Una vez creado el proyecto:

1. Ve a **Settings** → **Database**
2. En la sección **Connection string**, selecciona **"URI"**
3. Copia la **Connection string** (se verá así: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`)
4. También necesitarás:
   - **Host:** `db.xxxxx.supabase.co` (de la connection string)
   - **Port:** `5432`
   - **Database:** `postgres`
   - **User:** `postgres`
   - **Password:** La que configuraste al crear el proyecto

### 3. Ejecutar Schema de Base de Datos

**Opción A: Desde el SQL Editor de Supabase (Recomendado)**

1. En Supabase, ve a **SQL Editor** (icono de terminal en el menú lateral)
2. Haz clic en **"New query"**
3. Abre el archivo `database/schema.sql` de este proyecto
4. Copia todo el contenido y pégalo en el editor
5. Haz clic en **"Run"** (o presiona `Ctrl+Enter`)

**Opción B: Desde la terminal (si tienes psql instalado)**

```bash
# Reemplaza [YOUR-PASSWORD] y [PROJECT-REF] con tus valores
psql "postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres" -f database/schema.sql
```

### 4. Configurar y Ejecutar Backend

```bash
cd backend
npm install

# Crear archivo .env
# Windows (PowerShell):
Copy-Item .env.example .env

# Linux/macOS:
cp .env.example .env
```

**Editar `.env`** con tus credenciales de Supabase:

```env
# Supabase Database
DB_HOST=db.xxxxx.supabase.co
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu-password-de-supabase
DB_DATABASE=postgres

# JWT
JWT_SECRET=tu-secret-key-cambiar-en-produccion
JWT_EXPIRES_IN=24h

# Server
PORT=3000
NODE_ENV=development
```

**Importante:** Supabase requiere SSL, así que la configuración ya está lista para eso.

**Iniciar backend:**
```bash
npm run start:dev
```

El backend estará disponible en: **http://localhost:3000**

### 5. Configurar y Ejecutar Frontend

Abre una **nueva terminal**:

```bash
cd frontend
npm install
npm run dev
```

El frontend estará disponible en: **http://localhost:5173**

## ✅ Verificación

1. **Backend Health Check:**
   - Abre: http://localhost:3000/health
   - Debe responder: `{"status":"ok",...}`

2. **Frontend:**
   - Abre: http://localhost:5173
   - Debe mostrar la página de login

3. **Verificar conexión a Supabase:**
   - En Supabase, ve a **Table Editor**
   - Deberías ver las tablas creadas: `users`, `patients`, `tickets`, etc.

4. **Usuarios por Defecto:**
   - Los usuarios ya están creados en el schema SQL
   - **Admin:** username: `admin` / password: `admin123`
   - **Agente:** username: `agente1` / password: `agente123`
   - Ver [CREDENCIALES.md](./CREDENCIALES.md) para más detalles
   - ⚠️ **Nota:** El login usa **username/password**, NO email/password

## 🎯 Primeros Pasos

1. **Iniciar sesión** con el usuario creado
2. **Crear un paciente** desde la sección Pacientes
3. **Crear un prestador** desde la sección Prestadores
4. **Crear un ticket de prueba:**
   ```bash
   POST http://localhost:3000/tickets/whatsapp
   {
     "numero": "+1234567890",
     "mensaje": "Necesito una consulta médica urgente"
   }
   ```

## 🔧 Solución de Problemas

### Error: "No se puede conectar a la base de datos"
- Verifica que las credenciales en `.env` sean correctas
- Asegúrate de que el proyecto de Supabase esté activo (no pausado)
- Verifica que el host sea correcto (debe ser `db.xxxxx.supabase.co`)

### Error: "SSL connection required"
- Supabase siempre requiere SSL. La configuración ya está lista para esto.
- Si persiste, verifica que `NODE_ENV` no esté en `production` (o ajusta la configuración SSL)

### Error: "relation does not exist"
- Asegúrate de haber ejecutado el schema SQL en Supabase
- Verifica en el **Table Editor** de Supabase que las tablas existan

### Error: "password authentication failed"
- Verifica la contraseña en `.env`
- Puedes resetear la contraseña en Supabase: **Settings** → **Database** → **Reset database password**

### Puerto 3000 o 5173 ya en uso
- Cambia el puerto en `.env` (backend) o `vite.config.ts` (frontend)

## 📝 Notas para MVP

- **Supabase es gratuito** hasta 500MB de base de datos (suficiente para MVP)
- **No necesitas instalar PostgreSQL localmente** - todo está en la nube
- **TypeORM synchronize está activado** en desarrollo - crea/actualiza tablas automáticamente
- **Supabase incluye:**
  - Base de datos PostgreSQL
  - Dashboard para ver datos
  - SQL Editor integrado
  - API REST automática (opcional)
  - Autenticación (opcional, no la usamos en MVP)

## 🎁 Ventajas de Supabase

- ✅ **Sin instalación local** - todo en la nube
- ✅ **Dashboard visual** - ver y editar datos fácilmente
- ✅ **Backups automáticos** - en el plan gratuito
- ✅ **Escalable** - fácil migrar a planes pagos
- ✅ **SSL incluido** - conexiones seguras por defecto

## 🚀 Siguiente Fase

Una vez que el MVP esté funcionando, puedes:
- Usar las funciones de Supabase (Edge Functions)
- Implementar autenticación con Supabase Auth
- Usar el Storage de Supabase para archivos
- Migrar a un plan pago si necesitas más recursos

---

**¡Listo para desarrollar!** 🎉
