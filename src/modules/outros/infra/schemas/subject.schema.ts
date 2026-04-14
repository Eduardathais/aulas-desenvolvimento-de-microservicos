import { pgTable, text, uuid } from "drizzle-orm/pg-core";

export const subjectsSchema = pgTable("subjects", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
});
