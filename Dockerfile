FROM php:8.4-apache

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y \
    libzip-dev \
    unzip \
    git \
    curl \
    ca-certificates \
    && docker-php-ext-install pdo pdo_mysql zip \
    && update-ca-certificates

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Configurar Apache
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf
RUN a2enmod rewrite

# Configurar diretório de trabalho
WORKDIR /var/www/html

# Copiar arquivos do proj
COPY . .

# Criar pastas
RUN mkdir -p storage/framework/sessions storage/framework/views storage/framework/cache storage/logs bootstrap/cache
RUN chmod -R 777 storage bootstrap/cache
RUN touch storage/logs/laravel.log && chmod 666 storage/logs/laravel.log

# Instalar dependências
RUN composer install --no-interaction --ignore-platform-req=ext-exif --ignore-platform-req=php

# Limpar cache
RUN php artisan config:clear || true
RUN php artisan cache:clear || true

RUN chown -R www-data:www-data /var/www/html

EXPOSE 80
CMD ["apache2-foreground"]
