import { eq } from "drizzle-orm";

import { sessionsTable } from "$lib/db/schemas/auth.schema";
import { usersTable } from "$lib/db/schemas/user.schema";
import { getDB } from "$lib/db/index";

export const getSessionData = async (db: D1Database, sessionToken: string) => {
	const user = await getDB(db)
		.select()
		.from(sessionsTable)
		.leftJoin(usersTable, eq(usersTable.id, sessionsTable.userId))
		.where(eq(sessionsTable.token, sessionToken))
		.limit(1);

	return user[0];
};
