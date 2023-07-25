#!/bin/bash

PKG_VERSION=$(node -p "require('./package.json').version")
PKG_NAME=$(node -p "require('./package.json').name")
# build
nest build --webpack
# package
cp ./Dockerfile ./dist/
cp ./.env.example ./dist/.env.example
cp ./build-README.md ./dist/README.md
cp ./package.json ./dist/
cp ./package-lock.json ./dist/
cd ./dist/ || return
