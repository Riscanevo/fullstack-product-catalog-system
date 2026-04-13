<?php

namespace App\Services;

use App\Models\User;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use RuntimeException;

class JwtService
{
    public function generateToken(User $user): string
    {
        $secret = (string) config('jwt.secret');

        if ($secret === '') {
            throw new RuntimeException('JWT secret no configurado. Define JWT_SECRET en .env.');
        }

        $ttlInSeconds = (int) config('jwt.ttl', 120) * 60;
        $issuedAt = time();

        $payload = [
            'iss' => (string) config('jwt.issuer', 'backend-productos-api'),
            'sub' => $user->id,
            'iat' => $issuedAt,
            'exp' => $issuedAt + $ttlInSeconds,
            'username' => $user->username,
        ];

        return JWT::encode($payload, $secret, (string) config('jwt.algo', 'HS256'));
    }

    public function decodeToken(string $token): object
    {
        return JWT::decode(
            $token,
            new Key((string) config('jwt.secret'), (string) config('jwt.algo', 'HS256')),
        );
    }
}
