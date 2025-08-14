import { db } from "../../database/client.ts";
import { courses } from "../../database/schema.ts";
import { fakerPT_BR as faker } from "@faker-js/faker"

export async function makeCourse(title?: string) {
  const result = await db.insert(courses).values({
    title: title ?? faker.lorem.sentence(3),
    description: faker.lorem.sentence()
  }).returning()

  return result[0]
}