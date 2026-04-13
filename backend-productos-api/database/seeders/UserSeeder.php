<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['username' => 'admin'],
            [
                'name' => 'Administrador',
                'email' => 'admin@example.com',
                'password' => Hash::make('admin123'),
                'estado' => 'activo',
            ],
        );

        User::updateOrCreate(
            ['username' => 'inactivo'],
            [
                'name' => 'Usuario Inactivo',
                'email' => 'inactivo@example.com',
                'password' => Hash::make('noactivo1'),
                'estado' => 'inactivo',
            ],
        );
    }
}
