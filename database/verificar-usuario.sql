-- Script para verificar que el usuario admin existe y tiene el hash correcto
-- Ejecutar en Supabase SQL Editor

-- Verificar usuario admin
SELECT 
    username, 
    email, 
    role,
    LENGTH(password) as password_length,
    SUBSTRING(password, 1, 30) as password_preview
FROM users 
WHERE username = 'admin';

-- Verificar usuario agente1
SELECT 
    username, 
    email, 
    role,
    LENGTH(password) as password_length,
    SUBSTRING(password, 1, 30) as password_preview
FROM users 
WHERE username = 'agente1';

-- Si no existen, crearlos
INSERT INTO users (username, email, password, nombre, role) VALUES
('admin', 'admin@flowcare.com', '$2b$10$2NkXgpjh8Hv660v4GGPl..4IN8AUQxpFfDz7B10d.Mu2oS3xnBAq6', 'Administrador', 'Admin'),
('agente1', 'agente1@flowcare.com', '$2b$10$wvv5up65.Kg3QD8F.nIjM.Hd9BxNFZOAV9kd/OQNwLLvSUeXU/oGS', 'Agente Uno', 'Agente')
ON CONFLICT (username) DO UPDATE SET
    password = EXCLUDED.password,
    email = EXCLUDED.email,
    nombre = EXCLUDED.nombre,
    role = EXCLUDED.role;

