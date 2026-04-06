# Docker Setup for SvelteKit Landing Page

This project includes Docker configuration to containerize your SvelteKit application for easy deployment.

## Files Created

- `Dockerfile` - Multi-stage Docker build configuration
- `.dockerignore` - Files and directories to exclude from Docker build context
- `docker-compose.yml` - Docker Compose configuration for easy container management

## Prerequisites

- Docker Desktop installed and running
- Docker Compose

## Building the Docker Image

```bash
# Build the Docker image
docker build -t my-landing .

# Or use Docker Compose to build
docker-compose build
```

## Running the Container

### Using Docker Compose (Recommended)

```bash
# Start the container
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the container
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Using Docker Directly

```bash
# Run the container
docker run -d -p 3000:3000 --name my-landing my-landing

# View logs
docker logs my-landing

# Stop the container
docker stop my-landing

# Remove the container
docker rm my-landing
```

## Accessing the Application

Once the container is running, you can access your application at:
- http://localhost:3000

## Docker Image Details

- **Base Image**: `node:22-alpine` (Node.js 22 on Alpine Linux)
- **Build Process**: Multi-stage build for optimized production image
- **Package Manager**: pnpm (as specified in your project)
- **Port**: 3000
- **User**: Runs as non-root user `nextjs` for security
- **Health Check**: Includes health check endpoint

## Production Considerations

- The image is optimized for production use
- Uses multi-stage builds to minimize final image size
- Runs as non-root user for security
- Includes health checks for container orchestration
- Environment variables are properly configured

## Troubleshooting

If you encounter issues:

1. **Docker Desktop not running**: Ensure Docker Desktop is installed and running
2. **Port already in use**: Change the port mapping in docker-compose.yml
3. **Build failures**: Check that all dependencies are properly installed
4. **Permission issues**: The container runs as a non-root user

## Customization

You can customize the Docker configuration by modifying:

- `Dockerfile` - Change base image, add build steps, modify environment variables
- `docker-compose.yml` - Change ports, add environment variables, configure volumes
- `.dockerignore` - Add files to exclude from build context