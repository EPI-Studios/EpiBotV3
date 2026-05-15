import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
export const profiles = sqliteTable("profiles", {
  userId: text().notNull(),
  level: int().default(0).notNull(),
  experience: int().default(0).notNull(),
  money: int().default(0).notNull(),
});

export const reactionRoles = sqliteTable("reactionRoles", {
  channelId: text().notNull(),
  messageId: text().notNull(),
  roleId: text().notNull(),
  emoji: text().notNull(),
});

export const levelRoles = sqliteTable("levelRoles", {
  level: int().notNull(),
  roleId: text().notNull(),
  multiplier: int().notNull(),
});

export default {
  profiles,
  reactionRoles,
  levelRoles,
};
