import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as mongoose from 'mongoose';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { url, mongoDBOptions } from '../src/db';

afterAll(async (done) => {
  const connection = await mongoose.connect(url, mongoDBOptions);
  await connection.connection.db.dropDatabase();
  await mongoose.disconnect(done);
});

describe('AppController (e2e)', () => {
  let app: INestApplication;
  const usersEndpoint = `/users`;
  const questionsEndpoint = `/questions`;
  const loginEndpoint = `/auth/login`;
  const registerEndpoint = `/auth/register`;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('Integration test', () => {
    const questionPayload = {
      title: "Calculate distance between two latitude-longitude points? (Haversine formula)",
      body: "How do I calculate the distance between two points specified by latitude and longitude? \n For clarification, I'd like the distance in kilometers; the points use the WGS84 system and I'd like to understand the relative accuracies of the approaches available."
    };
    const loginPayload = {
      email: "email@yahoo.com",
      password: "string"
    };
    const userPayload = {
      email: "email@yahoo.com",
      password: "string",
      firstName: "John",
      lastName: "Doe"
    };
    let accessToken;

    let questionResponseBody;
    let userResponseBody;

    describe('Home', () => {
      it('/ (GET)', () => {
        return request(app.getHttpServer())
          .get('/')
          .expect(HttpStatus.OK)
          .expect('Hello World!');
      });
    });

    describe('Auth', () => {
      it('/register (POST)', async(done) => {
        return request(app.getHttpServer())
          .post(registerEndpoint)
          .send(userPayload)
          .expect(HttpStatus.CREATED)
          .expect((res) => {
            expect(res.status).toEqual(HttpStatus.CREATED);
            expect(res.body).toHaveProperty('access_token');
            done();
          });
      });

      it('/login (POST)', async(done) => {
        return request(app.getHttpServer())
          .post(loginEndpoint)
          .send(loginPayload)
          .expect(HttpStatus.CREATED)
          .expect((res) => {
            // Get access_token from logging in.
            accessToken = res.body.access_token;

            expect(res.status).toEqual(HttpStatus.CREATED);
            expect(res.body).toHaveProperty('access_token');
            done();
          });
      });
    });

    // describe('Questions', () => {
    //   it('/ (GET) Questions', () => {
    //     return request(app.getHttpServer())
    //       .get(questionsEndpoint)
    //       .expect(HttpStatus.OK)
    //       .expect([]);
    //   });
  
    //   describe('/ (POST) Questions', () => {
    //     it('should be successful', async (done) => {
    //       return request(app.getHttpServer())
    //         .post(questionsEndpoint)
    //         .send(questionPayload)
    //         .expect(HttpStatus.CREATED)
    //         .expect((res) => {
    //           // Get the saved question data after successfully saving.
    //           // questionResponseBody = res.body;

    //           expect(res.status).toEqual(HttpStatus.CREATED);
    //           expect(res.body).toHaveProperty('staticId');
    //           done();
    //         });
    //     });

    //     it('should return 400 bad request', async (done) => {
    //       // Alter payload;
    //       const alteredPayload = { ...questionPayload, name: "" };
    //       return request(app.getHttpServer())
    //         .post(questionsEndpoint)
    //         .send(alteredPayload)
    //         .expect(HttpStatus.BAD_REQUEST)
    //         .expect((res) => {
    //           expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    //           expect(res.body).toHaveProperty('statusCode');
    //           expect(res.body).toHaveProperty('message');
    //           done();
    //         });
    //     });
    //   });

    //   describe('/ (GET) Questions/:questionId', () => {
    //     it('should be successful', async (done) => {
    //       return request(app.getHttpServer())
    //         .get(`${questionsEndpoint}/${questionResponseBody.staticId}`)
    //         .expect(HttpStatus.OK)
    //         .expect((res) => {
    //           expect(res.status).toEqual(HttpStatus.OK);
    //           expect(res.body).toHaveProperty('_id');
    //           expect(res.body).toHaveProperty('name');
    //           expect(res.body).toHaveProperty('address');
    //           expect(res.body).toHaveProperty('email');
    //           expect(res.body).toHaveProperty('description');
    //           expect(res.body._id).toEqual(questionResponseBody.staticId);
    //           expect(res.body.name).toEqual(questionPayload.name);
    //           expect(res.body.address).toEqual(questionPayload.address);
    //           expect(res.body.email).toEqual(questionPayload.email);
    //           expect(res.body.description).toEqual(questionPayload.description);
    //           done();
    //         });
    //     });
    //     it('should not be successful', async (done) => {
    //       return request(app.getHttpServer())
    //         .get(`${questionsEndpoint}/1`)
    //         .expect(HttpStatus.BAD_REQUEST)
    //         .expect((res) => {
    //           expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    //           expect(res.body).toHaveProperty('statusCode');
    //           expect(res.body).toHaveProperty('message');
    //           done();
    //         });
    //     });
    //   });

    // });

    // describe('Users', () => {
    //   describe('/ (GET) Users', () => {
    //     it('should be successful', () => {
    //       return request(app.getHttpServer())
    //         .get(userEndpoint)
    //         .expect(HttpStatus.OK)
    //         .expect([]);
    //     });
    //   });
  
    //   test.concurrent('Post first', async() => {
    //     describe('/ (POST) Users', () => {
    //       it('should be successful', async (done) => {
    //         const alteredPayload = { ...userPayload, questionId: questionResponseBody.staticId };
    //         return request(app.getHttpServer())
    //           .post(userEndpoint)
    //           .send(alteredPayload)
    //           .expect(HttpStatus.CREATED)
    //           .expect((res) => {
    //             userResponseBody = res.body;

    //             expect(res.status).toEqual(HttpStatus.CREATED);
    //             expect(res.body).toHaveProperty('staticId');
    //             done();
    //           });
    //       });
  
    //       it('should return 400 bad request', async (done) => {
    //         // Alter payload;
    //         const alteredPayload = { ...userPayload, name: "" };
    //         return request(app.getHttpServer())
    //           .post(userEndpoint)
    //           .send(alteredPayload)
    //           .expect(HttpStatus.BAD_REQUEST)
    //           .expect((res) => {
    //             expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    //             expect(res.body).toHaveProperty('statusCode');
    //             expect(res.body).toHaveProperty('message');
    //             done();
    //           });
    //       });
    //     });
    //   });

    //   test.concurrent('Get/:userId second', async () => {
    //     describe('/ (GET) Users/:userId', () => {
    //       it('should be successful', async (done) => {
    //         return request(app.getHttpServer())
    //           .get(`${userEndpoint}/${userResponseBody.staticId}`)
    //           .expect(HttpStatus.OK)
    //           .expect((res) => {
    //             expect(res.status).toEqual(HttpStatus.OK);
    //             expect(res.body).toHaveProperty('_id');
    //             expect(res.body).toHaveProperty('name');
    //             expect(res.body).toHaveProperty('type');
    //             expect(res.body).toHaveProperty('period');
    //             expect(res.body).toHaveProperty('year');
    //             expect(res.body).toHaveProperty('assignee');
    //             expect(res.body).toHaveProperty('deadline');
    //             expect(res.body).toHaveProperty('submitted');
    //             expect(res.body).toHaveProperty('url');
    //             expect(res.body).toHaveProperty('questionId');
    //             expect(res.body._id).toEqual(userResponseBody.staticId);
    //             expect(res.body.name).toEqual(userPayload.name);
    //             expect(res.body.type).toEqual(userPayload.type);
    //             expect(res.body.period).toEqual(userPayload.period);
    //             expect(res.body.year).toEqual(userPayload.year);
    //             expect(res.body.assignee).toEqual(userPayload.assignee);
    //             expect(res.body.deadline).toEqual(userPayload.deadline);
    //             expect(res.body.submitted).toEqual(userPayload.submitted);
    //             expect(res.body.url).toEqual(userPayload.url);
    //             expect(res.body.questionId).toEqual(questionResponseBody.staticId);
    //             done();
    //           });
    //       });
    //       it('should not be successful', async (done) => {
    //         return request(app.getHttpServer())
    //           .get(`${userEndpoint}/1`)
    //           .expect(HttpStatus.BAD_REQUEST)
    //           .expect((res) => {
    //             expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    //             expect(res.body).toHaveProperty('statusCode');
    //             expect(res.body).toHaveProperty('message');
    //             done();
    //           });
    //       });
    //     });

    //     describe('/ (GET) Users?questionId=123456789&year=2020', () => {
    //       it('should return one record', async (done) => {
    //         return request(app.getHttpServer())
    //             .get(`${userEndpoint}?questionId=${questionResponseBody.staticId}&year=2020`)
    //             .expect(HttpStatus.OK)
    //             .expect((res) => {
    //               expect(res.status).toEqual(HttpStatus.OK);
    //               expect(res.body.length).toEqual(1);
    //               expect(res.body[0]).toHaveProperty('_id');
    //               expect(res.body[0]).toHaveProperty('name');
    //               expect(res.body[0]).toHaveProperty('type');
    //               expect(res.body[0]).toHaveProperty('period');
    //               expect(res.body[0]).toHaveProperty('year');
    //               expect(res.body[0]).toHaveProperty('assignee');
    //               expect(res.body[0]).toHaveProperty('deadline');
    //               expect(res.body[0]).toHaveProperty('submitted');
    //               expect(res.body[0]).toHaveProperty('url');
    //               expect(res.body[0]).toHaveProperty('questionId');
    //               expect(res.body[0]._id).toEqual(userResponseBody.staticId);
    //               expect(res.body[0].name).toEqual(userPayload.name);
    //               expect(res.body[0].type).toEqual(userPayload.type);
    //               expect(res.body[0].period).toEqual(userPayload.period);
    //               expect(res.body[0].year).toEqual(userPayload.year);
    //               expect(res.body[0].assignee).toEqual(userPayload.assignee);
    //               expect(res.body[0].deadline).toEqual(userPayload.deadline);
    //               expect(res.body[0].submitted).toEqual(userPayload.submitted);
    //               expect(res.body[0].url).toEqual(userPayload.url);
    //               expect(res.body[0].questionId).toEqual(questionResponseBody.staticId);
    //               done();
    //             });
    //       });
    //     });
        
    //   });
    // });
    
  });
});
