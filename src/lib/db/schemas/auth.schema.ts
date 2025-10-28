import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { randomUUID } from "crypto";
import { sql } from "drizzle-orm";

import { usersTable } from "./user.schema";

export const authSessionsTable = sqliteTable("auth_sessions", {
	id: text("id")
		.primaryKey()
		.notNull()
		.unique()
		.$defaultFn(() => randomUUID()),

	token: text("token").notNull().unique(),
	userID: text("user_id")
		.notNull()
		.references(() => usersTable.id, { onDelete: "cascade" }),

	expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),

	createdAt: integer("created_at", { mode: "timestamp_ms" })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp_ms" })
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull()
});

export const oAuthAccountsTable = sqliteTable("oauth_accounts", {
	id: text("id")
		.primaryKey()
		.notNull()
		.unique()
		.$defaultFn(() => randomUUID()),

	userID: text("user_id")
		.notNull()
		.references(() => usersTable.id, { onDelete: "cascade" }),

	provider: text("provider", { enum: ["google", "apple"] }).notNull(),
	providerUserID: text("provider_user_id").notNull(),

	createdAt: integer("created_at", { mode: "timestamp_ms" })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp_ms" })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.$onUpdate(() => new Date())
		.notNull()
});
