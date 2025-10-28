import { eq } from "drizzle-orm";

import { usersTable } from "$lib/db/schemas/user.schema";
import type { DrizzleClient } from "$lib/db/index";

export const findUserByEmail = async (db: DrizzleClient, email: string) => {
	const user = await db.query.usersTable.findFirst({
		where: eq(usersTable.email, email),
		columns: {
			id: true,
			password: true
		}
	});

	return user;
};

export const findUserByID = async (db: DrizzleClient, userID: string) => {
	const user = await db.query.usersTable.findFirst({
		where: eq(usersTable.id, userID)
	});

	return user;
};
