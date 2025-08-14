import { pgTable, uuid, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
})

export const courses = pgTable('courses', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull().unique(),
  description: text('description').notNull(),
})

export const enrollments = pgTable('enrollments', {
  user_id: uuid('user_id').notNull().references(() => users.id),
  course_id: uuid('course_id').notNull().references(() => courses.id),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, table => [ uniqueIndex('user_course').on(table.user_id, table.course_id) ])