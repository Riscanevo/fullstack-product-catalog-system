<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Product\StoreProductRequest;
use App\Http\Requests\Product\UpdateProductRequest;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nombre' => ['nullable', 'string', 'max:255'],
            'subcategoria' => ['nullable', 'string', 'max:255'],
            'estado' => ['nullable', Rule::in(['activo', 'inactivo'])],
            'page' => ['nullable', 'integer', 'min:1'],
            'limit' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

        $limit = (int) ($validated['limit'] ?? 10);

        $query = Product::query();

        if (! empty($validated['nombre'])) {
            $query->where('nombre', 'like', '%'.$validated['nombre'].'%');
        }

        if (! empty($validated['subcategoria'])) {
            $query->where('subcategoria', $validated['subcategoria']);
        }

        if (! empty($validated['estado'])) {
            $query->where('estado', $validated['estado']);
        }

        $products = $query
            ->orderByDesc('id')
            ->paginate($limit)
            ->appends($request->query());

        return response()->json([
            'data' => $products->items(),
            'meta' => [
                'total' => (int) $products->total(),
                'currentPage' => (int) $products->currentPage(),
                'perPage' => (int) $products->perPage(),
                'totalPages' => (int) $products->lastPage(),
            ],
        ]);
    }

    public function store(StoreProductRequest $request): JsonResponse
    {
        $product = Product::create($request->validated());

        return response()->json([
            'message' => 'Producto creado correctamente.',
            'data' => $product,
        ], 201);
    }

    public function show(Product $producto): JsonResponse
    {
        return response()->json([
            'data' => $producto,
        ]);
    }

    public function update(UpdateProductRequest $request, Product $producto): JsonResponse
    {
        $producto->update($request->validated());

        return response()->json([
            'message' => 'Producto actualizado correctamente.',
            'data' => $producto,
        ]);
    }

    public function destroy(Product $producto): JsonResponse
    {
        $producto->delete();

        return response()->json([
            'message' => 'Producto eliminado correctamente.',
        ]);
    }
}
