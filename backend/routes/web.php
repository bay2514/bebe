<?php

use Illuminate\Support\Facades\Route;

// SPA Fallback Route: Serve index.html for all requests except api, sanctum, and up
Route::get('{any}', function () {
    $path = public_path('index.html');
    if (file_exists($path)) {
        return file_get_contents($path);
    }
    return view('welcome');
})->where('any', '^(?!api|sanctum|up).*$');
