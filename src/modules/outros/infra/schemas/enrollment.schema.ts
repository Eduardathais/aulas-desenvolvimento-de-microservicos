import { pgTable, uuid } from "drizzle-orm/pg-core";

export const enrollmentsSchema = pgTable("enrollments", {
  id: uuid("id").primaryKey().defaultRandom(),
});
