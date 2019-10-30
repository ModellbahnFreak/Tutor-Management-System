import { Role } from 'shared/dist/model/Role';
import { CreateUserDTO, User } from 'shared/dist/model/User';
import request from 'supertest';
import tutorialService from '../src/services/tutorial-service/TutorialService.class';
import userService from '../src/services/user-service/UserService.class';
import app from './util/Test.App';
import { assertUserToMatchCreateUserDTO } from './util/Test.Assertions';
import { connectToDB, disconnectFromDB } from './util/Test.connectToDB';

const agent = request.agent(app);

beforeAll(async done => {
  await connectToDB();

  await agent
    .post('/api/login')
    .send({})
    .auth('admin', 'admin', { type: 'basic' });

  done();
}, 10 * 60 * 1000);

afterAll(disconnectFromDB);

describe('GET /user[/:id]', () => {
  test(
    'GET /user',
    async done => {
      for (let i = 0; i < 3; i++) {
        await userService.createUser({
          firstname: 'Tanja',
          lastname: 'Testfrau',
          roles: [Role.TUTOR],
          username: `testfrta--${i}`,
          password: 'password',
          tutorials: [],
          tutorialsToCorrect: [],
          email: 'some@mail.com',
        });
      }

      const userList = (await userService.getAllUsers())
        .map(u => JSON.stringify(u))
        .map(u => JSON.parse(u) as User);
      const response = await agent.get('/api/user').send();

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(userList.length);

      // Sort both arrays so the actual order of the elements does not matter.
      response.body.sort((a: User, b: User) => a.id.localeCompare(b.id));
      userList.sort((a, b) => a.id.localeCompare(b.id));
      expect(response.body).toEqual(userList);

      done();
    },
    10 * 60 * 1000
  );

  test('Get an user with a specific ID', async done => {
    const tutorial = await tutorialService.createTutorial({
      slot: 'ST1',
      correctorIds: [],
      dates: [new Date().toDateString()],
      startTime: '09:45:00',
      endTime: '11:15:00',
      tutorId: undefined,
    });
    const userToCreate: CreateUserDTO = {
      firstname: 'Testi',
      lastname: 'Testmann',
      username: 'UserSpecId',
      password: 'password',
      email: 'some@mail.de',
      roles: [Role.TUTOR],
      tutorials: [tutorial.id],
      tutorialsToCorrect: [],
    };

    const user = await userService.createUser(userToCreate);
    const response = await agent.get(`/api/user/${user.id}`).send();

    expect(response.status).toBe(200);
    assertUserToMatchCreateUserDTO(userToCreate, response.body);

    done();
  });
});

describe('POST /user', () => {
  test('Create a user without tutorials', done => {
    const userToCreate: CreateUserDTO = {
      firstname: 'Tanja',
      lastname: 'Testfrau',
      roles: [Role.TUTOR],
      username: 'testfrta',
      password: 'password',
      tutorials: [],
      tutorialsToCorrect: [],
      email: 'some@mail.com',
    };

    addUserToDatabase(userToCreate, done);
  });

  test('Create a user with one tutorial', async done => {
    const tutorial = await tutorialService.createTutorial({
      slot: 'T1',
      dates: [new Date().toDateString()],
      startTime: '09:45:00',
      endTime: '11:15:00',
      tutorId: undefined,
      correctorIds: [],
    });

    const userToCreate: CreateUserDTO = {
      firstname: 'Max',
      lastname: 'Mustermann',
      roles: [Role.TUTOR],
      username: 'musterma',
      password: 'password',
      tutorials: [tutorial.id],
      tutorialsToCorrect: [],
      email: 'some@mail.com',
    };

    addUserToDatabase(userToCreate, done);
  });

  test('Create a user with multiple tutorials', async done => {
    const tutorialIds: string[] = [];

    for (let i = 0; i < 3; i++) {
      const tutorial = await tutorialService.createTutorial({
        slot: `MultiT${i}`,
        dates: [new Date().toDateString()],
        startTime: '09:45:00',
        endTime: '11:15:00',
        tutorId: undefined,
        correctorIds: [],
      });

      tutorialIds.push(tutorial.id);
    }

    const userToCreate: CreateUserDTO = {
      firstname: 'Sabine',
      lastname: 'Samplewoman',
      roles: [Role.TUTOR],
      username: 'samplese',
      password: 'password',
      tutorials: [...tutorialIds],
      tutorialsToCorrect: [],
      email: 'some@mail.com',
    };

    addUserToDatabase(userToCreate, done);
  });
});

describe('PATCH /user/:id', () => {
  test.todo('Update a user without tutorials');

  test.todo('Update a user with tutorials');
});

describe('DELETE /user/:id', () => {
  test.todo('Delete a user without tutorials');

  test.todo('Delete a user tutorials');
});

/**
 * Sends a POST request to create a user with the given information.
 *
 * After receiving a response the response is checked against:
 * - Response having a 201 Status
 * - Response body contains the expected created user information
 *
 * @param userToCreate CreateUserDTO to send
 * @param done Jest done callback
 */
async function addUserToDatabase(userToCreate: CreateUserDTO, done: jest.DoneCallback) {
  const response = await agent.post('/api/user').send(userToCreate);

  expect(response.status).toBe(201);
  assertUserToMatchCreateUserDTO(userToCreate, response.body);

  done();
}
