# Concierge - Plataforma Concierge MINSEG

Sistema de gestión de tickets de atención a la salud vía canales digitales (WhatsApp, Telefonía).

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 20+ (LTS)
- Cuenta en Supabase (gratis) - [Crear cuenta](https://supabase.com/)

### Instalación Rápida

Para una instalación completa paso a paso, consulta la [Guía de Instalación](./INSTALACION.md).

**Resumen rápido:**
1. Crear proyecto en Supabase (gratis)
2. Ejecutar `database/schema.sql` en el SQL Editor de Supabase
3. Configurar `.env` en `backend/` con credenciales de Supabase
4. `npm install` y `npm run start:dev` en `backend/`
5. `npm install` y `npm run dev` en `frontend/`

## 📁 Estructura del Proyecto

```
concierge/
├── frontend/          # React + TypeScript
├── backend/           # NestJS + TypeScript
├── database/          # Scripts de base de datos
└── docs/             # Documentación
```

## 🎯 Funcionalidades Principales

- ✅ Captura de tickets desde WhatsApp y llamadas telefónicas
- ✅ Clasificación automática de solicitudes
- ✅ Asignación de prestador según ubicación
- ✅ Gestión del ciclo de vida del ticket
- ✅ SLA y tiempos de respuesta

## 📚 Documentación

- **[Guía de Instalación](./INSTALACION.md)** - Instalación paso a paso para MVP
- **[Guía de Despliegue en Railway](./DEPLOY_RAILWAY.md)** - Desplegar en Railway
- **[Guía para Subir a GitHub](./GITHUB_SETUP.md)** - Configurar repositorio en GitHub
- [Análisis Técnico](./ANALISIS_PLATAFORMA_FLOWCARE.md)
- [Resumen Ejecutivo](./RESUMEN_EJECUTIVO.md)
- [Historias de Usuario](./historias_usuario_flowcare_actualizado.md)

## 🚀 Despliegue

Este proyecto está configurado para desplegarse en [Railway](https://railway.app). 

**Guías de despliegue:**
- [Guía de Despliegue en Railway](./DEPLOY_RAILWAY.md) - Pasos iniciales de despliegue
- [Pasos Post-Deployment](./POST_DEPLOYMENT_RAILWAY.md) ⭐ **NUEVO** - Configuración después del despliegue
- [Configuración de Monorepo](./RAILWAY_MONOREPO.md) - Configurar monorepo en Railway
- [Servicios Separados](./RAILWAY_SERVICIOS_SEPARADOS.md) - Crear servicios separados

## 🔐 Variables de Entorno

Copia los archivos `.env.example` a `.env` y completa con tus credenciales:

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env
```

**⚠️ IMPORTANTE**: Nunca subas archivos `.env` a GitHub. Ya están incluidos en `.gitignore`.

