import { pgTable, text, uuid } from "drizzle-orm/pg-core";

export const teachersSchema = pgTable("teachers", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
});
