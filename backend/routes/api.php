<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\WalletController;
use App\Http\Controllers\Api\V1\VoucherController;
use App\Http\Controllers\Api\V1\TransactionController;
use App\Http\Controllers\Api\V1\RedemptionController;

// Auth endpoints (public login) - v1
Route::prefix('v1')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware(['auth:sanctum'])->group(function () {
        // Auth profile
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);

        // Wallet endpoints
        Route::get('/wallet', [WalletController::class, 'show']);
        Route::post('/wallet/deposit', [WalletController::class, 'deposit']);
        Route::post('/wallet/refund', [WalletController::class, 'refund']);

        // Voucher endpoints
        Route::get('/vouchers', [VoucherController::class, 'index']);
        Route::get('/vouchers/{id}', [VoucherController::class, 'show']);
        Route::post('/vouchers/{id}/redeem', [VoucherController::class, 'redeem']);

        // Transaction endpoints
        Route::get('/transactions', [TransactionController::class, 'index']);
        Route::get('/transactions/{id}', [TransactionController::class, 'show']);

        // Redemption endpoints
        Route::get('/redemptions', [RedemptionController::class, 'index']);
        Route::get('/redemptions/{id}', [RedemptionController::class, 'show']);
    });
});
