import { drizzle } from "drizzle-orm/d1";

import { inviteCodesTable } from "./schemas/invite.schema";
import { authSessionsTable, oauthAccountsTable } from "./schemas/auth.schema";
import { usersTable } from "./schemas/user.schema";

export const getDB = (db: D1Database) => {
	return drizzle(db, {
		schema: {
			usersTable,
			authSessionsTable,
			inviteCodesTable,
			oauthAccountsTable
		}
	});
};

export type DrizzleClient = ReturnType<typeof getDB>;
