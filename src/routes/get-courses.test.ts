import { beforeAll, expect, test } from 'vitest'
import request from 'supertest'
import { server } from '../app.ts'
import { makeCourse } from '../tests/factories/make-course.ts'
import { randomUUID } from 'crypto'

beforeAll(() => server.ready())

test('should get a course by id', async () => {

  const titleId = randomUUID()
  
  await makeCourse(titleId)

  const response = await request(server.server).get(`/courses?search=${titleId}`)

  expect(response.status).toEqual(200)

  expect(response.body).toEqual({
    total: 1,
    result: [
      {
        id: expect.any(String),
        description: expect.any(String),
        title: titleId,
        enrollments: 0,
      }
    ],
  });

})