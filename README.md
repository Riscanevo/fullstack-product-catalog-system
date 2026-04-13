# Parcial Desarrollo Avanzado App

Implementacion fullstack de una API REST de productos con autenticacion JWT y una interfaz web administrativa para gestionar el catalogo.

Este repositorio esta pensado para:

- Presentacion profesional en GitHub.
- Ejecucion local rapida para demo y revision tecnica.
- Base limpia para adaptar una copia al formato academico de la universidad.

---

## 1) Resumen 

El proyecto esta dividido en dos aplicaciones desacopladas:

1. Backend: API REST en Laravel 12 + MySQL + JWT.
2. Frontend: SPA en React + TypeScript + Vite.

Capacidades principales:

- Login con usuario y contraseña.
- Emision y validacion de token JWT.
- Rutas protegidas por middleware.
- CRUD completo de productos.
- Filtros por nombre, subcategoria y estado.
- Paginacion del listado.
- Validaciones en frontend y backend.
- Docker para frontend (desarrollo y produccion).

---

## 2) Arquitectura General

```text
[ React + Vite SPA ]  <----HTTP JSON---->  [ Laravel API ]  <---->  [ MySQL ]
        |                                            |
        |-- Login, guard de rutas, CRUD UI           |-- Auth, middleware JWT, validaciones, CRUD
```

Principio aplicado: separacion de responsabilidades.

- El frontend se concentra en UX, navegacion y estado de interfaz.
- El backend se concentra en reglas de negocio, seguridad y persistencia.

---

## 3) Estructura del Repositorio

```text
Parcial_Desarrollo_Avanzado_App/
  backend-productos-api/      # API Laravel + JWT + MySQL
  frontend-productos/         # SPA React + TypeScript
  parcial-enunciado-frontend.md
```

Estructura destacada del frontend:

```text
frontend-productos/src/
  modules/
    auth/
    products/
  shared/
    api/
    config/
    constants/
    types/
    utils/
```

---

## 4) Stack Tecnologico

Backend:

- PHP 8.2+
- Laravel 12
- MySQL 8+
- firebase/php-jwt

Frontend:

- React 19
- TypeScript
- Vite
- React Router
- Axios
- React Hook Form + Zod

Infraestructura:

- Docker y Docker Compose (frontend)
- Nginx (serving SPA en produccion)

---

## 5) Requisitos Previos

Instalar en tu maquina:

- Node.js 20+ (recomendado 22)
- npm 10+
- PHP 8.2+
- Composer 2+
- MySQL 8+
- Git
- Docker Desktop (opcional, para flujo con contenedores)

---

## 6) Configuracion Rapida (Local)

### 6.1 Backend

Ubicacion: backend-productos-api

1. Instalar dependencias:

```bash
composer install
```

2. Crear archivo de entorno:

```bash
cp .env.example .env
```

En Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

3. Configurar variables en .env (base de datos y JWT):

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=backend_productos_api
DB_USERNAME=root
DB_PASSWORD=tu_password

JWT_SECRET=coloca_un_secreto_largo_y_unico
JWT_TTL=120
JWT_ALGO=HS256
JWT_ISSUER=backend-productos-api
```

4. Generar APP_KEY:

```bash
php artisan key:generate
```

5. Ejecutar migraciones y seeders:

```bash
php artisan migrate:fresh --seed
```

6. Levantar API:

```bash
php artisan serve
```

API disponible en:

- http://127.0.0.1:8000
- Base API: http://127.0.0.1:8000/api

### 6.2 Frontend

Ubicacion: frontend-productos

1. Instalar dependencias:

```bash
npm install
```

2. Crear variables de entorno:

```bash
cp .env.example .env
```

En Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

3. Verificar URL del backend en .env:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

4. Levantar frontend:

```bash
npm run dev
```

Frontend disponible en:

- http://localhost:5173

---

## 7) Credenciales de Prueba

Cargadas por seeders:

- Usuario activo: admin / admin123
- Usuario inactivo: inactivo / noactivo1

---

## 8) Endpoints Principales

Publico:

- POST /api/auth

Protegidos con Bearer token:

- GET /api/productos
- GET /api/productos/{id}
- POST /api/productos
- PUT /api/productos/{id}
- DELETE /api/productos/{id}

Query params soportados en listado:

- nombre
- subcategoria
- estado
- page
- limit

Ejemplo:

```http
GET /api/productos?nombre=laptop&estado=activo&page=1&limit=10
Authorization: Bearer <token>
```

---

## 9) Flujo Funcional Esperado

1. Login con admin/admin123.
2. Guardar token recibido.
3. Acceder a la vista de productos.
4. Crear un producto.
5. Editar un producto.
6. Eliminar un producto.
7. Aplicar filtros y paginacion.
8. Probar usuario inactivo y validar acceso denegado.

---

## 10) Docker (Frontend)

### Desarrollo con Docker

```bash
cd frontend-productos
docker compose up frontend-dev --build
```

- Publica en http://localhost:5173
- Incluye hot reload

### Produccion con Docker

```bash
cd frontend-productos
docker compose up frontend-prod --build
```

- Build multietapa (Node -> Nginx)
- Publica en http://localhost:8080

---

## 11) Buenas Practicas Aplicadas

- Arquitectura modular por dominio (auth y products).
- Cliente HTTP centralizado con interceptores.
- Guard de rutas protegidas en frontend.
- Validacion de formularios con esquema tipado (Zod).
- Validaciones de entrada en backend con FormRequest.
- Middleware dedicado para autenticacion JWT.
- Seeders para datos de arranque reproducibles.
- Configuracion por variables de entorno.
- Docker separado para desarrollo y produccion.

---

## 12) Scripts Utiles

Frontend:

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

Backend:

```bash
php artisan serve
php artisan migrate:fresh --seed
php artisan config:clear
php artisan route:list
```

---

## 13) Solucion de Problemas Comunes

1. Error de conexion a MySQL:

- Validar DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME y DB_PASSWORD en .env.
- Confirmar que el servicio de MySQL este activo.

2. Cambios en .env no aplican:

```bash
php artisan config:clear
```

3. 401 en endpoints protegidos:

- Confirmar header Authorization con formato Bearer token.
- Verificar expiracion del JWT.

4. Frontend no conecta al backend:

- Revisar VITE_API_BASE_URL en frontend-productos/.env.
- Confirmar backend ejecutandose en puerto 8000.



---

## 14) Roadmap Sugerido

- Estandarizar formato unico de respuestas (data/error/code/message).
- Agregar tests automáticos (Feature tests Laravel y unit tests frontend).
- Exportar coleccion Postman oficial.
- Incorporar CI en GitHub Actions.


---

## 15) Autor

Proyecto desarrollado para practica y entrega de parcial en Desarrollo Avanzado de App en Red.
