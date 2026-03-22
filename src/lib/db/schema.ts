import {pgEnum, pgTable, integer, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const transferStatusEnum = pgEnum("transfer_status", ["pending", "running", "completed", "failed", "paused"]);

export const matchStatusEnum = pgEnum("match_status", ["pending", "exact", "fuzzy","vibe", "not_found"]);

export const transferJobs = pgTable("transfer_jobs", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  sourcePlaylistName: text("source_playlist_name").notNull(),
  status: transferStatusEnum("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
  sourcePlatform: text("source_platform").notNull(),
  destPlatform: text("dest_platform").notNull(),
  totalTracks: integer("total_tracks").default(0),
});

export const transferTracks = pgTable("transfer_tracks", {
  id: uuid("id").defaultRandom().primaryKey(),
  jobId: uuid("job_id").notNull().references(() => transferJobs.id),
  sourceTrackId: text("source_track_id").notNull(),
  sourceTitle: text("source_title").notNull(),
  sourceArtist: text("source_artist").notNull(),
  matchStatus: matchStatusEnum("match_status").default("pending"),
  destTrackId: text("dest_track_id"),
  position: integer("position").notNull(),
});