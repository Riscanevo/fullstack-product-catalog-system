<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;
use Illuminate\Support\Facades\Route;

Route::post('/auth', [AuthController::class, 'login']);

Route::middleware('auth.jwt')->group(function (): void {
    Route::get('/productos', [ProductController::class, 'index']);
    Route::post('/productos', [ProductController::class, 'store']);
    Route::get('/productos/{producto}', [ProductController::class, 'show']);
    Route::put('/productos/{producto}', [ProductController::class, 'update']);
    Route::delete('/productos/{producto}', [ProductController::class, 'destroy']);
});
