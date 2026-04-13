<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'nombre' => 'Laptop Pro 14',
                'descripcion' => 'Equipo portatil de alto rendimiento para desarrollo.',
                'subcategoria' => 'Computo',
                'precio' => 5200000,
                'precioxcantidad' => 5200000,
                'estado' => 'activo',
            ],
            [
                'nombre' => 'Mouse Ergonomico',
                'descripcion' => 'Mouse inalambrico para uso prolongado.',
                'subcategoria' => 'Perifericos',
                'precio' => 120000,
                'precioxcantidad' => 120000,
                'estado' => 'activo',
            ],
            [
                'nombre' => 'Monitor 27 Pulgadas',
                'descripcion' => 'Monitor IPS con resolucion QHD.',
                'subcategoria' => 'Monitores',
                'precio' => 980000,
                'precioxcantidad' => 980000,
                'estado' => 'inactivo',
            ],
        ];

        foreach ($products as $product) {
            Product::updateOrCreate(
                ['nombre' => $product['nombre']],
                $product,
            );
        }
    }
}
