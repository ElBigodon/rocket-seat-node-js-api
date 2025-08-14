import { beforeAll, expect, test } from 'vitest'
import request from 'supertest'
import { server } from '../app.ts'
import { fakerPT_BR as faker } from '@faker-js/faker'

beforeAll(() => server.ready())

test('should create a course', async () => {
  const response = await request(server.server)
    .post('/courses')
    .set('Content-Type', 'application/json')
    .send({
      title: faker.lorem.sentence(3),
      description: faker.lorem.sentence()
    })

  expect(response.status).toEqual(201)
  expect(response.body).toEqual({ result: expect.any(String) })
})