<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use App\Services\JwtService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(LoginRequest $request, JwtService $jwtService): JsonResponse
    {
        $credentials = $request->validated();

        $user = User::where('username', $credentials['usuario'])->first();

        if (! $user || ! Hash::check($credentials['contrasena'], $user->password)) {
            return response()->json([
                'message' => 'Credenciales incorrectas.',
            ], 401);
        }

        if ($user->estado !== 'activo') {
            return response()->json([
                'message' => 'Usuario inactivo.',
            ], 403);
        }

        $token = $jwtService->generateToken($user);

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'expires_in' => (int) config('jwt.ttl', 120) * 60,
            'user' => [
                'id' => $user->id,
                'username' => $user->username,
                'estado' => $user->estado,
            ],
        ]);
    }
}
