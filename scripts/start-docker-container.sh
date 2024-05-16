#! /bin/bash

# Variables
IMAGE_NAME="user-service"
CONTAINER_NAME="user-service"
DOCKERFILE_PATH="."

# Run a new container from the built image
echo "Running new container: $CONTAINER_NAME"
docker run -d -p 8080:8080 --name $CONTAINER_NAME $IMAGE_NAME

echo "Deployment completed successfully."
