<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = App::make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$wallet = \App\Models\Wallet::first();
if ($wallet) {
    $allUserIds = \App\Models\User::pluck('id')->toArray();
    $wallet->users()->sync($allUserIds);
    echo "Synced users to wallet successfully!\nNames: " . implode(', ', $wallet->users->pluck('name')->toArray()) . "\n";
} else {
    echo "No wallet found.\n";
}
