<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table): void {
            $table->id();
            $table->string('nombre');
            $table->text('descripcion');
            $table->string('subcategoria');
            $table->decimal('precio', 12, 2);
            $table->decimal('precioxcantidad', 12, 2);
            $table->enum('estado', ['activo', 'inactivo'])->default('activo');
            $table->timestamps();

            $table->index('subcategoria');
            $table->index('estado');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
