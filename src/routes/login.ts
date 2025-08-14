// Joana80@bol.com.br

import z from "zod"
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { verify as verifyHash } from 'argon2'
import { db } from "../database/client.ts";
import { users } from "../database/schema.ts";
import jwt from 'jsonwebtoken'
import { eq } from "drizzle-orm";

export const loginRoute: FastifyPluginAsyncZod = async (server) => {
  server.post('/login', {
    schema: {
      tags: ['Auth'],
      summary: 'Login',
      body: z.object({
        email: z.email(),
        password: z.string(),
      }),
      response: {
        200: z.object({
          result: z.string(),
        }),
        401: z.object({
          result: z.enum(['unauthorized']),
        })
      }
    },
  }, async (req, res) => {
    const { email, password } = req.body

    const result = await db.select().from(users).where(eq(users.email, email))

    if (result.length === 0) {
      return res.status(401).send({ result: 'unauthorized' })
    }

    const [user] = result;
    
    const isPasswordValid = await verifyHash(user.password!, password)

    if (isPasswordValid === false) {
      return res.status(401).send({ result: 'unauthorized' })
    }

    const token = jwt.sign(
      { sub: user.id, role: user.role },
      process.env.JWT_SECRET!,
      {
        expiresIn: '1d',
      }
    )

    return res.status(200).send({ result: token })
  });
}
