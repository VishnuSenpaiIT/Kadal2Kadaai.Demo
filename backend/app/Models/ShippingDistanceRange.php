<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShippingDistanceRange extends Model
{
    protected $fillable = [
        'from_distance',
        'to_distance',
        'shipping_price',
        'status',
    ];

    protected $casts = [
        'from_distance' => 'float',
        'to_distance' => 'float',
        'shipping_price' => 'float',
        'status' => 'boolean',
    ];
}
