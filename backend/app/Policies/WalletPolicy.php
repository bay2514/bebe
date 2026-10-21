<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Wallet;

class WalletPolicy
{
    public function view(User $user, Wallet $wallet): bool
    {
        return $wallet->users()->where('user_id', $user->id)->exists();
    }

    public function update(User $user, Wallet $wallet): bool
    {
        return $wallet->users()->where('user_id', $user->id)->exists();
    }
}
