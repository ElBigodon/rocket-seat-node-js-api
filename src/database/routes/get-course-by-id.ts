import { eq } from "drizzle-orm"
import z from "zod"
import { db } from "../client.ts"
import { courses } from "../schema.ts"
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
    
    if ('id' in params === false || typeof params.id !== 'string') {
      res.status(400)
      
      return {
        result: 'course id is required'
      }
    }
    
    const course = await db.select({
      title: courses.title,
      description: courses.description
    })
      .from(courses)
      .where(eq(courses.id, params.id))
  
    if (!course) {
      res.status(404);
      
      return { result: 'not found' }
    }
  
    return { result: course[0] }
  })
    
}
