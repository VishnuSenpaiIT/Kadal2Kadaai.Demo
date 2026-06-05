<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ConsumerProfile extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'user_id',
        'preferred_delivery_address_id',
        'loyalty_points',
        'total_orders',
        'lifetime_spending',
        'last_order_date',
    ];

    protected $casts = [
        'last_order_date' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function preferredAddress(): BelongsTo
    {
        return $this->belongsTo(Address::class, 'preferred_delivery_address_id');
    }
}
