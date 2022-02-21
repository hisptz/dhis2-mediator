#!/bin/bash
# build
nest build
# package
cp ./Dockerfile ./dist/
cp ./docker-compose.yml ./dist/docker-compose.yml
cp ./.env.example ./dist/.env.example
cp ./README.md ./dist/README.md
cp ./package.json ./dist/package.json
cp ./package-lock.json ./dist/package-lock.json
cd ./dist/ || return
zip -r api.zip .