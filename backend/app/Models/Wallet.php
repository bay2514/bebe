<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Wallet extends Model
{
    protected $fillable = ['name', 'balance'];

    public function users()
    {
        return $this->belongsToMany(User::class, 'wallet_user');
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    public function redemptions()
    {
        return $this->hasMany(Redemption::class);
    }
}
