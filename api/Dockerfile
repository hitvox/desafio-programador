# Use a php image
FROM php:8-fpm

# Set the working directory
WORKDIR /api

# Copy composer.lock and composer.json
COPY composer.lock composer.json /api/

# Install dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    libzip-dev \
    unzip \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd \
    && curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Copy the rest of the app
COPY . /api

# Install composer dependencies
RUN composer install

# Expose port 8000
EXPOSE 8000

# Start the app
CMD ["php", "artisan", "serve", "--host=0.0.0.0"]