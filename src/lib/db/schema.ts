import {pgEnum, pgTable,boolean, integer, uuid, text, timestamp } from "drizzle-orm/pg-core";

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

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});