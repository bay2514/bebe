# Multi-stage Dockerfile untuk Bebe (Laravel + React)
# Tahap 1: Build frontend React
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package*.json ./

RUN npm ci --frozen-lockfile

COPY frontend/ ./

RUN npm run build

# Tahap 2: Build backend Laravel dengan PHP 8.4-apache
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
    && docker-php-ext-install pdo pdo_sqlite pdo_mysql zip intl bcmath xml \
    && docker-php-ext-install pgsql \
    && docker-php-ext-install pdo_pgsql

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

# Konfigurasi Apache workers untuk menghemat koneksi DB pooler
RUN rm -f /etc/apache2/mods-available/mpm_event.* /etc/apache2/mods-available/mpm_worker.* /etc/apache2/mods-available/mpm_winnt.* \
    && rm -f /etc/apache2/mods-enabled/mpm_*.load /etc/apache2/mods-enabled/mpm_*.conf \
    && ln -s /etc/apache2/mods-available/mpm_prefork.load /etc/apache2/mods-enabled/mpm_prefork.load \
    && ln -s /etc/apache2/mods-available/mpm_prefork.conf /etc/apache2/mods-enabled/mpm_prefork.conf \
    && a2enmod rewrite \
    && printf '<IfModule mpm_prefork_module>\n    StartServers 2\n    MinSpareServers 2\n    MaxSpareServers 4\n    MaxRequestWorkers 8\n    MaxConnectionsPerChild 0\n</IfModule>\n' > /etc/apache2/conf-available/zz-prefork-tuning.conf \
    && a2enconf zz-prefork-tuning \
    && apache2ctl configtest

# Environment production
ENV APP_ENV=production
ENV APP_DEBUG=false
ENV LOG_CHANNEL=stderr
ENV DB_CONNECTION=pgsql

# Apache document root
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Setup entrypoint script
COPY backend/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 8080

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
