#!/bin/bash

#### INSTALL DOCKER ####
sudo apt-get update -y
sudo apt install docker.io -y
sudo usermod -aG docker $USER

#### INSTALL CODEDEPLOY ####
sudo apt-get install ruby -y
sudo apt-get install wget -y
cd /home/ubuntu
wget https://aws-codedeploy-eu-west-1.s3.eu-west-1.amazonaws.com/latest/install
chmod +x ./install
sudo ./install auto
# systemctl start codedeploy-agent