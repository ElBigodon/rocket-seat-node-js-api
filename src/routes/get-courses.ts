import { db } from "../database/client.ts";
import { courses } from "../database/schema.ts";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";

export const getCoursesRoute: FastifyPluginAsyncZod = async (server) => {
  server.get('/courses',  {
    schema: {
      tags: ['Courses'],
      summary: 'Get all courses',
      response: {
        200: z.array(
          z.object({
            id: z.string(),
            title: z.string(),
            description: z.string(),
          })
        )
      }
    }
  }, () => db.select().from(courses))
}