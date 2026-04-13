CREATE DATABASE IF NOT EXISTS backend_productos_api CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE backend_productos_api;

CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NULL,
  email VARCHAR(255) NULL UNIQUE,
  email_verified_at TIMESTAMP NULL,
  password VARCHAR(255) NOT NULL,
  estado ENUM('activo', 'inactivo') NOT NULL DEFAULT 'activo',
  remember_token VARCHAR(100) NULL,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL
);

CREATE TABLE IF NOT EXISTS products (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT NOT NULL,
  subcategoria VARCHAR(255) NOT NULL,
  precio DECIMAL(12, 2) NOT NULL,
  precioxcantidad DECIMAL(12, 2) NOT NULL,
  estado ENUM('activo', 'inactivo') NOT NULL DEFAULT 'activo',
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  INDEX idx_products_subcategoria (subcategoria),
  INDEX idx_products_estado (estado)
);

-- Nota: usuarios y productos de prueba se cargan con:
-- php artisan migrate:fresh --seed
