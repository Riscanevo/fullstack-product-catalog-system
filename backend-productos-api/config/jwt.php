<?php

return [
    'secret' => env('JWT_SECRET', ''),
    'ttl' => (int) env('JWT_TTL', 120),
    'algo' => env('JWT_ALGO', 'HS256'),
    'issuer' => env('JWT_ISSUER', env('APP_NAME', 'backend-productos-api')),
];
