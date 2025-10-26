import { eq } from "drizzle-orm";

import { sessionParticipantsTable, studySessionsTable } from "$lib/db/schemas/studysession.schema";
import type { DrizzleClient } from "$lib/db/index";

export const findStudySessionById = async (db: DrizzleClient, studySessionId: string) => {
	const studySession = await db.query.studySessionsTable.findFirst({
		where: eq(studySessionsTable.id, studySessionId)
	});

	return studySession;
};

export const findParticipantsById = async (db: DrizzleClient, participantsId: string) => {
	const participant = await db.query.sessionParticipantsTable.findFirst({
		where: eq(sessionParticipantsTable.userId, participantsId)
	});

	return participant;
};
