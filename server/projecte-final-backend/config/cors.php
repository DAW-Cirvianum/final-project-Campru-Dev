<?php
return [
    'paths' => ['api/*'], // todas las rutas que React usa
    'allowed_methods' => ['*'], // GET, POST, PUT, etc.
    'allowed_origins' => ['http://localhost:5174'], // <- tu frontend exacto
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'], // permite todos los headers
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true, // <- MUY IMPORTANTE
];
