# 🚀 Comandos Rápidos para Subir a GitHub

## Inicializar y Subir por Primera Vez

Copia y pega estos comandos en tu terminal (PowerShell) en la raíz del proyecto:

```powershell
# 1. Inicializar repositorio git
git init

# 2. Agregar todos los archivos
git add .

# 3. Hacer el primer commit
git commit -m "Initial commit: Concierge platform - Backend y Frontend completos"

# 4. Cambiar nombre de rama a main (si es necesario)
git branch -M main

# 5. Agregar repositorio remoto (REEMPLAZA TU_USUARIO con tu usuario de GitHub)
git remote add origin https://github.com/TU_USUARIO/concierge.git

# 6. Subir a GitHub
git push -u origin main
```

## ⚠️ IMPORTANTE

**Antes de ejecutar los comandos:**

1. **Crea el repositorio en GitHub primero:**
   - Ve a [github.com](https://github.com)
   - Haz clic en "+" → "New repository"
   - Nombre: `concierge` (o el que prefieras)
   - Elige Public o Private
   - **NO marques** "Add a README file"
   - Haz clic en "Create repository"

2. **Reemplaza `TU_USUARIO`** en el comando con tu usuario real de GitHub

3. **Si GitHub te pide autenticación:**
   - Usa un Personal Access Token (no tu contraseña)
   - Crea uno en: GitHub → Settings → Developer settings → Personal access tokens

## Comandos para Futuros Cambios

```powershell
# Ver qué archivos cambiaron
git status

# Agregar todos los cambios
git add .

# Hacer commit
git commit -m "Descripción del cambio"

# Subir a GitHub
git push
```

## Verificar que Todo Esté Bien

```powershell
# Verificar que .env NO esté en el repositorio
git status
# No debería aparecer ningún archivo .env

# Ver qué archivos se van a subir
git ls-files
```

