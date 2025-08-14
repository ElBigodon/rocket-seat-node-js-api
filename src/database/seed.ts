import { db } from "./client.ts"
import { courses, enrollments, users } from "./schema.ts"
import { fakerPT_BR as faker } from "@faker-js/faker"

async function seed() {
  const usersInsert = await db.insert(users).values([
    { name: faker.person.firstName(), email: faker.internet.email() },
    { name: faker.person.firstName(), email: faker.internet.email() },
    { name: faker.person.firstName(), email: faker.internet.email() },
  ]).returning();

  const coursesInsert = await db.insert(courses).values([
    { title: faker.lorem.sentence(3), description: faker.lorem.sentence() },
    { title: faker.lorem.sentence(3), description: faker.lorem.sentence() }
  ]).returning();

  await db.insert(enrollments).values([
    { user_id: usersInsert[0].id, course_id: coursesInsert[0].id },
    { user_id: usersInsert[0].id, course_id: coursesInsert[1].id },
    { user_id: usersInsert[1].id, course_id: coursesInsert[1].id },
  ])
}

seed()