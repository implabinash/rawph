import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { randomUUID } from "crypto";
import { sql } from "drizzle-orm";

import { ADMIN_UUID } from "$lib/utils/constants";

export const inviteCodesTable = sqliteTable("invite_codes", {
	id: text("id")
		.primaryKey()
		.notNull()
		.unique()
		.$defaultFn(() => randomUUID()),

	code: text("code").notNull().unique(),
	createdBy: text("created_by").default(ADMIN_UUID),

	isUsed: integer("is_used", { mode: "boolean" }).default(false).notNull(),
	usedBy: text("used_by"),
	usedAt: integer("used_at", { mode: "timestamp_ms" }),

	createdAt: integer("created_at", { mode: "timestamp_ms" })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp_ms" })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull()
});
