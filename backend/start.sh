#!/bin/bash
set -e

echo "==> Running database migrations..."
php artisan migrate --force

echo "==> Running database seeders..."
php artisan db:seed --force

echo "==> Caching config and routes..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "==> Starting Apache..."
exec apache2-foreground
