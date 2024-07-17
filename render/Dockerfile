# Use an image with Docker installed
FROM docker:19.03.12

# Install Docker Compose
RUN apk add --no-cache docker-compose

# Copy your Docker Compose file
COPY docker-compose.yml /docker-compose.yml

# Copy all files needed for your services
COPY . /app

# Set the working directory
WORKDIR /app

# Command to start Docker Compose
CMD ["docker-compose", "-f", "../docker-compose.yml", "up", "--build"]

