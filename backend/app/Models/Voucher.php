<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Voucher extends Model
{
    protected $fillable = [
        'title',
        'description',
        'location',
        'category',
        'emoji',
        'price',
        'is_active',
        'is_recurring',
    ];

    protected $casts = [
        'price' => 'integer',
        'is_active' => 'boolean',
        'is_recurring' => 'boolean',
    ];

    public function redemptions()
    {
        return $this->hasMany(Redemption::class);
    }
}
