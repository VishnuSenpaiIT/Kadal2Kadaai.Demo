<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Harbor extends Model
{
    protected $fillable = [
        'name',
        'latitude',
        'longitude',
        'city',
        'pincode',
    ];

    public function products()
    {
        return $this->hasMany(Product::class, 'origin_harbor_id');
    }
}
