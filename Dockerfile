FROM php:8.4-apache

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y \
    libzip-dev \
    unzip \
    git \
    curl \
    && docker-php-ext-install pdo pdo_mysql zip

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Configurar Apache
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf
RUN a2enmod rewrite

# Configurar diretório de trabalho
WORKDIR /var/www/html

# Copiar arquivos do projeto
COPY . .

# Criar pastas necessárias
RUN mkdir -p storage/framework/sessions
RUN mkdir -p storage/framework/views
RUN mkdir -p storage/framework/cache
RUN mkdir -p bootstrap/cache

# Permissões (mais permissivas para debug)
RUN chmod -R 777 storage
RUN chmod -R 777 bootstrap/cache
RUN chown -R www-data:www-data /var/www/html

# Instalar dependências
RUN composer install --no-interaction --ignore-platform-req=ext-exif --ignore-platform-req=php

# Configurar .env básico
RUN echo "APP_ENV=production" > .env
RUN echo "APP_DEBUG=true" >> .env
RUN echo "APP_KEY=base64:$(openssl rand -base64 32)" >> .env

EXPOSE 80
CMD ["apache2-foreground"]
