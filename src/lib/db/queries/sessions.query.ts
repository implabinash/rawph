import { eq } from "drizzle-orm";

import { usersTable } from "$lib/db/schemas/user.schema";
import type { DrizzleClient } from "$lib/db/index";
import { authSessionsTable } from "../schemas/auth.schema";

export const findSessionData = async (db: DrizzleClient, sessionToken: string) => {
	const user = await db
		.select()
		.from(authSessionsTable)
		.leftJoin(usersTable, eq(usersTable.id, authSessionsTable.userId))
		.where(eq(authSessionsTable.token, sessionToken))
		.limit(1);

	return user[0];
};
