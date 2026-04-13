<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'nombre' => ['required', 'string', 'max:255'],
            'descripcion' => ['required', 'string'],
            'subcategoria' => ['required', 'string', 'max:255'],
            'precio' => ['required', 'numeric', 'gt:0'],
            'precioxcantidad' => ['required', 'numeric', 'gt:0'],
            'estado' => ['required', Rule::in(['activo', 'inactivo'])],
        ];
    }
}
