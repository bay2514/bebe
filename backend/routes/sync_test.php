<?php

use Illuminate\Support\Facades\Route;

Route::get('/sync-wallet-test', function () {
    $wallet = \App\Models\Wallet::first();
    if ($wallet) {
        $allUserIds = \App\Models\User::pluck('id')->toArray();
        $wallet->users()->sync($allUserIds);
        return response()->json([
            'message' => 'Synced successfully!',
            'users' => $wallet->users->pluck('name')
        ]);
    }
    return response()->json(['message' => 'Wallet not found'], 404);
});
