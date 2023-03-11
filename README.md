# cb-node-microservice-rabbitmq

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

## Instructions

### Prerequisites

1. have git installed
2. have docker installed
3. have docker-compose installed

### Install & Run App for Development

1. Pull this repo and switch to intended branch
2. See .env.example file then set the environment variables (.env) for each service api
3. Build app on Docker

```
$ docker-compose build --no-cache
```

4. Run app on Docker

```
$ docker-compose up
```

5. (Optionally) Build the app on Docker then Run immediately

```
$ docker-compose up --build
```
