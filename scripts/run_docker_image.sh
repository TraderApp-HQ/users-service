#!/bin/bash
sudo docker run -d -p 80:8080 -e NODE_ENV=development -e SERVICE=dev-usersService 575439814610.dkr.ecr.eu-west-1.amazonaws.com/users-service-dev:latest
