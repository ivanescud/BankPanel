# 🏦 Credicord Bank - DevPanel

Panel administrativo bancario desarrollado con **Vue 3**, **Node.js (Express + TypeScript)** y **PostgreSQL (Prisma)**.

---

## 🚀 Cómo correr el proyecto

### Opción 1: Con Docker (Recomendada y más rápida)

Solo necesitas tener instalado **Docker** y **Docker Compose**:

1. Clona el repositorio y entra en la carpeta:
   ```bash
   git clone https://github.com/ivanescudero/BankPanel.git "devpanel-[Ivan Escudero]"
   cd "devpanel-[Ivan Escudero]"
   ```

2. Copia el archivo de variables de entorno:
   ```bash
   cp .env.example .env
   ```

3. Levanta los contenedores:
   ```bash
   docker compose up --build
   ```

Listo. Esto levantará automáticamente la base de datos PostgreSQL, ejecutará las migraciones, sembrará los datos de prueba (`seed`), y pondrá en marcha la API y la aplicación web:

- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:4000/api](http://localhost:4000/api)
- **Health check:** [http://localhost:4000/api/health](http://localhost:4000/api/health)

---

### Opción 2: Ejecución local (Sin Docker)

#### Requisitos:
- Node.js (v20+)
- PostgreSQL corriendo localmente en el puerto `5432` con una base de datos llamada `credicord_devpanel`.

#### 1. Configurar y arrancar el Backend:
```bash
cd backend
cp .env.example .env
npm install
npx prisma db push
npx prisma db seed
npm run dev
```
*El backend quedará corriendo en `http://localhost:4000`.*

#### 2. Configurar y arrancar el Frontend:
En otra terminal:
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```
*El frontend quedará disponible en `http://localhost:5173`.*

---

## 🔑 Credenciales de prueba

El login incluye botones de acceso rápido con 1 solo clic. También puedes ingresar manualmente con cualquiera de estas cuentas:

| Rol | Correo Electrónico | Contraseña |
| :--- | :--- | :--- |
| **Admin** | `admin@credicordbank.com` | `Credicord2025!` |
| **Developer** | `dev@credicordbank.com` | `Credicord2025!` |
| **Auditor** | `auditor@credicordbank.com` | `Credicord2025!` |
| **Cliente** | `elena.rios@empresasrios.com` | `Credicord2025!` |

---

## 🛠️ Stack Tecnológico

- **Frontend:** Vue 3, Vite, Tailwind CSS, Vue Router, Axios.
- **Backend:** Node.js, Express, TypeScript, Prisma ORM, Zod, JWT, Bcrypt.
- **Base de Datos:** PostgreSQL 16.
- **Contenedores:** Docker & Docker Compose.
