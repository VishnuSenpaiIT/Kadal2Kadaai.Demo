<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PincodeDistance extends Model
{
    use HasFactory;

    protected $fillable = [
        'harbor_id',
        'destination_pincode',
        'distance_km',
        'duration_minutes',
        'status',
    ];

    public function harbor()
    {
        return $this->belongsTo(Harbour::class, 'harbor_id');
    }
}
