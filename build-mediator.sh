#!/bin/bash

PKG_VERSION=$(node -p "require('./package.json').version")
PKG_NAME=$(node -p "require('./package.json').pkgName")

BUNDLE_NAME="$PKG_NAME-$PKG_VERSION.zip"
# build
nest build --tsc
# package
cp ./Dockerfile ./dist/
cp ./.env.example ./dist/.env.example
cp ./build-README.md ./dist/README.md
cp ./package.json ./dist/
cp ./package-lock.json ./dist/
cd ./dist/ || return

#bestzip "$BUNDLE_NAME" *
#mkdir "bundle"
#mv $BUNDLE_NAME bundle
