import { eq } from "drizzle-orm";

import { studySessionsTable } from "$lib/db/schemas/studysession.schema";
import type { DrizzleClient } from "$lib/db/index";

export const findStudySessionById = async (db: DrizzleClient, studySessionId: string) => {
	const studySession = await db.query.studySessionsTable.findFirst({
		where: eq(studySessionsTable.id, studySessionId)
	});

	return studySession;
};
