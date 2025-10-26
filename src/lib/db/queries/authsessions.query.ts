import { eq } from "drizzle-orm";

import { authSessionsTable } from "$lib/db/schemas/auth.schema";
import { usersTable } from "$lib/db/schemas/user.schema";
import type { DrizzleClient } from "$lib/db/index";

export const findAuthSessionData = async (db: DrizzleClient, sessionToken: string) => {
	const user = await db
		.select()
		.from(authSessionsTable)
		.leftJoin(usersTable, eq(usersTable.id, authSessionsTable.userId))
		.where(eq(authSessionsTable.token, sessionToken))
		.limit(1);

	return user[0];
};
