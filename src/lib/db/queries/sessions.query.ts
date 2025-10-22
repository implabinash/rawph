import { eq } from "drizzle-orm";

import { sessionsTable } from "$lib/db/schemas/auth.schema";
import { usersTable } from "$lib/db/schemas/user.schema";
import type { DrizzleClient } from "$lib/db/index";

export const getSessionData = async (db: DrizzleClient, sessionToken: string) => {
	const user = await db
		.select()
		.from(sessionsTable)
		.leftJoin(usersTable, eq(usersTable.id, sessionsTable.userId))
		.where(eq(sessionsTable.token, sessionToken))
		.limit(1);

	return user[0];
};
