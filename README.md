# 🏦 Credicord Bank - DevPanel Core

> **Panel Administrativo y de Control Bancario**  
> Solución full-stack de alto rendimiento para la supervisión de operaciones financieras, gestión de clientes, métricas bancarias en tiempo real y registro de auditoría.

[![Node.js](https://img.shields.io/badge/Node.js-20+-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vue.js](https://img.shields.io/badge/Vue.js-3.5-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

---

## 📑 Tabla de Contenidos

1. [Características Principales](#-características-principales)
2. [Stack Tecnológico](#-stack-tecnológico)
3. [Estructura del Repositorio](#-estructura-del-repositorio)
4. [Requisitos Previos](#-requisitos-previos)
5. [Guía de Puesta en Marcha](#-guía-de-puesta-en-marcha)
   - [Opción 1: Con Docker Compose (Recomendada)](#opción-1-con-docker-compose-recomendada)
   - [Opción 2: Ejecución Local Manual (Desarrollo)](#opción-2-ejecución-local-manual-desarrollo)
6. [Credenciales de Prueba Preconfiguradas](#-credenciales-de-prueba-preconfiguradas)
7. [Endpoints Principales de la API](#-endpoints-principales-de-la-api)
8. [Variables de Entorno](#-variables-de-entorno)
9. [Comandos y Scripts Útiles](#-comandos-y-scripts-útiles)
10. [Solución de Problemas Frecuentes](#-solución-de-problemas-frecuentes)

---

## ✨ Características Principales

- **Seguridad Bancaria y Autenticación JWT**: Cifrado de contraseñas con `bcrypt` (10 rounds), validación de esquemas con `Zod`, roles diferenciados (`ADMIN`, `DEVELOPER`, `AUDITOR`, `USER`) y expiración de tokens controlada con manejo de error reactivo (`TOKEN_EXPIRED` 401).
- **Dashboard de Métricas Financieras**: Cálculo en tiempo real de saldos en custodia (USD), cuentas activas/retenidas, nuevos clientes en 30 días, distribución de cartera por tipo de producto y feed de auditoría en vivo.
- **Directorio de Clientes con Búsqueda Reactiva**: Búsqueda con retardo inteligente (**Debounce de 400ms**) para optimizar el rendimiento de la base de datos, combinada con filtros de rol, estado y paginación configurable.
- **Modal de Detalle Bancario**: Inspección detallada de cuentas por cliente (cuentas corrientes, ahorros, inversiones y crédito) con sus respectivos números de cuenta y balances.
- **Auditoría Integral (`AuditLog`)**: Registro de actividad sensible con almacenamiento de IP y agente de usuario.
- **Diseño Fintech Premium**: Modo oscuro refinado con Tailwind CSS, microinteracciones, glassmorphism e indicadores de estado del sistema bancario.

---

## 💻 Stack Tecnológico

| Capa | Tecnologías |
| :--- | :--- |
| **Frontend** | Vue 3 (Composition API / `<script setup>`), Vite, Tailwind CSS, Vue Router 4, Axios, Lucide Icons |
| **Backend** | Node.js 20+, Express, TypeScript, Prisma ORM, Zod, JWT, Bcrypt |
| **Base de Datos** | PostgreSQL 16 |
| **Contenedores** | Docker, Docker Compose, Alpine Linux |

---

## 📁 Estructura del Repositorio

```text
pruebatecnica/
├── .env.example                # Plantilla de variables de entorno globales
├── .env                        # Variables de entorno locales
├── docker-compose.yml          # Orquestación de contenedores (db, api, app)
├── README.md                   # Esta guía de uso y documentación
├── AGENTS.md                   # Documentación técnica y arquitectura del sistema
│
├── backend/                    # API RESTful (Node.js + Express + Prisma)
│   ├── Dockerfile              # Imagen Docker con healthcheck de Node 20
│   ├── docker-entrypoint.sh    # Script de arranque (migraciones y seed automático)
│   ├── package.json            # Dependencias y scripts de backend
│   ├── tsconfig.json           # Configuración TypeScript
│   ├── prisma/
│   │   ├── schema.prisma       # Modelos relacionales User, Account, AuditLog
│   │   └── seed.ts             # Semilla de datos con usuarios y cuentas demo
│   └── src/
│       ├── index.ts            # Servidor Express y configuración de middleware
│       ├── controllers/        # Controladores (Auth, Metrics, Users)
│       ├── routes/             # Definición de rutas y validadores Zod
│       ├── middleware/         # Autenticación JWT, roles y manejo de errores
│       ├── services/           # Lógica de negocio y consultas con Prisma
│       ├── utils/              # Clientes de Prisma, JWT, hashing y respuestas HTTP
│       └── types/              # Definiciones TypeScript
│
└── frontend/                   # Aplicación Web (Vue 3 + Vite + Tailwind)
    ├── Dockerfile              # Imagen Docker de desarrollo/producción
    ├── package.json            # Dependencias de frontend
    ├── vite.config.ts          # Configuración Vite y resolución de rutas
    ├── tailwind.config.js      # Configuración de estilos y tema Credicord
    ├── index.html              # Plantilla HTML con tipografía Inter
    └── src/
        ├── main.ts             # Inicialización de la aplicación Vue
        ├── App.vue             # Layout principal y control de sesión
        ├── api/                # Clientes Axios con interceptores de Bearer token y 401
        ├── composables/        # useAuth y useDebounce
        ├── router/             # Vue Router con Route Guards de autenticación
        ├── components/         # Componentes (Navbar, Sidebar, StatCard, Badge, etc.)
        └── views/              # Vistas (LoginView, DashboardView, UsersView, NotFound)
```

---

## 📋 Requisitos Previos

Dependiendo del método de ejecución que elijas:

### Para ejecutar con Docker (Recomendado):
- [Docker](https://www.docker.com/get-started) (v24.0+)
- [Docker Compose](https://docs.docker.com/compose/) (v2.20+)

### Para ejecutar de forma local (Sin Docker):
- [Node.js](https://nodejs.org/) v20 o superior
- [npm](https://www.npmjs.com/) v10 o superior
- [PostgreSQL](https://www.postgresql.org/) v16 ejecutándose en el puerto `5432`

---

## 🚀 Guía de Puesta en Marcha

### Opción 1: Con Docker Compose (Recomendada)

Este método levanta de forma automática la base de datos PostgreSQL, aplica las migraciones, ejecuta la siembra de datos de prueba (`seed.ts`), inicia el servidor backend y el frontend.

#### 1. Clonar el repositorio y acceder a la carpeta
```bash
git clone <URL_DEL_REPOSITORIO>
cd pruebatecnica
```

#### 2. Preparar el archivo de entorno
Copia el archivo `.env.example` como `.env` en la raíz del proyecto:
```bash
cp .env.example .env
```

#### 3. Construir y levantar los contenedores
```bash
docker compose up --build -d
```
*(Si usas la versión clásica de docker compose, ejecuta `docker-compose up --build -d`)*

#### 4. Verificar el estado de los servicios
Espera unos segundos a que los healthchecks reporten `healthy`:
```bash
docker compose ps
```
Deberías ver los 3 servicios activos:
- `credicord-postgres` (Puerto `5432`) - `healthy`
- `credicord-backend` (Puerto `4000`) - `healthy`
- `credicord-frontend` (Puerto `5173`) - `healthy`

#### 5. Acceder a las aplicaciones
- **Frontend (DevPanel)**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:4000/api](http://localhost:4000/api)
- **Healthcheck**: [http://localhost:4000/api/health](http://localhost:4000/api/health)

#### 6. Detener los contenedores
```bash
docker compose down
```
*(Si deseas eliminar también el volumen persistente de la base de datos: `docker compose down -v`)*

---

### Opción 2: Ejecución Local Manual (Desarrollo)

Si prefieres ejecutar el proyecto directamente en tu máquina host sin contenedores:

#### 1. Configurar la base de datos PostgreSQL
Crea una base de datos local en PostgreSQL llamada `credicord_devpanel` accesible con usuario `postgres` y contraseña `postgres` (o ajusta las credenciales en tu `.env`).

#### 2. Configurar y arrancar el Backend
Abre una terminal y ejecuta:

```bash
cd backend

# 1. Copiar archivo de entorno
cp .env.example .env

# 2. Instalar dependencias
npm install

# 3. Generar cliente de Prisma y sincronizar esquema
npx prisma generate
npx prisma db push

# 4. Poblar datos iniciales de prueba (usuarios, cuentas y métricas)
npm run prisma:seed

# 5. Iniciar servidor en modo desarrollo
npm run dev
```
El servidor backend quedará disponible en: `http://localhost:4000`

#### 3. Configurar y arrancar el Frontend
Abre una segunda terminal y ejecuta:

```bash
cd frontend

# 1. Copiar archivo de entorno
cp .env.example .env

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo Vite
npm run dev
```
La aplicación web quedará disponible en: `http://localhost:5173`

---

## 🔑 Credenciales de Prueba Preconfiguradas

En la pantalla de inicio de sesión (`/login`), dispones de **botones de acceso rápido de 1 clic** para cada perfil, o puedes ingresar manualmente las credenciales:

| Rol | Correo Electrónico | Contraseña | Alcance de Permisos |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin@credicordbank.com` | `Credicord2025!` | Acceso total: métricas financieras globales, directorio de clientes y auditoría. |
| **Desarrollador** | `dev@credicordbank.com` | `Credicord2025!` | Supervisión técnica de plataforma, consultas y diagnóstico de servicios. |
| **Auditor** | `auditor@credicordbank.com` | `Credicord2025!` | Verificación de cumplimiento normativo y revisión de bitácoras de auditoría. |
| **Cliente Demo** | `elena.rios@empresasrios.com` | `Credicord2025!` | Perfil de cliente bancario corporativo con múltiples cuentas e inversiones. |

---

## 🔌 Endpoints Principales de la API

La API REST se expone bajo el prefijo `/api`:

### Autenticación (`/api/auth`)
- `POST /api/auth/login`: Autentica credenciales y genera token JWT.
- `GET /api/auth/me`: Retorna los datos del usuario en sesión (`Bearer <token>` requerido).

### Métricas Financieras (`/api/metrics`)
- `GET /api/metrics`: Retorna indicadores agregados: saldo total en custodia, resumen de cuentas, clientes activos, distribución por producto financiero y registro de eventos recientes.

### Directorio de Clientes (`/api/users`)
- `GET /api/users`: Lista paginada y filtrable de usuarios.
  - Parámetros soportados:
    - `page` (default: 1)
    - `limit` (default: 10)
    - `search` (búsqueda por nombre, apellido, correo o número de cuenta)
    - `role` (`ALL`, `ADMIN`, `DEVELOPER`, `AUDITOR`, `USER`)
    - `status` (`ALL`, `ACTIVE`, `INACTIVE`, `SUSPENDED`)
- `GET /api/users/:id`: Obtiene el detalle de un cliente específico incluyendo todas sus cuentas bancarias.

### Diagnóstico (`/api/health`)
- `GET /api/health`: Estado de salud del servicio backend y conectividad con la base de datos.

---

## ⚙️ Variables de Entorno

El archivo `.env` en la raíz (y en `backend/` y `frontend/`) soporta las siguientes configuraciones:

```ini
# --- PostgreSQL Database ---
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=credicord_devpanel
POSTGRES_PORT=5432

# --- Backend API ---
BACKEND_PORT=4000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/credicord_devpanel?schema=public"
JWT_SECRET="credicord_super_secret_jwt_key_2025_secure!"
JWT_EXPIRES_IN="2h"
CORS_ORIGIN="http://localhost:5173,http://localhost:3000"

# --- Frontend App ---
FRONTEND_PORT=5173
VITE_API_URL="http://localhost:4000/api"
```

---

## 🛠️ Comandos y Scripts Útiles

### Backend (`cd backend`)
- `npm run dev`: Inicia el servidor con hot-reload usando `tsx watch`.
- `npm run build`: Compila TypeScript y regenera el cliente Prisma.
- `npm start`: Inicia el servidor compilado en producción.
- `npm run prisma:push`: Aplica cambios del modelo `schema.prisma` directamente a la base de datos.
- `npm run prisma:seed`: Ejecuta la siembra de usuarios, cuentas y logs de prueba.
- `npm run prisma:studio`: Abre una interfaz gráfica web para inspeccionar y editar los registros de la base de datos en [http://localhost:5555](http://localhost:5555).

### Frontend (`cd frontend`)
- `npm run dev`: Inicia el servidor de desarrollo Vite con Hot Module Replacement (HMR).
- `npm run build`: Verifica tipos con `vue-tsc` y genera el paquete de producción en `dist/`.
- `npm run preview`: Previsualiza la compilación de producción localmente.

### Docker Compose (en la raíz)
- `docker compose logs -f backend`: Visualiza los logs en tiempo real del backend.
- `docker compose logs -f frontend`: Visualiza los logs en tiempo real del frontend.
- `docker compose restart backend`: Reinicia el contenedor del backend.
- `docker compose exec backend npx prisma studio`: Inicia Prisma Studio dentro del contenedor.

---

## ❓ Solución de Problemas Frecuentes

1. **Error de puerto ocupado (5432, 4000 o 5173)**:
   - Verifica si tienes otra instancia de PostgreSQL local o un servicio ocupando el puerto:
     ```bash
     lsof -i :5432
     lsof -i :4000
     lsof -i :5173
     ```
   - Puedes cambiar los puertos mapeados en `.env` o detener los servicios en conflicto.

2. **Base de datos vacía o error de autenticación**:
   - Vuelve a ejecutar la semilla de datos:
     ```bash
     cd backend && npm run prisma:seed
     ```
     o con Docker:
     ```bash
     docker compose exec backend npm run prisma:seed
     ```

3. **La sesión se cierra o muestra banner de expiración**:
   - El sistema detecta automáticamente tokens expirados o alterados (error 401 `TOKEN_EXPIRED`), limpia el estado local y redirige a la pantalla de login con un mensaje explicativo para el usuario. Simplemente inicia sesión nuevamente con cualquiera de los botones rápidos de prueba.

---

<p align="center">
  <b>Credicord Bank DevPanel</b> • Plataforma Financiera Segura • 2025-2026
</p>
