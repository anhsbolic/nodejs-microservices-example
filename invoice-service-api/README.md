# cb-node-microservice-rabbitmq : invoice-service-api

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

## Instructions : With Docker

### Prerequisites

1. have git installed
2. have docker installed
3. have docker-compose installed

### Install & Run App for Development

1. Pull this repo and switch to intended branch
2. See .env.example file then set the environment variables
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

## Instructions : Without Docker

### Prerequisites

1. have git installed
2. have node installed (currently use node 16 version)
3. have npm installed
4. have mongodb up and running
5. have redis up and running

### Install & Run App for Development

1. Pull this repo and switch to intended branch
2. See .env.example file then set the environment variables
3. Install dependencies

```
$ npm install
```

4. Start the application:

```
$ npm run dev
```
