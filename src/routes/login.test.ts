import { beforeAll, expect, test } from 'vitest'
import request from 'supertest'
import { server } from '../app.ts'
import { randomUUID } from 'crypto'
import { makeUser } from '../tests/factories/make-user.ts'
import { fakerPT_BR as faker } from '@faker-js/faker'

beforeAll(() => server.ready())

test('should login', async () => {

  const { user, passwordBeforeHash } = await makeUser()

  const response = await request(server.server).post(`/login`).send({
    email: user.email,
    password: passwordBeforeHash,
  })

  expect(response.status).toEqual(200)

  expect(response.body).toEqual({ result: expect.any(String) })

})

test('should login with invalid credentials', async () => {

  const { user } = await makeUser()

  const response = await request(server.server).post(`/login`).send({
    email: user.email,
    password: randomUUID()
  })

  expect(response.status).toEqual(401)

  expect(response.body).toEqual({ result: 'unauthorized' })

})

test('should login with invalid email', async () => {

  const response = await request(server.server).post(`/login`).send({
    email: faker.internet.email(),
    password: randomUUID()
  })

  expect(response.status).toEqual(401)

  expect(response.body).toEqual({ result: 'unauthorized' })

})