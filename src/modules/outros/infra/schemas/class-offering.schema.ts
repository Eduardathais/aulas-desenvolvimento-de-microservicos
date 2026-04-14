import { pgTable, uuid } from "drizzle-orm/pg-core";

export const classOfferingsSchema = pgTable("class_offerings", {
  id: uuid("id").primaryKey().defaultRandom(),
});
