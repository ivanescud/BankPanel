# 🏦 Credicord Bank - DevPanel Core Architecture & Documentation

Bienvenido a la documentación técnica del **DevPanel de Credicord Bank**. Este panel administrativo fue diseñado para proporcionar a desarrolladores, auditores y administradores bancarios una vista centralizada de métricas financieras, directorio de clientes con búsqueda reactiva, gestión de cuentas y control estricto de accesos.

---

## 📋 Tabla de Contenidos

1. [Visión General de la Arquitectura](#visión-general-de-la-arquitectura)
2. [Estructura del Proyecto](#estructura-del-proyecto)
3. [Stack Tecnológico](#stack-tecnológico)
4. [Módulo de Autenticación y Sesiones](#módulo-de-autenticación-y-sesiones)
5. [Métricas y Panel de Control](#métricas-y-panel-de-control)
6. [Directorio de Usuarios y Búsqueda con Debounce](#directorio-de-usuarios-y-búsqueda-con-debounce)
7. [Base de Datos y Modelo de Datos (Prisma)](#base-de-datos-y-modelo-de-datos-prisma)
8. [Docker & Orquestación de Servicios](#docker--orquestación-de-servicios)
9. [Guía de Puesta en Marcha](#guía-de-puesta-en-marcha)
10. [Credenciales de Prueba Preconfiguradas](#credenciales-de-prueba-preconfiguradas)

---

## 🏛️ 1. Visión General de la Arquitectura

El sistema está dividido en dos aplicaciones desacopladas y una base de datos relacional robusta:

```
[ Frontend: Vue 3 + Vite + Tailwind ]
            │ (Peticiones HTTP con Bearer JWT / Interceptores Axios)
            ▼
[ Backend: Node.js + Express + Prisma ORM ]
            │ (Pool de conexiones SQL)
            ▼
[ Database: PostgreSQL 16 ]
```

### Principios de Diseño
- **Backend Modular**: Separación estricta de responsabilidades en `controllers/`, `routes/`, `middleware/`, `services/`, `utils/`, y `types/`.
- **Seguridad Financiera**: Cifrado de contraseñas con `bcrypt` (10 rondas de salt), tokens JWT con expiración estricta, registro de auditoría (`AuditLog`) para eventos sensibles.
- **Frontend Reactivo**: Vue 3 (Composition API) con navegación protegida vía Vue Router guards, persistencia en `localStorage`, detección automática de expiración de sesión vía interceptores de Axios y búsqueda debounceada de 400ms para evitar sobrecarga en la base de datos.

---

## 📁 2. Estructura del Proyecto

```text
pruebatecnica/
├── .env.example                # Variables de entorno unificadas para docker-compose
├── .env                        # Variables de entorno locales
├── docker-compose.yml          # Orquestador de 3 servicios (postgres, backend, frontend)
├── AGENTS.md                   # Documentación técnica exhaustiva del sistema
├── AGENDS.md                   # Alias / Referencia del documento de diseño
│
├── backend/                    # Servidor API Node.js + Express + Prisma
│   ├── Dockerfile              # Imagen Docker con healthcheck de Node 20
│   ├── .env.example            # Variables de entorno requeridas por la API
│   ├── package.json            # Dependencias y scripts
│   ├── tsconfig.json           # Configuración de TypeScript ES2022
│   ├── prisma/
│   │   ├── schema.prisma       # Modelos User, Account, AuditLog
│   │   └── seed.ts             # Datos iniciales para pruebas y demo
│   └── src/
│       ├── index.ts            # Punto de entrada de la aplicación Express
│       ├── controllers/        # Controladores HTTP (Auth, Metrics, Users)
│       │   ├── auth.controller.ts
│       │   ├── metrics.controller.ts
│       │   └── user.controller.ts
│       ├── routes/             # Enrutadores de Express con validación Zod
│       │   ├── auth.routes.ts
│       │   ├── metrics.routes.ts
│       │   ├── user.routes.ts
│       │   └── index.ts
│       ├── middleware/         # Middlewares (Auth JWT, Roles, Zod, ErrorHandler)
│       │   ├── auth.middleware.ts
│       │   ├── errorHandler.middleware.ts
│       │   └── validate.middleware.ts
│       ├── services/           # Lógica de negocio y consultas de datos
│       │   ├── auth.service.ts
│       │   ├── metrics.service.ts
│       │   └── user.service.ts
│       ├── utils/              # Funciones auxiliares reutilizables
│       │   ├── jwt.ts
│       │   ├── password.ts
│       │   ├── prisma.ts
│       │   ├── response.ts
│       │   └── logger.ts
│       └── types/              # Definiciones TypeScript y augmentations
│           ├── auth.types.ts
│           ├── express.d.ts
│           ├── metrics.types.ts
│           └── user.types.ts
│
└── frontend/                   # Interfaz de usuario Vue 3 + Vite
    ├── Dockerfile              # Imagen Docker de desarrollo/producción
    ├── .env.example            # URL del API Backend
    ├── package.json            # Dependencias (Vue 3, Tailwind, Axios, Lucide)
    ├── vite.config.ts          # Configuración Vite con proxy a la API
    ├── tailwind.config.js      # Paleta de colores corporativa Credicord Bank
    ├── postcss.config.js       # Integración PostCSS con Tailwind y Autoprefixer
    ├── index.html              # Template principal con tipografía Inter
    └── src/
        ├── main.ts             # Inicialización de la aplicación Vue
        ├── App.vue             # Layout dinámico (Auth vs Dashboard con Sidebar/Navbar)
        ├── style.css           # Estilos base, glassmorphism y barras de desplazamiento
        ├── api/                # Clientes Axios con interceptores de autenticación
        │   ├── axios.ts        # Instancia central, inyección de token y captura de 401
        │   ├── auth.api.ts
        │   ├── metrics.api.ts
        │   └── users.api.ts
        ├── composables/        # Lógica reactiva reutilizable
        │   ├── useAuth.ts      # Estado de sesión, login, logout, refresh
        │   └── useDebounce.ts  # Retardo inteligente para búsquedas
        ├── router/             # Vue Router con Route Guards de autenticación
        │   └── index.ts
        ├── types/              # Tipos TypeScript compartidos en frontend
        │   └── index.ts
        ├── components/         # Componentes UI atómicos y modulares
        │   ├── Badge.vue       # Insignias de roles y estados
        │   ├── Navbar.vue      # Barra superior con datos del usuario y estado Core
        │   ├── Pagination.vue  # Controles completos de paginación
        │   ├── Sidebar.vue     # Menú lateral con diagnósticos del servidor
        │   ├── StatCard.vue    # Tarjeta de KPI financiero con glow effect
        │   └── UserDetailsModal.vue # Modal con desglose de cuentas del cliente
        └── views/              # Vistas de la aplicación
            ├── LoginView.vue   # Inicio de sesión con credenciales de prueba 1-click
            ├── DashboardView.vue # Resumen de métricas bancarias y auditoría
            ├── UsersView.vue   # Tabla de clientes con búsqueda y filtros
            └── NotFoundView.vue # Página 404
```

---

## 💻 3. Stack Tecnológico

### Backend
- **Node.js (v20+)** con **TypeScript**: Tipado estático y compilación robusta.
- **Express**: Framework web minimalista y veloz.
- **Prisma ORM**: Modelado tipado de datos y migraciones automáticas.
- **PostgreSQL 16**: Motor de base de datos relacional para transaccionalidad bancaria.
- **Zod**: Validación exhaustiva de contratos de entrada en endpoints.
- **JSON Web Tokens (JWT)** & **Bcrypt**: Autenticación segura sin estado.

### Frontend
- **Vue 3 (Composition API / `<script setup>`)**: Reactividad eficiente y código limpio.
- **Vite**: Empaquetador ultrarrápido con soporte Hot Module Replacement (HMR).
- **Vue Router 4**: Gestión de rutas en el cliente con guardias de navegación (`beforeEach`).
- **Tailwind CSS**: Sistema de diseño con estética bancaria premium (Dark mode, glassmorphism, contrastes fintech).
- **Axios**: Cliente HTTP con interceptores automáticos para Bearer tokens y errores 401.
- **Lucide Icons**: Iconografía SVG moderna y minimalista.

---

## 🔐 4. Módulo de Autenticación y Sesiones

### Ciclo de Vida del Token
1. **Inicio de Sesión (`POST /api/auth/login`)**:
   - Se valida el formato de entrada con Zod.
   - Se localiza el usuario y se compara el hash de la contraseña mediante `bcrypt.compare`.
   - Se valida que el estado de la cuenta sea `ACTIVE`.
   - Se genera un token JWT firmado con claims `{ id, email, role, status }` y tiempo de caducidad configurable (`JWT_EXPIRES_IN`, por defecto `2h`).
   - Se almacena un registro de auditoría (`AuditLog`) con la IP y el User-Agent.

2. **Persistencia en Cliente**:
   - El token se almacena en `localStorage` bajo la clave `credicord_auth_token`.
   - En cada arranque de la aplicación (`App.vue`), se valida contra el endpoint `/api/auth/me` para sincronizar los datos del usuario.

3. **Manejo de Token Vencido (401)**:
   - El middleware backend `authenticateToken` detecta el error `TokenExpiredError` y responde con código HTTP `401` y cuerpo:
     ```json
     {
       "success": false,
       "code": "TOKEN_EXPIRED",
       "message": "Tu sesión ha expirado. Por favor inicia sesión nuevamente."
     }
     ```
   - El interceptor de Axios en frontend (`frontend/src/api/axios.ts`) captura el error 401:
     1. Limpia automáticamente `localStorage`.
     2. Dispara el evento global `credicord:session-expired`.
     3. Redirige al usuario a `/login?expired=1`.
     4. La pantalla de login muestra un banner informativo en tono ámbar alertando al usuario de la caducidad de su sesión.

4. **Rutas Protegidas**:
   - `Vue Router` cuenta con una guardia global (`router.beforeEach`):
     - Si la ruta requiere autenticación (`requiresAuth: true`) y no hay token, redirige a `/login`.
     - Si el usuario ya está autenticado e intenta acceder a `/login` (`requiresGuest: true`), es redirigido a `/dashboard`.

---

## 📊 5. Métricas y Panel de Control

El endpoint `GET /api/metrics` calcula en tiempo real los indicadores del banco:
- **Saldo Total en Custodia**: Suma de los balances de todas las cuentas activas en dólares estadounidenses (USD).
- **Cuentas Bancarias**: Conteo total, discriminado por cuentas activas, retenidas/congeladas y cerradas.
- **Usuarios Registrados**: Conteo total de usuarios, activos, inactivos y suspendidos.
- **Nuevos Clientes (30d)**: Incorporaciones durante los últimos 30 días.
- **Distribución de Cartera**: Barras de progreso segmentadas por tipo de producto financiero:
  - Cuentas Corrientes (`CHECKING`)
  - Cuentas de Ahorros (`SAVINGS`)
  - Fondos de Inversión (`INVESTMENT`)
  - Líneas de Crédito (`CREDIT`)
- **Feed de Auditoría**: Monitoreo de eventos administrativos recientes (inicios de sesión, validaciones de seguridad, despliegues de módulos).

---

## 🔍 6. Directorio de Usuarios y Búsqueda con Debounce

El componente `UsersView.vue` implementa:
1. **Debounce (400ms)**:
   - Cuando el usuario escribe en el campo de búsqueda, el composable `useDebounce` posterga la ejecución de la consulta HTTP durante 400ms tras la última tecla pulsada.
   - Permite buscar de forma insensible a mayúsculas/minúsculas por **nombre**, **apellido**, **correo electrónico** o **número de cuenta**.
2. **Filtros Combinados**:
   - Filtro por **Rol** (`TODOS`, `ADMIN`, `DEVELOPER`, `AUDITOR`, `CLIENTE`).
   - Filtro por **Estado** (`TODOS`, `ACTIVO`, `INACTIVO`, `SUSPENDIDO`).
3. **Paginación Dinámica**:
   - Control de página actual, selector de elementos por página (5, 10, 20, 50) y botones de navegación rápida.
4. **Modal de Detalle Bancario**:
   - Permite examinar todas las cuentas asociadas al cliente, su saldo individual y número de cuenta oficial.

---

## 🗄️ 7. Base de Datos y Modelo de Datos (Prisma)

El esquema relacional en `backend/prisma/schema.prisma` define:

```prisma
model User {
  id        String      @id @default(uuid())
  email     String      @unique
  password  String
  firstName String
  lastName  String
  role      Role        @default(USER)
  status    UserStatus  @default(ACTIVE)
  avatar    String?
  createdAt DateTime    @default(now())
  updatedAt DateTime    @updatedAt
  accounts  Account[]
  auditLogs AuditLog[]
}

model Account {
  id            String        @id @default(uuid())
  accountNumber String        @unique
  accountType   AccountType   @default(CHECKING)
  balance       Float         @default(0.0)
  currency      String        @default("USD")
  status        AccountStatus @default(ACTIVE)
  userId        String
  user          User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
}

model AuditLog {
  id        String   @id @default(uuid())
  action    String
  details   String?
  ipAddress String?
  userId    String?
  user      User?    @relation(fields: [userId], references: [id], onDelete: SetNull)
  createdAt DateTime @default(now())
}
```

---

## 🐳 8. Docker & Orquestación de Servicios

El archivo `docker-compose.yml` define 3 servicios independientes:

| Servicio | Imagen / Build | Puerto | Healthcheck |
| :--- | :--- | :--- | :--- |
| **`postgres`** | `postgres:16-alpine` | `5432:5432` | `pg_isready -U postgres -d credicord_devpanel` |
| **`backend`** | `./backend` | `4000:4000` | `curl -f http://localhost:4000/api/health` |
| **`frontend`** | `./frontend` | `5173:5173` | `curl -f http://localhost:5173` |

### Orden de Inicio Dependiente:
- El `backend` espera a que `postgres` reporte `service_healthy`.
- El `frontend` espera a que el `backend` reporte `service_healthy`.
- El contenedor backend ejecuta automáticamente `prisma db push` y la siembra de datos con `seed.ts` al arrancar.

---

## 🚀 9. Guía de Puesta en Marcha

### Opción A: Despliegue con Docker Compose (Recomendado)

En la raíz del proyecto, ejecuta:

```bash
# 1. Iniciar los 3 servicios con construcción de imágenes
docker compose up --build -d

# 2. Verificar el estado de los contenedores y sus healthchecks
docker compose ps
```

- **Frontend**: Abre en tu navegador [http://localhost:5173](http://localhost:5173)
- **Backend API**: Disponible en [http://localhost:4000/api](http://localhost:4000/api)
- **Healthcheck Endpoint**: [http://localhost:4000/api/health](http://localhost:4000/api/health)

Para detener los servicios:
```bash
docker compose down
```

---

### Opción B: Ejecución Local en Entorno de Desarrollo (Sin Docker)

#### 1. Iniciar PostgreSQL
Asegúrate de tener un servidor PostgreSQL corriendo en el puerto 5432 con la base de datos `credicord_devpanel`.

#### 2. Iniciar el Backend
```bash
cd backend
npm install
npx prisma db push
npx prisma db seed
npm run dev
```

#### 3. Iniciar el Frontend
En otra terminal:
```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 10. Credenciales de Prueba Preconfiguradas

El sistema incluye botones de acceso rápido de 1 clic en la pantalla de inicio de sesión:

| Rol | Correo Electrónico | Contraseña | Perfil |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@credicordbank.com` | `Credicord2025!` | Acceso total, gestión de usuarios y métricas globales |
| **Developer** | `dev@credicordbank.com` | `Credicord2025!` | Supervisión técnica, consultas y auditoría técnica |
| **Auditor** | `auditor@credicordbank.com` | `Credicord2025!` | Modo consulta y verificación de cumplimiento normativo |
| **Cliente Demo** | `elena.rios@empresasrios.com` | `Credicord2025!` | Cliente con cuentas corporativas e inversión |
