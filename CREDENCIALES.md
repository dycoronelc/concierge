# Credenciales de Acceso - FlowCare

## 🔐 Usuarios por Defecto

Estos usuarios se crean automáticamente al ejecutar el schema SQL.

### Administrador
- **Username:** `admin`
- **Password:** `admin123`
- **Email:** admin@flowcare.com
- **Rol:** Admin

### Agente
- **Username:** `agente1`
- **Password:** `agente123`
- **Email:** agente1@flowcare.com
- **Rol:** Agente

## 📝 Nota Importante

⚠️ **Estas contraseñas son solo para desarrollo/MVP. Cambia las contraseñas antes de usar en producción.**

## 🔑 Método de Autenticación

El sistema usa **username/password** para el login, NO email/password.

- ✅ Correcto: `admin` / `admin123`
- ❌ Incorrecto: `admin@flowcare.com` / `admin123`

## 🛠️ Cambiar Contraseñas

Para cambiar las contraseñas de los usuarios existentes, puedes:

1. **Usar el endpoint de registro** (si no existe el usuario)
2. **Actualizar directamente en la base de datos** (usando bcrypt para hashear)
3. **Crear un endpoint de cambio de contraseña** (recomendado para producción)

### Generar nuevo hash de contraseña:

```bash
cd backend
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('nueva_password', 10).then(h => console.log(h))"
```

Luego actualiza en Supabase:
```sql
UPDATE users 
SET password = 'hash_generado' 
WHERE username = 'admin';
```

---

**Recuerda:** En producción, implementa políticas de contraseñas seguras y cambio obligatorio en primer login.

