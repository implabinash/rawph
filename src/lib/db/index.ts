import { drizzle } from "drizzle-orm/d1";

import { sessionsTable } from "$lib/db/schemas/auth.schema";
import { usersTable } from "$lib/db/schemas/user.schema";

export const getDB = (db: D1Database) => {
	return drizzle(db, {
		schema: {
			usersTable,
			sessionsTable
		}
	});
};

export type DrizzleClient = ReturnType<typeof getDB>;
