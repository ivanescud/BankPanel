# AI-LOG

## 1. Herramientas de IA utilizadas

Durante el desarrollo de esta prueba utilicé herramientas de inteligencia artificial como apoyo para acelerar algunas partes del proceso.

Principalmente utilicé:

- Antigravity con GEMINI 3.8, para ayudarme con la generación y modificación del código dentro del proyecto.

Intenté usar la IA principalmente como una herramienta de apoyo y no simplemente aceptar todo el código generado. Algunas partes las revisé, modifiqué o descarté cuando consideré que no eran necesarias para el alcance de la prueba.

## 2. Stack elegido y por qué

### Frontend

- Vue 3
- Vite
- TypeScript
- Vue Router
- Axios
- Tailwind CSS

### Backend

- Node.js
- Express
- TypeScript
- Prisma ORM

### Base de datos

- PostgreSQL 16

### Infraestructura

- Docker
- Docker Compose

Elegí Vue y Node.js principalmente porque son tecnologías con las que ya tengo experiencia y me permiten trabajar rápido.

Consideré utilizar SQLite para ahorrar tiempo, pero finalmente decidí utilizar PostgreSQL junto con Docker que es el entorno que mas uso asi facilitar la ejecución del proyecto para la persona que lo revise.

En el backend utilicé una arquitectura por capas simple:

Los servicios los organize por modulos
routes/
controllers/
services/
middleware/
utils/
types/

## 3. Cómo prioricé el desarrollo

Antes de comenzar decidí priorizar completamente los requisitos P0.

Mi orden de trabajo fue aproximadamente:

1. Preparar la estructura del proyecto.
2. Levantar frontend, backend y PostgreSQL con Docker.
3. Configurar la base de datos y los datos iniciales.
4. Implementar autenticación.
5. Implementar la API de usuarios.
6. Crear el login en frontend.
7. Proteger las rutas.
8. Construir el dashboard.
9. Agregar búsqueda con debounce.

## 4. Prompts representativos

No incluyo todos los mensajes utilizados con IA, sino algunos de los prompts que tuvieron mayor impacto sobre el desarrollo.

### Prompt 1 — Organización inicial del proyecto

**Prompt utilizado:**

Genera un proyecto de Devpanel para el banco credicordbank el mismo debe contar con acceso de login con email y password, sesion persitente con jwt y manejo de errores de token vencio y login rutas protegidas un dasboard con metricas de usuarios y cuentas, una tabla de usuario con paginacion, y busqueda debounce , y un logout. El stack que usaremos sera para el backend nodejs + express y para la base datos usaremos postgres con prisma , organizemo en arquitetura de simple con controllers/
routes/
middleware/
services/
utils/
types/ para el frontend usaremos Vue + Vite y Vue router para las rutas, para diseños configura tailwind css para el style y axio para los request, todo lo organizaremos en un docker Crea un docker-compose.yml inicial con tres servicios. Agrega healthcheck y el docuemnto de .env.example para organizar las variables tanto backend como frontend. crea un documento AGENDS.md para colocar la estructura del proyecto y sus detalles

### Qué me devolvió la IA

La IA propuso la estructura inicial del repositorio, configuración del frontend y backend, Dockerfiles y un `docker-compose.yml`.

### Qué hice con el resultado

Revisé la estructura propuesta antes de continuar.
Hice distinte pruebas de rutas, y de entorno para verificar que cumpliera con todo los asignado.

### Prompt 2 — [Completar durante el desarrollo]

**Prompt utilizado:**

agrega un seed con datos de usuarios para login y datos del dashboard y corre la migracion , configura las migraciones de forma automatica

### Qué me devolvió la IA

Organizo y ejectuto la migracion en prisma y genere el seed con los datos requeridos.

## 5. Un caso donde no acepté directamente lo generado por la IA

En terminos de diseño la ia genero template muy repetitivo y diseños poco limpios.

Regenere el diseño del app basado en los colores del banco y un visual mucho mas limpia.

## 6. Qué partes hizo la IA y qué partes hice yo

Estimación aproximada al finalizar el proyecto:

- Código generado o sugerido por IA: 90%
- Código escrito o modificado directamente por mí: 10%

No considero que esta división sea completamente exacta porque en varios casos la IA generó una primera versión y después yo la revisé o modifiqué algun cosas pequeñas.

Mi participación estuvo principalmente en:

elegir el stack;
definir la arquitectura;

priorizar funcionalidades;
decidir qué no implementar;
dividir el trabajo en etapas;
revisar el código generado;
probar los flujos;
corregir problemas;
decidir cuándo simplificar una solución.

La IA se utilizó principalmente para acelerar:

configuración inicial;
generación de código repetitivo;
estructuras de endpoints;
componentes de frontend;
configuración de Docker;
generacion de documentos Readme y entructura de documentos de texto.

## 7. Algo que la IA hizo bien

Una de las cosas que mejor hizo la IA fue acelerar la creación de la estructura inicial del proyecto.
En una prueba con tiempo limitado, generar rápidamente configuraciones repetitivas como TypeScript, Express, Docker o componentes base me permitió concentrar más tiempo en probar que los flujos principales realmente funcionaran.
Tambien al generar genero la estructura de seguridad basica como bcryptjs pas contraseña, algo que no indique al generarlo pero lo mantuve ya que es una buena practica.

## 8. Algo que la IA hizo mal o que tuve que vigilar

al generar el proyecto no establece la configuracion de las migraciones para la base de datos por ende. el proyecto no creaba las tablas iniciales lo que indique y solicite la configuracion inicial automatica de las migraciones requerida en la base de datos.

## 9. Decisiones conscientes de alcance

Por el límite de tiempo decidí priorizar funcionalidad sobre cantidad de características.
