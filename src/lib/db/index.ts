import { drizzle } from "drizzle-orm/d1";

import { authSessionsTable, oAuthAccountsTable } from "./schemas/auth.schema";
import { inviteCodesTable } from "./schemas/invite.schema";
import { usersTable } from "./schemas/user.schema";
import {
	sessionParticipantsTable,
	sessionVideosTable,
	studySessionJoinRequestTable,
	studySessionsTable
} from "./schemas/studysession.schema";
import {
	authRelations,
	joinRequestRelations,
	oAuthRelations,
	sessionParticipantsRelations,
	sessionVideosRelations,
	studySessionRelations,
	userRelations
} from "./schemas/relations";

export const getDB = (db: D1Database) => {
	return drizzle(db, {
		schema: {
			usersTable,

			authSessionsTable,
			oAuthAccountsTable,
			inviteCodesTable,

			studySessionsTable,
			sessionParticipantsTable,
			studySessionJoinRequestTable,
			sessionVideosTable,

			userRelations,
			authRelations,
			oAuthRelations,
			studySessionRelations,
			sessionParticipantsRelations,
			joinRequestRelations,
			sessionVideosRelations
		}
	});
};

export type DrizzleClient = ReturnType<typeof getDB>;
