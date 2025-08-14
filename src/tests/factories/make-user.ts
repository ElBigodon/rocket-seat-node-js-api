import { db } from "../../database/client.ts";
import { users } from "../../database/schema.ts";
import { fakerPT_BR as faker } from "@faker-js/faker"
import { hash } from 'argon2'
import { randomUUID } from 'crypto'
import jwt from 'jsonwebtoken'

export async function makeUser(role: 'student' | 'manager' = 'student') {
  const password = randomUUID()

  const [user] = await db.insert(users).values({
    email: faker.internet.email(),
    password: await hash(password),
    name: faker.person.firstName(),
    role,
  }).returning()

  return {
    user,
    passwordBeforeHash: password,
  }
}

export async function makeAuthenticatedUser(role: 'student' | 'manager' = 'manager') {
  const { user } = await makeUser(role)
  
  const token = jwt.sign(
    { sub: user.id, role: user.role },
    process.env.JWT_SECRET!,
    {
      expiresIn: '1d',
    }
  )

  return {
    user,
    token,
  };
}
