import { and, asc, count, desc, eq, getTableColumns, ilike, SQL } from "drizzle-orm";
import { db } from "../database/client.ts";
import { courses, enrollments } from "../database/schema.ts";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";

export const getCoursesRoute: FastifyPluginAsyncZod = async (server) => {
  server.get('/courses',  {
    schema: {
      tags: ['Courses'],
      summary: 'Get all courses',
      querystring: z.object({
        search: z.string().optional(),
        orderBy: z.enum(['title', 'description']).optional().default('title'),
        page: z.coerce.number().min(1).optional().default(1),
        limit: z.coerce.number().optional().default(10),
      }),
      response: {
        200: z.object({
          result: z.array(
            z.object({
              id: z.string(),
              title: z.string(),
              description: z.string(),
              enrollments: z.number()
            })
          ),
          total: z.number()
        })
      }
    }
  }, async (req) => {
    const { search, orderBy, page, limit } = req.query

    const offset = (page - 1) * limit

    const conditions: SQL[] = []

    if (search) {
      conditions.push(ilike(courses.title, `%${search}%`))
    }

    const [result, total] = await Promise.all([
      db.select({
        ...getTableColumns(courses),
        enrollments: count(enrollments.course_id)
      })
      .from(courses)
      .orderBy(asc(courses[orderBy]))
      .leftJoin(enrollments, eq(courses.id, enrollments.course_id))
      .groupBy(courses.id)
      .limit(limit)
      .offset(offset)
      .where(and(...conditions)),

      db.$count(courses, and(...conditions))
    ])
    
    return { result, total }
  })
}