import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";



export const transferJobs = pgTable("transfer_jobs", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  sourcePlaylistName: text("sourcePlaylistName").notNull(),
  status: text("status").default("pending"),
  createdAt: timestamp("createdAt").defaultNow(),
});