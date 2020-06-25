# stackoverflow-clone.
The stackoverflow-clone is a javascript application built with Nestjs, and MongoDB.

## Prerequisites
* node >= 9.X
  * All OSes: [click here for installation instructions](https://nodejs.org/en/download/)
* MongoDB >= 3.X
  * All OSes: [click here for installation instructions](https://www.mongodb.com/download-center/community)

## Basic Build Instructions

A quick guide to basic setup of the **stackoverflow-clone** project on your local machine

### Clone
```sh
$ git clone https://github.com/simdi/stackoverflow-clone.git
```

### Setup .env file for the applications
API .env setup
```sh
$ cd stackoverflow-clone 
$ touch .env
$ echo MONGO_DB=stackoverflow-clone >> .env
$ echo MONGO_HOST=127.0.0.1 >> .env
$ echo PORT=3000 >> .env
```

### Installation

```bash
$ npm install
```

### Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

### API Documentation
The api documentation can be found on this url: [API](http://localhost:3000/api/v1/docs)

### Thanks
If you have successfully completed the above setup, then you are good to go.
