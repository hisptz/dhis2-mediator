<!-- [![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/) -->

# DHIS2 API MEDIATOR

1.  [Introduction](#Introduction)

2.  [Pre-requisites](#Pre-requisites)

3.  [Getting started with API](#GetStartedWithAPI)

    3.1. [Installations](#Installations)

    3.2. [Configuration](#Configuration)

4.  [Running the of API](#OperationsOfApi)

    4.1. [Running the development server](#runDevelopment)

    4.2. [Building the API](#Build)

    4.3. [Running the production server](#Production)

5.  [How to connect with another application](#connect)

6.  [How to contribute](#contribute)

## 1. <a name='Introduction'></a>Introduction

This is [NestJS](https://docs.nestjs.com/) application that act as a mediator between a DHIS2 instance and a front end application for handling authentication and allow whitelisting of DHIS2 API resources. With the help of this mediator, one can expose part of DHIS2 API that could be used by a custom front end application while also ensuring authentication using configurations set.

![Flow chart](mediator-flow-chart.png?raw=true 'Mediator flow chart')

## 2. <a name='Pre-requisites'></a>Pre-requisites

```
- node +12

- npm +6.13

- docker-engine +20.10.11

- docker-compose +1.29.1

- nestjs +7.0.0

```

## 3. <a name='GetStartedWithAPI'></a>Getting started with API

### 3.1. <a name='Installations'></a>Installations

To clone the app and install all app dependencies, run the below commands

```
git clone https://github.com/hisptz/dhis2-mediator
cd dhis2-mediator
npm install
```

### 3.2. <a name='Configuration'></a>Configuration

There are two types of configurations that need to be done to get the mediator API up and running. These configurations are:

<ul>
  <li>Environmental variables configurations</li>
  <li>Docker compose configurations</li>
</ul>

#### 3.2.1 Environmental variables configurations

The environmental variables configurations enables configuration of the DHIS2 instance url, username and password. It also allows setting of the port where the mediator API will be running and both the readonly and allowed resources. This can be done as the `.env.example` file.

```
# DHIS2
DHIS2_BASE_URL="path_to_dhis"
DHIS2_USERNAME="username"
DHIS2_PASSWORD="password"
DHIS2_API_TOKEN="api_token"
PORT="3000"
CACHE_TTL="<number-of-milliseconds-for-caching-readonly-resources>"
NUMBER_OF_REQUESTS_PER_MINUTE="<number-of-client-requests-per-minute>"
READONLY_RESOURCES=["resource1"]
ALLOWED_RESOURCES=["resource2"]
```

<strong>NOTE</strong>

<ul>
  <li>The <strong>READONLY_RESOURCES</strong> is the list of all the resources that are only allowed for read only. It should be noted that the resources should be in double quotes ("). Additionally, for performance reasons these resources are cached, hence the mediator will not be fetching these items every now and then.
  
  This could be specified as READONLY_RESOURCES = ["me", "dataElements/XXXXXXXXXX"]</li>

   <li>The <strong>ALLOWED_RESOURCES</strong> is the list of all the resources that are allowed for reading, updating and creating. These are specified in the same way using the double quotes.
  
  This could be specified as ALLOWED_RESOURCES = [ "trackedEntityInstances", "events"]</li>

  <li>The <strong>CACHE_TTL</strong> is the number of milliseconds cached data can be stored. The caching mechanism is applied the resources specified as READONLY_RESOURCES only, since they are the ones subjected to less changes. It should be noted that the cache can be cleared using DELETE HTTP request to ${host}/api/cache.
  
  This could be specified as CACHE_TTL = 3600</li>

   <li>The <strong>NUMBER_OF_REQUESTS_PER_MINUTE</strong> is the number that specifies the request a client can make to a resource per minute. This is to be used as a strategy against DDOS attacks. If not specified, the mediator considers 100 requests per minute.
  
  This could be specified as NUMBER_OF_REQUESTS_PER_MINUTE = 100</li>
</ul>

#### 3.2.2 Docker compose configurations

These configurations are use for starting the docker image from the build. The example of these configurations can be through the `docker-compose.example.yml`. Rename the file to or create a copy of this file with name `docker-compose.yml` and fill in the configurations as how the file contents suggests.

```
version: '3.2'

services:
  mediator:
    container_name: mediator-api
    build:
      context: .
      network: host
    image: mediator-api
    restart: always
    ports:
      - '3333:3333'
    env_file: .env
    networks:
      - mediator-api
networks:
  mediator-api:
    driver: 'bridge'

```

## 4. <a name='OperationsOfApi'></a>Running the of API

Once all configuration has been done and packages installed, the mediator can now be started either in development or on production mode.

### 4.1. <a name='runDevelopment'></a>Running the development server

The development server can be started by running the command:

```
npm run start
```

or for a watch mode with

```
npm run start:dev
```

or just:

```
nest start
```

### 4.2. <a name='Build'></a>Building the API

Building the mediator API, can be done by running the command:

```
npm run build
```

This command builds the API into the `dist` folder while at the same time moving the `.env.example` and `docker-compose.yml` files to your dist folder and also creating the `api.zip` file that has all the `dist` folder contents zipped.

### 4.3. <a name='Production'></a>Running the production server

There are two ways for running the production server, these are:

<ul>
  <li>Using Node</li>
  <li>Using Docker configurations</li>
</ul>

It should be noted that both of this approaches needs to be done after the building the mediator API

#### 4.3.1 Using Node.

To run the development server with docker, while at the root of the project use the command:

```
npm run start:prod
```

#### 4.3.2 Using Docker.

If using the `api.zip` file, the file should be first unzipped and navigate into the resulting folder. On the other hand if using the app source code, navigate to the dist folder.

The next step applies to all the above scenarios, and that is creating of `.env` file similar to the above [configuration instructions](#Configuration).

Lastly to start the production server run the command

```
docker-compose up -d --build
```

<strong>NOTE</strong>

For more configurations of the ports and how docker-compose would be handling the mediator API, make changes on the `docker-compose.yml` file.

## 5. <a name='connect'></a>How to connect with another application

Once the mediator is running either on development or production(recommended) mode, other applications can access the DHIS2 API through this mediator by making HTTP requests to the API resources (allowed and readonly) as specified on the `.env` file through the specified port.

```
# DHIS2
DHIS2_BASE_URL="https://play.dhis2.org/40.0.1"
DHIS2_USERNAME="admin"
DHIS2_PASSWORD="district"
DHIS2_API_TOKEN="d2pat_GqYQTgdx2rzgIGvJhjCuHe70Evh9d7nO2925016161"
PORT="3000"
CACHE_TTL="360000"
NUMBER_OF_REQUESTS_PER_MINUTE=30
READONLY_RESOURCES=["me", "dataStore"]
ALLOWED_RESOURCES=["fileResources", "dataStore"]
```

Considering the above example of `.env` configurations, the API endpoints can be accessed as following:

### 5.1 Accessing readonly resources

These API resources can only be accessed by a GET HTTP method. As per the above example we can access the `me` resource using

# GET

curl -v localhost:3000/api/me

```

<strong>NOTE</strong>: These resources are cached, hence only the first request is sent to the DHIS2 instance. To clear the cache, a DELETE HTTP request should be sent to the endpoint `cache` as:

```

# Clear cache

curl -X DELETE http://localhost:3000/api/cache

```

### 5.2 Accessing allowed resources

These API resources can only be accessed by GET, POST and PUT HTTP methods. As per the above example we can access the `dataStore` resource using the following requests. These resources are not cached, hence no clearing of cache required for these resources.

```

# GET

curl -v localhost:3000/api/dataStore

# POST

curl -d '[1, 2, 3]' localhost:3000/api/dataStore/demo/demo-item-1

# PUT

curl -d '{"name": "userName", "value": "Megamind"}' -X PUT localhost:3000/api/dataStore/demo/demo-item-1

```

## 6. <a name='contribute'></a>How to contribute

In order to contribute to this project, fork the repository, make the necessary changes and submit the pull request for review.
```
