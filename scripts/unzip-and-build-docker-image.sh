#!/bin/bash

# Variables
IMAGE_NAME="user-service"
CONTAINER_NAME="user-service"
DOCKERFILE_PATH="."

cd /home/ubuntu/app

# Stop and remove the container if it exists
if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
    echo "Stopping existing container: $CONTAINER_NAME"
    docker stop $CONTAINER_NAME
fi

if [ "$(docker ps -aq -f name=$CONTAINER_NAME)" ]; then
    echo "Removing existing container: $CONTAINER_NAME"
    docker rm $CONTAINER_NAME
fi

# Build the new Docker image
echo "Building new Docker image: $IMAGE_NAME"
docker build -t $IMAGE_NAME $DOCKERFILE_PATH