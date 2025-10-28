import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { randomUUID } from "crypto";
import { sql } from "drizzle-orm";

import { usersTable } from "./user.schema";

export const studySessionsTable = sqliteTable("study_sessions", {
	id: text("id")
		.primaryKey()
		.notNull()
		.unique()
		.$defaultFn(() => randomUUID()),

	createdBy: text("created_by")
		.notNull()
		.references(() => usersTable.id),

	status: text("status", { enum: ["active", "completed"] })
		.notNull()
		.default("active"),

	startedAt: integer("started_at", { mode: "timestamp_ms" })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.notNull(),
	endedAt: integer("ended_at", { mode: "timestamp_ms" }),
	durationMinutes: integer("duration_minutes"),

	createdAt: integer("created_at", { mode: "timestamp_ms" })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp_ms" })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.$onUpdate(() => new Date())
		.notNull()
});

export const sessionParticipantsTable = sqliteTable("session_participants", {
	id: text("id")
		.primaryKey()
		.notNull()
		.unique()
		.$defaultFn(() => randomUUID()),

	studySessionID: text("study_session_id")
		.notNull()
		.references(() => studySessionsTable.id, { onDelete: "cascade" }),
	userID: text("user_id")
		.notNull()
		.references(() => usersTable.id),

	// SS: Session Secretary -> Creator of the session (Max: 1)
	// SR: Session Representative -> Management power over session, under admin (Max: 5)
	// SM: Session Members -> Participants of the session (Max: 14)
	role: text("role", { enum: ["ss", "sr", "sm"] })
		.notNull()
		.default("sm"),
	status: text("status", { enum: ["approved", "kicked"] }).notNull(),

	joinedAt: integer("joined_at", { mode: "timestamp_ms" })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.notNull(),

	leftAt: integer("left_at", { mode: "timestamp_ms" }),

	createdAt: integer("created_at", { mode: "timestamp_ms" })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp_ms" })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.$onUpdate(() => new Date())
		.notNull()
});

export const sessionVideosTable = sqliteTable("session_videos", {
	id: text("id")
		.primaryKey()
		.notNull()
		.unique()
		.$defaultFn(() => randomUUID()),

	studySessionID: text("study_session_id")
		.references(() => studySessionsTable.id)
		.notNull(),
	youtubeURL: text("youtube_url").notNull(),

	addedBy: text("added_by")
		.references(() => usersTable.id)
		.notNull(),
	addedAt: integer("added_at", { mode: "timestamp_ms" })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.notNull(),
	removedAt: integer("removed_at", { mode: "timestamp_ms" }),

	createdAt: integer("created_at", { mode: "timestamp_ms" })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp_ms" })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.$onUpdate(() => new Date())
		.notNull()
});

export type SP = typeof sessionParticipantsTable.$inferSelect;
