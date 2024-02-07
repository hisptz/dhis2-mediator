#!/bin/bash

PKG_VERSION=$(node -p "require('./package.json').version")
PKG_NAME=$(node -p "require('./package.json').name")

BUNDLE_NAME="$PKG_NAME-$PKG_VERSION.zip"
# build
nest build --webpack
# package
cp ./Dockerfile ./dist/
cp ./.env.example ./dist/.env.example
cp ./build-README.md ./dist/README.md
cp ./package.json ./dist/
cp ./package-lock.json ./dist/
cd ./dist/ || return

bestzip "$BUNDLE_NAME" *
mkdir "build"
mv $BUNDLE_NAME build
