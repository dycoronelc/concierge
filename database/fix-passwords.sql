-- Script para corregir las contraseñas de los usuarios
-- Ejecutar este script en Supabase SQL Editor

-- Actualizar contraseña de admin (admin123)
UPDATE users 
SET password = '$2b$10$2NkXgpjh8Hv660v4GGPl..4IN8AUQxpFfDz7B10d.Mu2oS3xnBAq6'
WHERE username = 'admin';

-- Actualizar contraseña de agente1 (agente123)
UPDATE users 
SET password = '$2b$10$wvv5up65.Kg3QD8F.nIjM.Hd9BxNFZOAV9kd/OQNwLLvSUeXU/oGS'
WHERE username = 'agente1';

-- Verificar que se actualizaron
SELECT username, email, role FROM users WHERE username IN ('admin', 'agente1');

