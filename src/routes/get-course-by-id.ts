import { eq } from "drizzle-orm"
import z from "zod"
import { db } from "../database/client.ts"
import { courses } from "../database/schema.ts"
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { checkUserToken } from "./hooks/check-user-token.ts"
import { getAuthenticatedUserFromRequest } from "../utils/get-authenticated-user-from-request.ts"
import { checkUserRole } from "./hooks/check-user-role.ts"

export const getCourseByIdRoute: FastifyPluginAsyncZod = async (server) => {
  server.get('/courses/:id', {
    preHandler: [
      checkUserToken,
      checkUserRole('manager')
    ],
    schema: {
      tags: ['Courses'],
      summary: 'Get a course by id',
      params: z.object({
        id: z.string(),
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
    const user = getAuthenticatedUserFromRequest(req)
    
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
