import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { defineRelations } from "drizzle-orm";

const profiles = sqliteTable("profiles", {
  userId: text().notNull(),
  level: int().default(0).notNull(),
  experience: int().default(0).notNull(),
});

export default { profiles };
