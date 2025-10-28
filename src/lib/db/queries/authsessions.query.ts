import { eq } from "drizzle-orm";

import { authSessionsTable } from "$lib/db/schemas/auth.schema";
import type { DrizzleClient } from "$lib/db/index";

export const findAuthSessionData = async (db: DrizzleClient, sessionToken: string) => {
	const user = await db.query.authSessionsTable.findFirst({
		where: eq(authSessionsTable.token, sessionToken),
		with: {
			user: true
		}
	});

	return user;
};
