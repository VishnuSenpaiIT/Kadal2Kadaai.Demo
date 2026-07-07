<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ShippingSetting extends Model
{
    protected $fillable = [
        'google_maps_api_key',
    ];

    protected $casts = [
        'google_maps_api_key' => 'encrypted',
    ];
}
