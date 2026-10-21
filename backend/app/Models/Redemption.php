<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Redemption extends Model
{
    protected $fillable = [
        'wallet_id',
        'user_id',
        'voucher_id',
        'transaction_id',
        'status',
        'price_snapshot',
        'used_at',
    ];

    protected $casts = [
        'price_snapshot' => 'integer',
        'used_at' => 'datetime',
    ];

    public function wallet()
    {
        return $this->belongsTo(Wallet::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function voucher()
    {
        return $this->belongsTo(Voucher::class);
    }

    public function transaction()
    {
        return $this->belongsTo(Transaction::class);
    }
}
