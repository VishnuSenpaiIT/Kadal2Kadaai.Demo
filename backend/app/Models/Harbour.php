<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Harbour extends Model
{
    protected $fillable = [
        'harbour_name',
        'harbour_code',
        'description',
        'address_line_1',
        'address_line_2',
        'area_locality',
        'landmark',
        'city',
        'district',
        'state',
        'country',
        'pincode',
        'latitude',
        'longitude',
        'google_place_id',
        'google_plus_code',
        'timezone',
        'status',
    ];

    /**
     * Get products originating from this harbour.
     */
    public function products(): HasMany
    {
        return $this->hasMany(Product::class, 'origin_harbor_id');
    }
}
