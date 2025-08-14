import { beforeAll, expect, test } from 'vitest'
import request from 'supertest'
import { server } from '../app.ts'
import { makeCourse } from '../tests/factories/make-course.ts'
import { randomUUID } from 'crypto'

beforeAll(() => server.ready())

test('should get a course by id', async () => {
  const course = await makeCourse()

  const response = await request(server.server).get(`/courses/${course.id}`)

  expect(response.status).toEqual(200)
  expect(response.body).toEqual({ 
    result: {
      title: expect.any(String),
      description: expect.any(String),
    }
  })
})

test('should get a course not found', async () => {
  const response = await request(server.server).get(`/courses/${randomUUID()}`)

  expect(response.status).toEqual(404)
  expect(response.body).toEqual({ result: 'not found' })
})