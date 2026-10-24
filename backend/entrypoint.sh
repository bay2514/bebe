#!/usr/bin/env bash
set -euo pipefail

DB_HOST="${DB_HOST:-127.0.0.1}"
DB_PORT="${DB_PORT:-5432}"
DB_DATABASE="${DB_DATABASE:-postgres}"
DB_USERNAME="${DB_USERNAME:-postgres}"

# Supabase direct connection check warning
if [[ "$DB_HOST" =~ ^db\..*\.supabase\.co$ ]]; then
    echo "======================================================================" >&2
    echo "PERINGATAN KRITIS: Anda menggunakan koneksi langsung Supabase (${DB_HOST})." >&2
    echo "Koneksi langsung menggunakan IPv6 yang sering tidak didukung Railway." >&2
    echo "HARUS menggunakan Supabase Session Pooler (port 5432) dengan host pooler." >&2
    echo "======================================================================" >&2
fi

echo "==> Checking database connection to host: ${DB_HOST}, port: ${DB_PORT}..."

attempt=1
max_attempts=30
connected=false

while [ $attempt -le $max_attempts ]; do
    db_output=$(php -r "try { new PDO('pgsql:host=${DB_HOST};port=${DB_PORT};dbname=${DB_DATABASE}', '${DB_USERNAME}', getenv('DB_PASSWORD')); exit(0); } catch (Exception \$e) { echo \$e->getMessage(); exit(1); }" 2>&1)
    if [ $? -eq 0 ]; then
        echo "==> Database is reachable!"
        connected=true
        break
    else
        echo "Attempt $attempt/$max_attempts: Database at ${DB_HOST}:${DB_PORT} not ready yet. Error: ${db_output}"
        if [[ "$DB_HOST" =~ ^db\..*\.supabase\.co$ ]]; then
            echo "PETUNJUK: Host berawalan 'db.' dan berakhiran '.supabase.co' adalah koneksi langsung (IPv6). Harap gunakan Supabase Session Pooler (port 5432)."
        fi
        sleep 2
        attempt=$((attempt + 1))
    fi
done

if [ "$connected" = false ]; then
    echo "ERROR: Database at ${DB_HOST}:${DB_PORT} not reachable after $max_attempts attempts." >&2
    if [[ "$DB_HOST" =~ \.supabase\.co$ ]]; then
        echo "PETUNJUK SUPABASE: Pastikan menggunakan Supabase Session Pooler (port 5432), bukan koneksi langsung." >&2
    fi
    exit 1
fi

echo "==> Running Laravel database migrations..."
if ! php artisan migrate --force; then
    echo "ERROR: Database migration failed!" >&2
    exit 1
fi

echo "==> Running Laravel optimizations (with fallback)..."
php artisan config:clear || true
php artisan config:cache || echo "WARNING: config:cache failed, skipping..." >&2
php artisan route:cache || echo "WARNING: route:cache failed, skipping..." >&2
php artisan view:clear || true
php artisan view:cache || echo "WARNING: view:cache failed, skipping..." >&2

# Configure Apache port for Railway ($PORT, default 8080)
PORT="${PORT:-8080}"
echo "==> Configuring Apache to listen on port ${PORT}..."
sed -i "s/80/${PORT}/g" /etc/apache2/ports.conf
sed -i "s/80/${PORT}/g" /etc/apache2/sites-available/000-default.conf

echo "==> Memeriksa modul MPM aktif dan tes konfigurasi Apache..." >&2
ls -l /etc/apache2/mods-enabled | grep -i mpm >&2 || true
if ! apache2ctl configtest; then
    echo "ERROR: Apache configuration test failed!" >&2
    apache2ctl configtest 2>&1 >&2
    exit 1
fi

echo "==> Starting Apache on port ${PORT}..."
exec apache2-foreground
