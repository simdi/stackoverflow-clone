import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

// beforeAll(async () => {
//   await mongoose.connect(process.env.MONGODB_CONNECTION_STRING_TEST, { useUnifiedTopology: true });
//   await mongoose.connection.db.dropDatabase();
// });

// afterAll(async (done) => {
//   await mongoose.disconnect(done);
// });

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('Integration test', () => {
    const questionPayload = {
      "name": "MTN",
      "address": "No 23 Mukola Adeogun, VI, Lagos, Nigeria",
      "email": "mokola@yahoo.com",
      "description": "MTN is a telecommunication question"
    };

    // let questionResponseBody;
    // let userResponseBody;

    describe('Home', () => {
      it('/ (GET)', () => {
        return request(app.getHttpServer())
          .get('/')
          .expect(HttpStatus.OK)
          .expect('Hello World!');
      });
    });

    // describe('Questions', () => {
    //   it('/ (GET) Questions', () => {
    //     return request(app.getHttpServer())
    //       .get(questionEndpoint)
    //       .expect(HttpStatus.OK)
    //       .expect([]);
    //   });
  
    //   describe('/ (POST) Questions', () => {
    //     it('should be successful', async (done) => {
    //       return request(app.getHttpServer())
    //         .post(questionEndpoint)
    //         .send(questionPayload)
    //         .expect(HttpStatus.CREATED)
    //         .expect((res) => {
    //           // Get the saved question data after successfully saving.
    //           questionResponseBody = res.body;

    //           expect(res.status).toEqual(HttpStatus.CREATED);
    //           expect(res.body).toHaveProperty('staticId');
    //           done();
    //         });
    //     });

    //     it('should return 400 bad request', async (done) => {
    //       // Alter payload;
    //       const alteredPayload = { ...questionPayload, name: "" };
    //       return request(app.getHttpServer())
    //         .post(questionEndpoint)
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
    //         .get(`${questionEndpoint}/${questionResponseBody.staticId}`)
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
    //         .get(`${questionEndpoint}/1`)
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
