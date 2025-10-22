import { eq } from "drizzle-orm";

import { usersTable } from "$lib/db/schemas/user.schema";
import { getDB } from "$lib/db/index";

export const findAllUsers = async (db: D1Database) => {
	const users = await getDB(db).query.usersTable.findMany();
	return users;
};

export const findUserByEmail = async (db: D1Database, email: string) => {
	const user = await getDB(db).query.usersTable.findFirst({
		where: eq(usersTable.email, email)
	});

	return user;
};
