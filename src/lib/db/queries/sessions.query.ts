import { eq } from "drizzle-orm";
import { sessionsTable } from "../schemas/auth.schema";
import { usersTable } from "../schemas/user.schema";
import { getDB } from "..";

export const getSessionData = async (db: D1Database, sessionToken: string) => {
	const user = await getDB(db)
		.select()
		.from(sessionsTable)
		.leftJoin(usersTable, eq(usersTable.id, sessionsTable.userId))
		.where(eq(sessionsTable.token, sessionToken))
		.limit(1);

	return user[0];
};
