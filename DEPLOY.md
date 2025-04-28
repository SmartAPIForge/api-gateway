# Deployment Guide

This document outlines the deployment process for the API Gateway service.

## Local Development

### Running with Docker Compose

To run the application locally with Docker Compose:

```bash
docker-compose up -d
```

This will start only the API Gateway service. Make sure your microservices are running and accessible at the URLs specified in your environment variables.

## Environment Variables

The API Gateway requires the following environment variables:

- `AUTH_SERVICE_URL` - URL for the Auth microservice (default: localhost:50051)
- `CODEGEN_SERVICE_URL` - URL for the Codegen microservice (default: localhost:50052)
- `PROJECT_SERVICE_URL` - URL for the Project microservice (default: localhost:50053)
- `DEPLOYMENT_SERVICE_URL` - URL for the Deployment microservice (default: localhost:50059)
- `PORT` - Port for the API Gateway to listen on (default: 3000)

You can set these in a `.env` file or pass them to docker-compose.

## GitHub Actions CI/CD Setup

The repository includes a GitHub Actions workflow for continuous integration and deployment. For this to work, you need to set up the following secrets in your GitHub repository:

### Required GitHub Secrets

1. `DOCKER_USERNAME` - Your Docker Hub username
2. `DOCKER_PASSWORD` - Your Docker Hub password or access token
3. `SERVER_HOST` - The hostname or IP address of your deployment server
4. `SERVER_USERNAME` - The SSH username for your deployment server
5. `SERVER_SSH_KEY` - The private SSH key for authentication with your deployment server
6. `AUTH_SERVICE_URL` - URL for the Auth microservice
7. `CODEGEN_SERVICE_URL` - URL for the Codegen microservice
8. `PROJECT_SERVICE_URL` - URL for the Project microservice
9. `DEPLOYMENT_SERVICE_URL` - URL for the Deployment microservice

### Setting Up Secrets

1. Go to your GitHub repository
2. Navigate to "Settings" > "Secrets and variables" > "Actions"
3. Click on "New repository secret"
4. Add each of the required secrets with their respective values

## Server Setup

On your deployment server, you need to:

1. Install Docker and Docker Compose
2. Create a directory to store the application files:

```bash
mkdir -p /path/to/api-gateway
cd /path/to/api-gateway
```

3. Create a `docker-compose.yml` file similar to the one in this repository, or clone the repository:

```bash
git clone https://github.com/yourusername/api-gateway.git .
```

4. Make sure the server user has permissions to run Docker commands

## Deployment Process

When you push changes to the `main` branch, the GitHub Actions workflow will:

1. Build a new Docker image for the API Gateway
2. Push the image to Docker Hub
3. SSH into your server
4. Pull the latest code
5. Set the environment variables for connecting to microservices
6. Restart the API Gateway service
7. Clean up unused Docker images

## Manual Deployment

If you need to deploy manually:

1. SSH into your server
2. Navigate to the application directory:

```bash
cd /path/to/api-gateway
```

3. Pull the latest changes:

```bash
git pull
```

4. Set your environment variables (edit .env file or export variables)

5. Rebuild and restart the container:

```bash
docker-compose down
docker-compose up -d --build
``` 