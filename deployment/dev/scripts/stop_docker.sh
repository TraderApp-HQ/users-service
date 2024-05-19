#!/bin/bash
sudo docker rm $(sudo docker stop $(sudo docker ps -a -q --filter ancestor=575439814610.dkr.ecr.eu-west-1.amazonaws.com/users-service-dev:latest --format="{{.ID}}"))
