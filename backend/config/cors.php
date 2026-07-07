<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    'allowed_origins' => [env('FRONTEND_URL', 'http://localhost:3000')],
    'allowed_origins_patterns' => ['#^https://.*\.vercel\.app$#', '#^http://localhost:\d+$#'],
    // Fix 14: Restrict to only headers actually needed — was '*' (too permissive)
    'allowed_headers' => ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With', 'X-CSRF-TOKEN'],
    'exposed_headers' => [],
    'max_age' => 86400, // Cache preflight for 24h
    'supports_credentials' => true,
];
