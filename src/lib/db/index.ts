import { drizzle } from "drizzle-orm/d1";

import { authSessionsTable, oauthAccountsTable } from "./schemas/auth.schema";
import { inviteCodesTable } from "./schemas/invite.schema";
import { usersTable } from "./schemas/user.schema";
import {
	sessionParticipantsTable,
	sessionVideosTable,
	studySessionsTable
} from "./schemas/studysession.schema";

export const getDB = (db: D1Database) => {
	return drizzle(db, {
		schema: {
			usersTable,

			authSessionsTable,
			oauthAccountsTable,
			inviteCodesTable,

			studySessionsTable,
			sessionParticipantsTable,
			sessionVideosTable
		}
	});
};

export type DrizzleClient = ReturnType<typeof getDB>;
