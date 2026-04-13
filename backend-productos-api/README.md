# Backend Productos API - Laravel + MySQL + JWT

API REST para autenticacion y gestion de productos del parcial de Desarrollo Avanzado.

## Stack

- PHP 8.2+
- Laravel 12
- MySQL 8+
- JWT con firebase/php-jwt

## Arquitectura

- Login JWT: POST /api/auth
- CRUD protegido de productos: /api/productos
- Middleware de autenticacion por token Bearer
- Validaciones con FormRequest
- Seeders de usuarios y productos iniciales

## Configuracion MySQL

### 1. Crear base de datos

```sql
CREATE DATABASE backend_productos_api CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Tambien tienes una referencia de esquema en database/schema_mysql.sql.

### 2. Variables de entorno

En .env (ya configurado en este proyecto):

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=backend_productos_api
DB_USERNAME=root
DB_PASSWORD=

JWT_SECRET=CAMBIA_ESTE_VALOR_POR_UNO_SEGURO
JWT_TTL=120
JWT_ALGO=HS256
JWT_ISSUER=backend-productos-api
```

## Instalacion y ejecucion

1. Instalar dependencias:

```bash
composer install
```

2. Ejecutar migraciones y seed:

```bash
php artisan migrate:fresh --seed
```

3. Levantar servidor:

```bash
php artisan serve
```

Servidor local: http://127.0.0.1:8000

## Credenciales de prueba

- Activo: admin / admin123
- Inactivo: inactivo / noactivo1

## Endpoints

### Publico

- POST /api/auth

Body:

```json
{
    "usuario": "admin",
    "contrasena": "admin123"
}
```

### Protegidos (Bearer token)

- GET /api/productos
- GET /api/productos/{id}
- POST /api/productos
- PUT /api/productos/{id}
- DELETE /api/productos/{id}

Filtros y paginacion en listado:

- nombre
- subcategoria
- estado
- page
- limit

Ejemplo:

GET /api/productos?nombre=laptop&estado=activo&page=1&limit=10

## Integracion con el frontend

En tu frontend usa:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

## Flujo de prueba rapido

1. Login con admin/admin123 y obtener token.
2. Consultar GET /api/productos con Authorization: Bearer <token>.
3. Crear, editar y eliminar un producto.
4. Probar login con inactivo/noactivo1 y validar 403.
