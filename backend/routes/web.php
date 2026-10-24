<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;

// GET /up - Health check without touching DB
Route::get('/up', function () {
    return response()->json(['status' => 'ok']);
});

// Named login route for unauthenticated API requests redirection fallback
Route::get('/login', function () {
    return response()->json(['message' => 'Unauthenticated.'], 401);
})->name('login');

// GET /health/db - Health check for DB (select 1)
Route::get('/health/db', function () {
    try {
        DB::select('select 1');
        return response()->json(['ok' => true]);
    } catch (\Exception $e) {
        return response()->json(['ok' => false]);
    }
});

// SPA Fallback Route: Serve index.html for all requests except api, sanctum, and up
Route::get('{any}', function () {
    $path = public_path('index.html');
    if (file_exists($path)) {
        return file_get_contents($path);
    }
    return view('welcome');
})->where('any', '^(?!api|sanctum|up|health/db).*$');
