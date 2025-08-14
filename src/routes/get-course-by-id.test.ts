import { beforeAll, expect, test } from 'vitest'
import request from 'supertest'
import { server } from '../app.ts'
import { makeCourse } from '../tests/factories/make-course.ts'
import { randomUUID } from 'crypto'
import { makeAuthenticatedUser } from '../tests/factories/make-user.ts'

beforeAll(() => server.ready())

test('should get a course by id', async () => {
  const course = await makeCourse()

  const { token } = await makeAuthenticatedUser()

  const response = await request(server.server)
    .get(`/courses/${course.id}`)
    .set('Authorization', `Bearer ${token}`)

  expect(response.status).toEqual(200)
  expect(response.body).toEqual({ 
    result: {
      title: expect.any(String),
      description: expect.any(String),
    }
  })
})

test('should get a course not found', async () => {
  const { token } = await makeAuthenticatedUser()

  const response = await request(server.server)
    .get(`/courses/${randomUUID()}`)
    .set('Authorization', `Bearer ${token}`)

  expect(response.status).toEqual(404)
  expect(response.body).toEqual({ result: 'not found' })
})