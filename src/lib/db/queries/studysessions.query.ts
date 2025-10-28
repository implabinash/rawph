import { and, eq } from "drizzle-orm";

import {
	sessionParticipantsTable,
	sessionVideosTable,
	studySessionsTable
} from "$lib/db/schemas/studysession.schema";
import type { DrizzleClient } from "$lib/db/index";

export const findStudySessionById = async (db: DrizzleClient, studySessionId: string) => {
	const studySession = await db.query.studySessionsTable.findFirst({
		where: eq(studySessionsTable.id, studySessionId)
	});

	return studySession;
};

export const findParticipantsById = async (
	db: DrizzleClient,
	studySessionId: string,
	participantsId: string
) => {
	const participant = await db.query.sessionParticipantsTable.findFirst({
		where: and(
			eq(sessionParticipantsTable.userId, participantsId),
			eq(sessionParticipantsTable.studySessionId, studySessionId)
		)
	});

	return participant;
};

export const findSessionVideoByUrl = async (
	db: DrizzleClient,
	studySessionId: string,
	videoUrl: string
) => {
	const video = await db.query.sessionVideosTable.findFirst({
		where: and(
			eq(sessionVideosTable.studySessionId, studySessionId),
			eq(sessionVideosTable.youtubeUrl, videoUrl)
		)
	});

	return video;
};

export const findAllSPsBySessionId = async (db: DrizzleClient, studySessionID: string) => {
	const sps = await db.query.sessionParticipantsTable.findMany({
		where: eq(sessionParticipantsTable.studySessionId, studySessionID)
	});

	return sps;
};
