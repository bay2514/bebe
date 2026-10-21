<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$wallet = \App\Models\Wallet::first();
$users = \App\Models\User::all();
if ($wallet) {
    $wallet->users()->sync($users->pluck('id')->toArray());
    echo "SUCCESS: Synced " . $users->count() . " users (" . implode(', ', $users->pluck('name')->toArray()) . ") to wallet #" . $wallet->id . "\n";
} else {
    echo "ERROR: Wallet not found.\n";
}
