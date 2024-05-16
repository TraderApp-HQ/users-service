#! /bin/bash

# Wait for the application to start
sleep 10

# Check if the application is running on port 5000
PORT=5000
HOST=localhost

if nc -z $HOST $PORT; then
  echo "Application is running on port $PORT"
  exit 0
else
  echo "Application is not running on port $PORT"
  exit 1
fi