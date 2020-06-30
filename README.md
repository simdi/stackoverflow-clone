# stackoverflow-clone.

[![CircleCI](https://circleci.com/gh/simdi/stackoverflow-clone.svg?style=svg)](https://circleci.com/gh/simdi/stackoverflow-clone)

The stackoverflow-clone is a javascript application built with Nestjs, and MongoDB.

The application is more like stackoverflow; a Q&A application where users can ask questions and answer questions as well. Users can subscribe to receive email notification when a user answers his/her question. Users can downvote (deduct 1 point from the number of votes) and upvote (add 1 point to the number of votes) a question. Users can also search for questions, answers, and their fellow users. The search algorithm used for the search is the partial text search algorithm. The user is required to be logged in to perform all actions stated herein. The authentiation strategy used is the JWT strategy. Every user that is authenticated is authorised to perform all operations.

Here are a non-exhaustive list of patterns used in this application: MVC (Model-View-Controller) pattern, DI (Dependency Injection) pattern, OOP (Object Oriented Programming) pattern, FP (Functional Programming) pattern.
This application uses heavily the Module/Component system for reusability and testability.

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

### Setup .env file for the application
```bash
$ cd stackoverflow-clone 
$ touch .env
$ echo MONGO_DB=stackoverflow-clone >> .env
$ echo MONGO_HOST=MONGODB_URL_STRING >> .env
$ echo JWT_SECRET=yourSecret >> .env
$ echo SENDGRID_API_KEY==yourSendgridAPIKey >> .env
$ echo PORT=3000 >> .env
```

### Installation

```bash
$ yarn install
```

### Running the app

```bash
# development
$ yarn run start
# watch mode
$ yarn run start:dev
# production mode
$ yarn run start:prod
```

### Test

```bash
# unit tests
$ yarn run test
# e2e tests
$ yarn run test:e2e
# test coverage
$ yarn run test:cov
```

### API Documentation
The api documentation can be found on this url: [API](http://localhost:3000/api/v1/docs)

### Thanks
If you have successfully completed the above setup, then you are good to go :+1: :v: :clap:.
