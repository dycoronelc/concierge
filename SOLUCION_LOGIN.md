# Solución: Problema de Login

## Problema
El hash de contraseña en la base de datos no correspondía a "admin123", por lo que el login fallaba.

## Solución

### Opción 1: Ejecutar Script SQL (Recomendado)

Ejecuta el archivo `database/fix-passwords.sql` en el SQL Editor de Supabase:

```sql
-- Actualizar contraseña de admin (admin123)
UPDATE users 
SET password = '$2b$10$2NkXgpjh8Hv660v4GGPl..4IN8AUQxpFfDz7B10d.Mu2oS3xnBAq6'
WHERE username = 'admin';

-- Actualizar contraseña de agente1 (agente123)
UPDATE users 
SET password = '$2b$10$wvv5up65.Kg3QD8F.nIjM.Hd9BxNFZOAV9kd/OQNwLLvSUeXU/oGS'
WHERE username = 'agente1';
```

### Opción 2: Regenerar Usuarios

Si prefieres, puedes eliminar y recrear los usuarios ejecutando:

```sql
-- Eliminar usuarios existentes
DELETE FROM users WHERE username IN ('admin', 'agente1');

-- Insertar usuarios con contraseñas correctas
INSERT INTO users (username, email, password, nombre, role) VALUES
('admin', 'admin@flowcare.com', '$2b$10$2NkXgpjh8Hv660v4GGPl..4IN8AUQxpFfDz7B10d.Mu2oS3xnBAq6', 'Administrador', 'Admin'),
('agente1', 'agente1@flowcare.com', '$2b$10$wvv5up65.Kg3QD8F.nIjM.Hd9BxNFZOAV9kd/OQNwLLvSUeXU/oGS', 'Agente Uno', 'Agente');
```

## Credenciales Corregidas

- **Admin:**
  - Username: `admin`
  - Password: `admin123`

- **Agente:**
  - Username: `agente1`
  - Password: `agente123`

## Verificación

Después de ejecutar el script, prueba el login con:
- Username: `admin`
- Password: `admin123`

El login debería funcionar correctamente.

