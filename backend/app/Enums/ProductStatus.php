<?php

declare(strict_types=1);

namespace App\Enums;

enum ProductStatus: string
{
    case Draft = 'draft';
    case Active = 'active';
    case Inactive = 'inactive';
    case OutOfStock = 'out_of_stock';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
