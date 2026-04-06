#!/bin/bash

# Aguardar banco de dados (opcional, se estiver usando)
# echo "Aguardando banco de dados..."
# sleep 5

# Rodar migrations
php artisan migrate --force

# Otimizar Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Iniciar Apache
apache2-foreground
