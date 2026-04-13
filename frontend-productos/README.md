# Frontend Productos - Parcial Practico

Aplicacion frontend profesional para autenticacion JWT y CRUD de productos consumiendo una API REST.

## Stack

- React + TypeScript + Vite
- React Router DOM para rutas y proteccion de vistas
- Axios con interceptores para token y manejo de 401/403
- React Hook Form + Zod para formularios y validaciones

## Arquitectura

```text
src/
  modules/
    auth/
      api/authApi.ts
      guards/RequireAuth.tsx
      pages/LoginPage.tsx
    products/
      api/productsApi.ts
      components/
        PaginationControls.tsx
        ProductFilters.tsx
        ProductFormModal.tsx
        ProductsTable.tsx
      pages/ProductsPage.tsx
  shared/
    api/httpClient.ts
    config/env.ts
    constants/storageKeys.ts
    types/
    utils/
  App.tsx
  main.tsx
  index.css
```

## Variables de entorno

1. Copia `.env.example` a `.env`.
2. Ajusta la URL del backend:

```env
VITE_API_BASE_URL=http://localhost:3000
```

## Comandos y para que sirven

1. `npm install`
   Instala dependencias del proyecto.

2. `npm run dev`
   Levanta el entorno de desarrollo en `http://localhost:5173`.

3. `npm run build`
   Genera build de produccion en `dist/`.

4. `npm run preview`
   Sirve localmente el build de produccion para validacion final.

5. `npm run lint`
   Ejecuta analisis estatico para detectar problemas de calidad.

## Flujo funcional implementado

1. Login con `usuario` y `contrasena`.
2. Obtencion y almacenamiento de `access_token`.
3. Ruta protegida `/productos`.
4. Logout y limpieza de token.
5. Manejo automatico de `401` y `403` con redireccion al login.
6. CRUD completo de productos.
7. Validaciones frontend por campo.
8. Filtros combinados por nombre, subcategoria y estado.
9. Paginacion con `page` y `limit`.

## Docker

### Desarrollo con Docker

```bash
docker compose up frontend-dev --build
```

- Publica Vite en `http://localhost:5173`.
- Usa volumen para hot reload.

### Produccion con Docker

```bash
docker compose up frontend-prod --build
```

- Build multietapa (Node -> Nginx).
- Publica la SPA en `http://localhost:8080`.

### Build y run manual (sin compose)

```bash
docker build -t frontend-productos .
docker run -p 8080:80 frontend-productos
```

## Flujo de pruebas sugerido

1. Abrir login.
2. Intentar `/productos` sin token y validar redireccion.
3. Login invalido y validar error visible.
4. Login valido y validar acceso a listado.
5. Crear producto y validar recarga automatica.
6. Editar producto y validar cambios en lista.
7. Eliminar producto con confirmacion.
8. Probar filtros combinados.
9. Validar paginacion y resumen de pagina.
10. Forzar token invalido y validar redireccion automatica.

## Notas de aprendizaje profesional

- Separar `modules` y `shared` reduce acoplamiento y mejora mantenibilidad.
- Centralizar Axios evita duplicar headers y manejo de errores.
- Validar en frontend y backend mejora UX y robustez.
- Dockerizar dev y prod reduce diferencias de entorno en la entrega.
