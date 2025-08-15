import { beforeAll, expect, test } from 'vitest'
import request from 'supertest'
import { server } from '../app.ts'
import { fakerPT_BR as faker } from '@faker-js/faker'
import { makeAuthenticatedUser } from '../tests/factories/make-user.ts'

beforeAll(() => server.ready())

test('should create a course with authenticated user and manager role', async () => {
  const { token } = await makeAuthenticatedUser()

  const response = await request(server.server)
    .post('/courses')
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json')
    .send({
      title: faker.lorem.sentence(3),
      description: faker.lorem.sentence()
    })

  expect(response.status).toEqual(201)
  expect(response.body).toEqual({ result: expect.any(String) })
})

test('should not create a course with authenticated user and student role', async () => {
  const { token } = await makeAuthenticatedUser('student')

  const response = await request(server.server)
    .post('/courses')
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json')
    .send({
      title: faker.lorem.sentence(3),
      description: faker.lorem.sentence()
    })

  expect(response.status).toEqual(401)
})

test('should not create a course with invalid token', async () => {
  const response = await request(server.server)
    .post('/courses')
    .set('Authorization', `Bearer invalid_token`)
    .set('Content-Type', 'application/json')
    .send({
      title: faker.lorem.sentence(3),
      description: faker.lorem.sentence()
    })

  expect(response.status).toEqual(401)
})