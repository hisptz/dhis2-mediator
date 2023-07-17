<!-- [![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/) -->

# DHIS2 API MEDIATOR

1.  [Introduction](#Introduction)

2.  [Pre-requisites](#Pre-requisites)

3.  [Getting started with API](#GetStartedWithAPI)

    3.1. [Configuration](#Configuration)

4.  [Running the of API](#OperationsOfApi)

    4.1. [Running with Node.](#node)

    4.2. [Running with Docker](#docker)

5.  [How to connect with another application](#connect)

## 1. <a name='Introduction'></a>Introduction

This is [NestJS](https://docs.nestjs.com/) application that act as a mediator between a DHIS2 instance and a front end application for handling authentication and allow whitelisting of DHIS2 API resources. With the help of this mediator, one can expose part of DHIS2 API that could be used by a custom front end application while also ensuring authentication using configurations set.

## 2. <a name='Pre-requisites'></a>Pre-requisites

```
- node +12

- npm +6.13

- docker-engine +20.10.11

- docker-compose +1.29.1

```

## 3. <a name='GetStartedWithAPI'></a>Getting started with API

### 3.1. <a name='Configuration'></a>Configuration

Configuration is done by creating the environmental variables required for the project:

#### Environmental variables configurations

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

## 4. <a name='OperationsOfApi'></a>Running the of API

With the configurations all in place, there are two ways for running the production server, these are:

<ul>
  <li>Using Node</li>
  <li>Using Docker</li>
</ul>

It should be noted that both of this approaches needs to be done after the building the mediator API

### 4.1 <a name='node'></a>Running with Node.

To run the development server with node, while at the root of the project use the command:

```
npm run start
```

### 4.2 <a name='docker'></a>Running with Docker.

To run the development server with docker, while at the root of the project use the command:

```
docker-compose up -d --build
```

<strong>NOTE</strong> <br />
When using docker the following can be noted:

- Modifications can be done on the `Dockerfile` to meet you desired configurations such as port exposed.
- For more configurations of the ports and how docker-compose would be handling the mediator API, make changes on the `docker-compose.yml` file.

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

```
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

```

```
