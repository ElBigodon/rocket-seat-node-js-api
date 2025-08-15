import z from "zod"
import { db } from "../database/client.ts"
import { courses } from "../database/schema.ts"
import crypto from "node:crypto"
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { checkUserRole } from "./hooks/check-user-role.ts"
import { checkUserToken } from "./hooks/check-user-token.ts"

export const postCourseRoute: FastifyPluginAsyncZod = async (server) => {
  server.post('/courses', {
    preHandler: [
      checkUserToken,
      checkUserRole('manager')
    ],
    schema: {
      tags: ['Courses'],
      summary: 'Create a new course',
      body: z.object({
        title: z.string().min(5, 'title must have at least 5 characters'),
        description: z.string(),
      }),
      response: {
        201: z.object({
          result: z.uuid(),
        })
      }
    },
  }, async (req, res) => {
    const body = req.body
     
    const newId = crypto.randomUUID()
  
    const result: { id: string }[] = await db.insert(courses).values({ 
      id: newId,
      title: body.title,
      description: body.description
    }).returning({ id: courses.id })
    
    return res.status(201).send({ result: result[0].id })
  });
}
