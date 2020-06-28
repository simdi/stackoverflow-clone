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
    const answerPayload = { body: "This link might be helpful to you, as it details the use of the Haversine formula to calculate the distance.\n```Excerpt: This script [in Javascript] calculates great-circle distances between the two points – that is, the shortest distance over the earth’s surface – using the ‘Haversine’ formula.```" };
    const query = { page: 1, limit: 10 };
    const searchQuery = { ...query, text: 'unknown' };
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

    describe('Questions', () => {
      it('/ (GET) Questions', async(done) => {
        return request(app.getHttpServer())
          .get(questionsEndpoint)
          .set('Authorization', 'Bearer ' + accessToken)
          .expect(HttpStatus.OK)
          .expect(res => {
            expect(res.status).toEqual(HttpStatus.OK);
            expect(res.body).toHaveProperty('docs');
            expect(res.body.docs).toEqual([]);
            expect(res.body).toHaveProperty('totalDocs');
            expect(res.body.totalDocs).toBe(0);
            expect(res.body).toHaveProperty('limit');
            expect(res.body.limit).toBe(0);
            expect(res.body).toHaveProperty('totalPages');
            expect(res.body.totalPages).toBeNull();
            done();
          });
      });
  
      describe('/ (POST) Questions', () => {
        it('should be successful', async (done) => {
          return request(app.getHttpServer())
            .post(questionsEndpoint)
            .set('Authorization', 'Bearer ' + accessToken)
            .send(questionPayload)
            .expect(HttpStatus.CREATED)
            .expect((res) => {
              // Get the saved question data after successfully saving.
              questionResponseBody = res.body;

              expect(res.body).toHaveProperty('id');
              done();
            });
        });

        it('should return 400 bad request', async (done) => {
          // Alter payload;
          const alteredPayload = { ...questionPayload, title: "" };
          return request(app.getHttpServer())
            .post(questionsEndpoint)
            .set('Authorization', 'Bearer ' + accessToken)
            .send(alteredPayload)
            .expect(HttpStatus.BAD_REQUEST)
            .expect((res) => {
              expect(res.body).toHaveProperty('status');
              expect(res.body).toHaveProperty('message');
              expect(res.body).toHaveProperty('timestamp');
              expect(res.body).toHaveProperty('path');
              expect(res.body).toHaveProperty('method');
              done();
            });
        });
      });

      describe('/ (GET) Questions/:questionId', () => {
        it('should be successful', async (done) => {
          return request(app.getHttpServer())
            .get(`${questionsEndpoint}/${questionResponseBody.id}`)
            .set('Authorization', 'Bearer ' + accessToken)
            .expect(HttpStatus.OK)
            .expect((res) => {
              expect(res.status).toEqual(HttpStatus.OK);
              expect(res.body).toHaveProperty('_id');
              expect(res.body).toHaveProperty('title');
              expect(res.body).toHaveProperty('vote');
              expect(res.body).toHaveProperty('body');
              expect(res.body).toHaveProperty('answers');
              expect(res.body._id).toEqual(questionResponseBody.id);
              expect(res.body.title).toEqual(questionPayload.title);
              expect(res.body.vote).toEqual(0);
              expect(res.body.answers).toEqual([]);
              expect(res.body.body).toEqual(questionPayload.body);
              done();
            });
        });

        it('should not be successful', async (done) => {
          return request(app.getHttpServer())
            .get(`${questionsEndpoint}/1`)
            .set('Authorization', 'Bearer ' + accessToken)
            .expect(HttpStatus.BAD_REQUEST)
            .expect((res) => {
              expect(res.body).toHaveProperty('status');
              expect(res.body).toHaveProperty('message');
              expect(res.body).toHaveProperty('timestamp');
              expect(res.body).toHaveProperty('path');
              expect(res.body).toHaveProperty('method');
              done();
            });
        });
      });

      describe('/ (GET) Questions/search', () => {
        it('should be successful', async (done) => {
          return request(app.getHttpServer())
            .get(`${questionsEndpoint}/search?limit=10&page=1&text=distance`)
            .set('Authorization', 'Bearer ' + accessToken)
            .expect(HttpStatus.OK)
            .expect((res) => {
              expect(res.body).toHaveProperty('docs');
              expect(res.body.docs.length).toEqual(1);
              expect(res.body).toHaveProperty('totalDocs');
              expect(res.body.totalDocs).toBe(1);
              expect(res.body).toHaveProperty('limit');
              expect(res.body.limit).toBe(10);
              expect(res.body).toHaveProperty('page');
              expect(res.body.page).toBe(1);
              expect(res.body).toHaveProperty('pagingCounter');
              expect(res.body.pagingCounter).toBe(1);
              expect(res.body).toHaveProperty('totalPages');
              expect(res.body.totalPages).toBe(1);
              expect(res.body.docs[0]).toHaveProperty('_id');
              expect(res.body.docs[0]).toHaveProperty('title');
              expect(res.body.docs[0]).toHaveProperty('vote');
              expect(res.body.docs[0]).toHaveProperty('body');
              expect(res.body.docs[0]).toHaveProperty('answers');
              expect(res.body.docs[0]._id).toEqual(questionResponseBody.id);
              expect(res.body.docs[0].title).toEqual(questionPayload.title);
              expect(res.body.docs[0].vote).toEqual(0);
              expect(res.body.docs[0].answers).toEqual([]);
              expect(res.body.docs[0].body).toEqual(questionPayload.body);
              done();
            });
        });

        it('should be successful with an empty array of docs', async (done) => {
          return request(app.getHttpServer())
            .get(`${questionsEndpoint}/search?limit=10&page=1&text=nothing`)
            .set('Authorization', 'Bearer ' + accessToken)
            .expect(HttpStatus.OK)
            .expect((res) => {
              expect(res.body).toHaveProperty('docs');
              expect(res.body.docs).toEqual([]);
              expect(res.body).toHaveProperty('totalDocs');
              expect(res.body.totalDocs).toBe(0);
              expect(res.body).toHaveProperty('limit');
              expect(res.body.limit).toBe(10);
              expect(res.body).toHaveProperty('totalPages');
              expect(res.body.totalPages).toBe(1);
              done();
            });
        });
      });
      
      describe('/ (POST) Questions/{questionId}/answer', () => {
        it('should be successful', async (done) => {
          return request(app.getHttpServer())
            .post(`${questionsEndpoint}/${questionResponseBody.id}/answer`)
            .set('Authorization', 'Bearer ' + accessToken)
            .send(answerPayload)
            .expect(HttpStatus.CREATED)
            .expect((res) => {
              expect(res.body).toHaveProperty('id');
              done();
            });
        });

        it('confirm that the answer was successful ', async (done) => {
          return request(app.getHttpServer())
            .get(`${questionsEndpoint}/${questionResponseBody.id}`)
            .set('Authorization', 'Bearer ' + accessToken)
            .expect(HttpStatus.OK)
            .expect((res) => {
              expect(res.status).toEqual(HttpStatus.OK);
              expect(res.body).toHaveProperty('_id');
              expect(res.body).toHaveProperty('title');
              expect(res.body).toHaveProperty('vote');
              expect(res.body).toHaveProperty('body');
              expect(res.body).toHaveProperty('answers');
              expect(res.body.answers.length).toEqual(1);
              expect(res.body._id).toEqual(questionResponseBody.id);
              expect(res.body.title).toEqual(questionPayload.title);
              expect(res.body.vote).toEqual(0);
              expect(res.body.body).toEqual(questionPayload.body);
              done();
            });
        });
      });
      
      describe('/ (POST) Questions/{questionId}/vote/{voteType}', () => {
        it('should be successful', async (done) => {
          return request(app.getHttpServer())
            .patch(`${questionsEndpoint}/${questionResponseBody.id}/vote/2`)
            .set('Authorization', 'Bearer ' + accessToken)
            .send(answerPayload)
            .expect(HttpStatus.OK)
            .expect((res) => {
              expect(res.body).toHaveProperty('success');
              expect(res.body.success).toBeTruthy();
              done();
            });
        });

        it('confirm that the answer was successful ', async (done) => {
          return request(app.getHttpServer())
            .get(`${questionsEndpoint}/${questionResponseBody.id}`)
            .set('Authorization', 'Bearer ' + accessToken)
            .expect(HttpStatus.OK)
            .expect((res) => {
              expect(res.status).toEqual(HttpStatus.OK);
              expect(res.body).toHaveProperty('_id');
              expect(res.body).toHaveProperty('title');
              expect(res.body).toHaveProperty('vote');
              expect(res.body).toHaveProperty('body');
              expect(res.body).toHaveProperty('answers');
              expect(res.body.answers.length).toEqual(1);
              expect(res.body._id).toEqual(questionResponseBody.id);
              expect(res.body.title).toEqual(questionPayload.title);
              expect(res.body.vote).toEqual(1);
              expect(res.body.body).toEqual(questionPayload.body);
              done();
            });
        });
      });

    });

    describe('Users', () => {
      describe('/ (GET) Users', () => {
        it('should be successful', async(done) => {
          return request(app.getHttpServer())
          .get(`${usersEndpoint}?limit=10&page=1`)
          .set('Authorization', 'Bearer ' + accessToken)
          .expect(HttpStatus.OK)
          .expect(res => {
            expect(res.body).toHaveProperty('docs');
            expect(res.body.docs.length).toEqual(1);
            expect(res.body).toHaveProperty('totalDocs');
            expect(res.body.totalDocs).toBe(1);
            expect(res.body).toHaveProperty('limit');
            expect(res.body.limit).toBe(10);
            expect(res.body).toHaveProperty('page');
            expect(res.body.page).toBe(1);
            expect(res.body).toHaveProperty('pagingCounter');
            expect(res.body.pagingCounter).toBe(1);
            expect(res.body).toHaveProperty('totalPages');
            expect(res.body.totalPages).toBe(1);
            done();
          });
        });
      });
      
      describe('/ (POST) Users', () => {
        it('should be successful', async (done) => {
          const alternateUser = { ...userPayload, email: 'email2@yahoo.com' };
          return request(app.getHttpServer())
            .post(usersEndpoint)
            .set('Authorization', 'Bearer ' + accessToken)
            .send(alternateUser)
            .expect(HttpStatus.CREATED)
            .expect((res) => {
              userResponseBody = res.body;
              expect(res.body).toHaveProperty('id');
              done();
            });
        });

        it('should return 400 bad request', async (done) => {
          // Alter payload;
          return request(app.getHttpServer())
            .post(usersEndpoint)
            .set('Authorization', 'Bearer ' + accessToken)
            .send(userPayload)
            .expect(HttpStatus.BAD_REQUEST)
            .expect((res) => {
              expect(res.body).toHaveProperty('status');
              expect(res.body).toHaveProperty('message');
              expect(res.body).toHaveProperty('timestamp');
              expect(res.body).toHaveProperty('path');
              expect(res.body).toHaveProperty('method');
              done();
            });
        });
      });

      describe('/ (GET) Users/:userId', () => {
        it('should be successful', async (done) => {
          return request(app.getHttpServer())
            .get(`${usersEndpoint}/${userResponseBody.id}`)
            .set('Authorization', 'Bearer ' + accessToken)
            .expect(HttpStatus.OK)
            .expect((res) => {
              expect(res.body).toHaveProperty('_id');
              expect(res.body).toHaveProperty('role');
              expect(res.body).toHaveProperty('firstName');
              expect(res.body).toHaveProperty('lastName');
              expect(res.body).toHaveProperty('email');
              expect(res.body._id).toEqual(userResponseBody.id);
              expect(res.body.firstName).toEqual(userPayload.firstName);
              expect(res.body.lastName).toEqual(userPayload.lastName);
              done();
            });
        });
        it('should not be successful', async (done) => {
          return request(app.getHttpServer())
            .get(`${usersEndpoint}/1`)
            .set('Authorization', 'Bearer ' + accessToken)
            .expect(HttpStatus.BAD_REQUEST)
            .expect((res) => {
              expect(res.body).toHaveProperty('status');
              expect(res.body).toHaveProperty('message');
              expect(res.body).toHaveProperty('timestamp');
              expect(res.body).toHaveProperty('path');
              expect(res.body).toHaveProperty('method');
              done();
            });
        });
      });

      describe('/ (GET) Users/search', () => {
        it('should return two records', async (done) => {
          return request(app.getHttpServer())
              .get(`${usersEndpoint}/search?page=1&limit=10&name=john`)
              .set('Authorization', 'Bearer ' + accessToken)
              .expect(HttpStatus.OK)
              .expect((res) => {
                expect(res.body).toHaveProperty('docs');
                expect(res.body.docs.length).toEqual(2);
                expect(res.body).toHaveProperty('totalDocs');
                expect(res.body.totalDocs).toBe(2);
                expect(res.body).toHaveProperty('limit');
                expect(res.body.limit).toBe(10);
                expect(res.body).toHaveProperty('page');
                expect(res.body.page).toBe(1);
                expect(res.body).toHaveProperty('pagingCounter');
                expect(res.body.pagingCounter).toBe(1);
                expect(res.body).toHaveProperty('totalPages');
                expect(res.body.totalPages).toBe(1);
                done();
              });
        });
      });

    });
    
  });
});
