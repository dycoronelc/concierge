# 📦 Guía para Subir el Proyecto a GitHub

Esta guía te ayudará a subir tu proyecto Concierge a GitHub paso a paso.

## 📋 Prerequisitos

1. Cuenta en [GitHub](https://github.com)
2. Git instalado en tu máquina (verifica con `git --version`)

## 🚀 Pasos para Subir el Proyecto

### Paso 1: Inicializar el Repositorio Git

Abre una terminal en la raíz del proyecto (`C:\react\flowcare`) y ejecuta:

```bash
# Inicializar repositorio git
git init

# Agregar todos los archivos
git add .

# Hacer el primer commit
git commit -m "Initial commit: Concierge platform - Backend y Frontend completos"
```

### Paso 2: Crear Repositorio en GitHub

1. Ve a [github.com](https://github.com) e inicia sesión
2. Haz clic en el botón **"+"** en la esquina superior derecha
3. Selecciona **"New repository"**
4. Completa el formulario:
   - **Repository name**: `concierge` (o el nombre que prefieras)
   - **Description**: "Plataforma Concierge MINSEG - Sistema de gestión de tickets y servicios de salud"
   - **Visibility**: 
     - ✅ **Public** (si quieres que sea público)
     - ✅ **Private** (si quieres que sea privado - recomendado)
   - ❌ **NO marques** "Add a README file" (ya tenemos uno)
   - ❌ **NO marques** "Add .gitignore" (ya tenemos uno)
   - ❌ **NO marques** "Choose a license" (a menos que quieras agregar uno)
5. Haz clic en **"Create repository"**

### Paso 3: Conectar el Repositorio Local con GitHub

Después de crear el repositorio, GitHub te mostrará instrucciones. Ejecuta estos comandos:

```bash
# Agregar el repositorio remoto (reemplaza TU_USUARIO con tu usuario de GitHub)
git remote add origin https://github.com/TU_USUARIO/concierge.git

# Cambiar el nombre de la rama principal a 'main' (si es necesario)
git branch -M main

# Subir el código a GitHub
git push -u origin main
```

**Nota**: Si GitHub te muestra una URL diferente (SSH o con tu usuario), úsala en lugar de la del ejemplo.

### Paso 4: Autenticación

Si es la primera vez que subes código, GitHub puede pedirte autenticación:

**Opción A: Personal Access Token (Recomendado)**
1. Ve a GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Genera un nuevo token con permisos `repo`
3. Cuando Git te pida la contraseña, usa el token en lugar de tu contraseña

**Opción B: GitHub CLI**
```bash
# Instalar GitHub CLI (si no lo tienes)
# Windows: winget install GitHub.cli
# Luego:
gh auth login
```

## 🔐 Configuración de Seguridad

### Variables de Entorno

**IMPORTANTE**: Nunca subas archivos `.env` con información sensible. El `.gitignore` ya está configurado para ignorarlos, pero verifica:

```bash
# Verificar que .env no se suba
git status
# No debería aparecer ningún archivo .env en la lista
```

### Archivos Sensibles que NO deben subirse

- ✅ `.env` y todas sus variantes (ya están en .gitignore)
- ✅ Credenciales de base de datos
- ✅ JWT secrets
- ✅ API keys
- ✅ Passwords

### Crear archivo de ejemplo para variables de entorno

Puedes crear archivos `.env.example` para documentar qué variables se necesitan:

```bash
# backend/.env.example
DB_HOST=your-db-host
DB_PORT=5432
DB_USERNAME=your-username
DB_PASSWORD=your-password
DB_DATABASE=your-database
JWT_SECRET=your-jwt-secret
FRONTEND_URL=http://localhost:5173
PORT=3000
NODE_ENV=development
```

## 📝 Comandos Git Útiles

### Ver el estado del repositorio
```bash
git status
```

### Ver qué archivos se agregaron
```bash
git status --short
```

### Agregar archivos específicos
```bash
git add archivo.txt
git add carpeta/
```

### Hacer commit
```bash
git commit -m "Descripción del cambio"
```

### Ver el historial de commits
```bash
git log
```

### Subir cambios a GitHub
```bash
git push
```

### Actualizar desde GitHub
```bash
git pull
```

### Ver ramas
```bash
git branch
```

### Crear una nueva rama
```bash
git checkout -b nombre-rama
```

## 🎯 Estructura del Proyecto en GitHub

Tu repositorio debería verse así:

```
concierge/
├── backend/              # Backend NestJS
│   ├── src/
│   ├── Dockerfile
│   ├── package.json
│   └── ...
├── frontend/             # Frontend React
│   ├── src/
│   ├── package.json
│   └── ...
├── database/             # Scripts SQL
│   ├── schema.sql
│   └── ...
├── .gitignore
├── README.md
├── DEPLOY_RAILWAY.md
└── ...
```

## 🔄 Flujo de Trabajo Recomendado

### Para hacer cambios y subirlos:

```bash
# 1. Ver qué archivos cambiaron
git status

# 2. Agregar los archivos modificados
git add .

# 3. Hacer commit con un mensaje descriptivo
git commit -m "feat: agregar nueva funcionalidad X"

# 4. Subir a GitHub
git push
```

### Convenciones de Mensajes de Commit

Usa prefijos descriptivos:
- `feat:` - Nueva funcionalidad
- `fix:` - Corrección de bug
- `docs:` - Cambios en documentación
- `style:` - Cambios de formato (sin afectar código)
- `refactor:` - Refactorización de código
- `test:` - Agregar o modificar tests
- `chore:` - Tareas de mantenimiento

Ejemplos:
```bash
git commit -m "feat: implementar EPIC 13 - Psicología y Apoyo Emocional"
git commit -m "fix: corregir error 500 en endpoint de alertas"
git commit -m "docs: actualizar guía de despliegue en Railway"
```

## 🚨 Solución de Problemas

### Error: "fatal: remote origin already exists"
```bash
# Eliminar el remoto existente
git remote remove origin

# Agregar el remoto correcto
git remote add origin https://github.com/TU_USUARIO/concierge.git
```

### Error: "Permission denied"
- Verifica que tengas permisos en el repositorio
- Usa un Personal Access Token en lugar de contraseña
- Verifica que la URL del repositorio sea correcta

### Error: "failed to push some refs"
```bash
# Primero hacer pull para traer cambios remotos
git pull origin main --rebase

# Luego intentar push de nuevo
git push
```

### Deshacer cambios no commiteados
```bash
# Descartar cambios en un archivo específico
git checkout -- archivo.txt

# Descartar todos los cambios
git checkout .
```

### Ver qué archivos se ignoran
```bash
git status --ignored
```

## 📚 Recursos Adicionales

- [Documentación de Git](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com)
- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)

## ✅ Checklist Antes de Subir

- [ ] Verificar que `.env` esté en `.gitignore`
- [ ] Verificar que `node_modules/` esté en `.gitignore`
- [ ] Verificar que `dist/` y `build/` estén en `.gitignore`
- [ ] Revisar que no haya información sensible en el código
- [ ] Tener un README.md descriptivo
- [ ] Tener commits con mensajes claros

## 🎉 ¡Listo!

Una vez que hayas completado estos pasos, tu proyecto estará en GitHub y podrás:
- Compartirlo con otros desarrolladores
- Conectarlo con Railway para despliegue automático
- Trabajar en equipo con control de versiones
- Hacer backup de tu código

¡Éxito con tu proyecto! 🚀

