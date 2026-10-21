# Multi-stage Dockerfile untuk Bebe (Laravel + React)
# Tahap 1: Build frontend React
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package*.json ./

RUN npm ci --frozen-lockfile

COPY frontend/ ./

RUN npm run build

# Tahap 2: Build backend Laravel dengan PHP 8.3
FROM php:8.4-apache
ENV COMPOSER_ALLOW_SUPERUSER=1

# Install ekstensi PHP yang dibutuhkan Laravel
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libpq-dev \
    libsqlite3-dev \
    libicu-dev \
    libzip-dev \
    libxml2-dev \
    curl \
    && docker-php-ext-install pdo pdo_sqlite pdo_mysql pdo_pgsql pgsql zip intl bcmath xml \
    && a2enmod rewrite

WORKDIR /var/www/html

# Copy backend code
COPY backend/ ./

# Copy frontend build hasil tahap 1
COPY --from=frontend-builder /app/frontend/dist/ ./public/

# Copy composer.phar
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Install dependencies
RUN composer install --no-dev --optimize-autoloader

# Setup permissions
RUN mkdir -p /var/www/html/storage/framework/sessions \
    && mkdir -p /var/www/html/storage/framework/views \
    && mkdir -p /var/www/html/storage/framework/cache \
    && mkdir -p /var/www/html/database \
    && chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database

# Environment production
ENV APP_ENV=production
ENV APP_DEBUG=false
ENV LOG_CHANNEL=stderr
ENV DB_CONNECTION=pgsql

# Apache
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

EXPOSE 80

# Start command: clear cache, run migration, then Apache
CMD php artisan config:clear && php artisan config:cache && php artisan route:cache && php artisan view:clear && php artisan migrate --force && sed -i "s/80/\${PORT}/g" /etc/apache2/ports.conf /etc/apache2/sites-available/000-default.conf && apache2-foreground
