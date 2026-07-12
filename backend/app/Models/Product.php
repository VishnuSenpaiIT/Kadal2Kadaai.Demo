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
        'discount_type',
        'discount_value',
        'discount_start_date',
        'discount_end_date',
        'weight_unit',
        'minimum_order_quantity',
        'maximum_order_quantity',
        'available_quantity',
        'reserved_quantity',
        'stock_status',
        'product_status',
        'is_featured',
        'is_popular',
        'is_top_selling',
        'is_todays_purchase',
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
        'is_top_selling' => 'boolean',
        'is_todays_purchase' => 'boolean',
        'price' => 'float',
        'sale_price' => 'float',
        'discount_value' => 'float',
        'discount_start_date' => 'datetime',
        'discount_end_date' => 'datetime',
        'minimum_order_quantity' => 'float',
        'maximum_order_quantity' => 'float',
        'available_quantity' => 'float',
        'reserved_quantity' => 'float',
        'product_status' => \App\Enums\ProductStatus::class,
        'stock_status' => \App\Enums\StockStatus::class,
        'attributes' => 'array',
    ];

    protected static function booted()
    {
        static::saving(function ($product) {
            if (!$product->discount_type || $product->discount_value === null) {
                $product->sale_price = null;
                $product->discount_type = null;
                $product->discount_value = null;
            }

            // Smart correction: if the user selected a time that evaluates to before the start time
            // (e.g., 2 PM to 10 AM on the same day), automatically roll the end time over to the next day.
            if ($product->discount_start_date && $product->discount_end_date) {
                if ($product->discount_end_date->lt($product->discount_start_date)) {
                    $product->discount_end_date = $product->discount_end_date->addDay();
                }
            }
        });
    }

    public function getSalePriceAttribute($value)
    {
        if (!$this->discount_type || $this->discount_value === null) {
            return $value;
        }

        $now = now();

        if ($this->discount_start_date && $now->lt($this->discount_start_date)) {
            return null;
        }

        if ($this->discount_end_date && $now->gt($this->discount_end_date)) {
            return null;
        }

        if ($this->discount_type === 'percentage') {
            $clampedPercent = min(100, max(0, (float) $this->discount_value));
            return max(0, round($this->price * (1 - $clampedPercent / 100), 2));
        } elseif ($this->discount_type === 'flat') {
            return max(0, round($this->price - $this->discount_value, 2));
        }

        return $value;
    }

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
