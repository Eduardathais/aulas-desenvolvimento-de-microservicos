import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { teachersSchema } from "./teacher.schema";

export const usersSchema = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  teacherId: uuid("teacher_id").references(() => teachersSchema.id),
  permissions: text("permissions").array().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
});
