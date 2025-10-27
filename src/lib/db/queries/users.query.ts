import { eq } from "drizzle-orm";

import { usersTable } from "$lib/db/schemas/user.schema";
import type { DrizzleClient } from "$lib/db/index";

export const findAllUsers = async (db: DrizzleClient) => {
	const users = await db.query.usersTable.findMany();
	return users;
};

export const findUserByEmail = async (db: DrizzleClient, email: string) => {
	const user = await db.query.usersTable.findFirst({
		where: eq(usersTable.email, email)
	});

	return user;
};

export const findUserById = async (db: DrizzleClient, userId: string) => {
	const user = await db.query.usersTable.findFirst({
		where: eq(usersTable.id, userId)
	});

	return user;
};
