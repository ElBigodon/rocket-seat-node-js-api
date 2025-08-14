import { eq } from "drizzle-orm"
import z from "zod"
import { db } from "../database/client.ts"
import { courses } from "../database/schema.ts"
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"

export const getCourseByIdRoute: FastifyPluginAsyncZod = async (server) => {
  server.get('/courses/:id', {
    schema: {
      tags: ['Courses'],
      summary: 'Get a course by id',
      params: z.object({
        id: z.uuid(),
      }),
      response: {
        200: z.object({
          result: z.object({
            title: z.string(),
            description: z.string(),
          }),
        }),
        400: z.object({
          result: z.string(),
        }),
        404: z.object({
          result: z.string(),
        })
      }
    },
  }, async (req, res) => {
    const params = req.params

    const course = await db.select({
      title: courses.title,
      description: courses.description
    })
      .from(courses)
      .where(eq(courses.id, params.id))

    if (course.length === 0) {
      return res.status(404).send({ result: 'not found' });
    }
  
    return res.status(200).send({ result: course[0] })
  })
    
}
