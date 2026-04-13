<?php

namespace App\Http\Middleware;

use App\Models\User;
use App\Services\JwtService;
use Closure;
use Firebase\JWT\ExpiredException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class AuthenticateJwt
{
    public function __construct(private readonly JwtService $jwtService)
    {
    }

    public function handle(Request $request, Closure $next): Response
    {
        $authorizationHeader = (string) $request->header('Authorization', '');

        if (! str_starts_with($authorizationHeader, 'Bearer ')) {
            return response()->json([
                'message' => 'Token no proporcionado.',
            ], 401);
        }

        $token = trim(substr($authorizationHeader, 7));

        if ($token === '') {
            return response()->json([
                'message' => 'Token no proporcionado.',
            ], 401);
        }

        try {
            $payload = $this->jwtService->decodeToken($token);
        } catch (ExpiredException) {
            return response()->json([
                'message' => 'Token expirado.',
            ], 401);
        } catch (Throwable) {
            return response()->json([
                'message' => 'Token invalido.',
            ], 401);
        }

        $userId = (int) ($payload->sub ?? 0);
        $user = User::query()->find($userId);

        if (! $user) {
            return response()->json([
                'message' => 'Usuario no encontrado para el token enviado.',
            ], 401);
        }

        if ($user->estado !== 'activo') {
            return response()->json([
                'message' => 'Usuario inactivo.',
            ], 403);
        }

        Auth::setUser($user);

        return $next($request);
    }
}
