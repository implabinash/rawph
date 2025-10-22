import { drizzle } from "drizzle-orm/d1";

import { inviteCodesTable } from "./schemas/invite.schema";
import { sessionsTable } from "./schemas/auth.schema";
import { usersTable } from "./schemas/user.schema";

export const getDB = (db: D1Database) => {
	return drizzle(db, {
		schema: {
			usersTable,
			sessionsTable,
			inviteCodesTable
		}
	});
};

export type DrizzleClient = ReturnType<typeof getDB>;
