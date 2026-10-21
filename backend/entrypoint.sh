#!/usr/bin/env bash
set -e

DB_HOST="${DB_HOST:-127.0.0.1}"
DB_PORT="${DB_PORT:-5432}"
DB_DATABASE="${DB_DATABASE:-postgres}"
DB_USERNAME="${DB_USERNAME:-postgres}"

echo "==> Checking database connection to ${DB_HOST}:${DB_PORT}..."

attempt=1
max_attempts=30
connected=false

while [ $attempt -le $max_attempts ]; do
    if php -r "try { new PDO('pgsql:host=${DB_HOST};port=${DB_PORT};dbname=${DB_DATABASE}', '${DB_USERNAME}', getenv('DB_PASSWORD')); exit(0); } catch (Exception \$e) { exit(1); }"; then
        echo "==> Database is reachable!"
        connected=true
        break
    else
        echo "Attempt $attempt/$max_attempts: Database not ready yet, waiting 2 seconds..."
        sleep 2
        attempt=$((attempt + 1))
    fi
done

if [ "$connected" = false ]; then
    echo "ERROR: Database at ${DB_HOST}:${DB_PORT} not reachable after $max_attempts attempts." >&2
    exit 1
> fi

echo "==> Running Laravel optimizations and migrations..."
php artisan config:clear
php artisan config:cache
php artisan route:cache
php artisan view:clear
php artisan migrate --force

# Configure Apache port for Railway
PORT="${PORT:-80}"
echo "==> Configuring Apache to listen on port ${PORT}..."
sed -i "s/80/${PORT}/g" /etc/apache2/ports.conf
sed -i "s/80/${PORT}/g" /etc/apache2/sites-available/000-default.conf

echo "==> Starting Apache..."
exec apache2-foreground
