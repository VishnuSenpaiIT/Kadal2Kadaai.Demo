<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Product extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'seller_id',
        'category_id',
        'name',
        'slug',
        'short_description',
        'full_description',
        'price',
        'sale_price',
        'weight_unit',
        'minimum_order_quantity',
        'maximum_order_quantity',
        'available_quantity',
        'reserved_quantity',
        'stock_status',
        'product_status',
        'is_featured',
        'is_popular',
        'variants',
        'origin_location',
        'freshness_hours',
        'view_count',
        'meta_title',
        'meta_description',
        'attributes',
        'origin_harbor_id',
        'max_transit_hours',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'is_popular' => 'boolean',
        'price' => 'float',
        'sale_price' => 'float',
        'minimum_order_quantity' => 'float',
        'maximum_order_quantity' => 'float',
        'available_quantity' => 'float',
        'reserved_quantity' => 'float',
        'product_status' => \App\Enums\ProductStatus::class,
        'stock_status' => \App\Enums\StockStatus::class,
        'attributes' => 'array',
    ];

    protected function variants(): Attribute
    {
        return Attribute::make(
            get: function ($value) {
                if (!$value) return [];
                $arr = json_decode($value, true);
                if (!is_array($arr)) return [];
                
                // Upgrade legacy string array to object array on the fly
                return array_map(function ($item) {
                    if (is_string($item)) {
                        return [
                            'name' => $item,
                            'price_modifier' => 0,
                            'shipping_modifier' => 0,
                            'max_distance' => null,
                        ];
                    }
                    return $item;
                }, $arr);
            },
            set: fn ($value) => json_encode($value),
        );
    }

    public function seller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function originHarbor(): BelongsTo
    {
        return $this->belongsTo(Harbor::class, 'origin_harbor_id');
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class);
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class);
    }

    public function inventoryTransactions(): HasMany
    {
        return $this->hasMany(InventoryTransaction::class);
    }

    public function scopeActive($query)
    {
        return $query->where('product_status', \App\Enums\ProductStatus::PUBLISHED->value);
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopePopular($query)
    {
        return $query->where('is_popular', true);
    }

    public function getPrimaryImageAttribute(): ?string
    {
        return $this->images()->where('is_primary', true)->value('image_url')
            ?? $this->images()->value('image_url');
    }

    public function getEffectivePriceAttribute(): float
    {
        return (float) ($this->sale_price ?? $this->price);
    }
}
