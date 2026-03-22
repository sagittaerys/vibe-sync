import { pgTable, integer, uuid, text, timestamp } from "drizzle-orm/pg-core";



export const transferJobs = pgTable("transfer_jobs", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  sourcePlaylistName: text("source_playlist_name").notNull(),
  status: text("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
  sourcePlatform: text("source_platform").notNull(),
  destPlatform: text("dest_platform").notNull(),
  totalTracks: integer("total_tracks").default(0),
});