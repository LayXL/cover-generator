import {
  integer,
  json,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core"

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  vkId: integer("vkId").unique(),
  displayName: text("displayName"),
  latestActivityAt: timestamp("latestActivity", { withTimezone: true })
    .defaultNow()
    .notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow(),
})

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("name"),
  authorId: integer("authorId").references(() => users.id, {
    onDelete: "cascade",
  }),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow(),
  data: json("data").notNull(),
})

export const media = pgTable("media", {
  uuid: text("uuid").notNull().primaryKey(),
  authorId: integer("authorId").references(() => users.id, {
    onDelete: "cascade",
  }),
  projectId: integer("projectId").references(() => projects.id, {
    onDelete: "cascade",
  }),
  width: integer("width").notNull(),
  height: integer("height").notNull(),
  blurhash: text("blurhash"),
})
