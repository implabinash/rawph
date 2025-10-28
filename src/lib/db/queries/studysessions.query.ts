import { and, eq } from "drizzle-orm";

import {
	sessionParticipantsTable,
	sessionVideosTable,
	studySessionsTable
} from "$lib/db/schemas/studysession.schema";
import type { DrizzleClient } from "$lib/db/index";

export const findStudySessionByID = async (db: DrizzleClient, studySessionID: string) => {
	const studySession = await db.query.studySessionsTable.findFirst({
		where: eq(studySessionsTable.id, studySessionID),
		columns: {
			id: true,
			createdBy: true,
			status: true,
			startedAt: true
		}
	});

	return studySession;
};

export const findParticipantByID = async (
	db: DrizzleClient,
	studySessionID: string,
	participantsId: string
) => {
	const participant = await db.query.sessionParticipantsTable.findFirst({
		where: and(
			eq(sessionParticipantsTable.userID, participantsId),
			eq(sessionParticipantsTable.studySessionID, studySessionID)
		),
		columns: {
			id: true,
			status: true,
			role: true
		}
	});

	return participant;
};

export const findSessionVideoByURL = async (
	db: DrizzleClient,
	studySessionID: string,
	videoURL: string
) => {
	const video = await db.query.sessionVideosTable.findFirst({
		where: and(
			eq(sessionVideosTable.studySessionID, studySessionID),
			eq(sessionVideosTable.youtubeURL, videoURL)
		)
	});

	return video;
};

export const findAllSPsBySessionID = async (db: DrizzleClient, studySessionID: string) => {
	const sps = await db.query.sessionParticipantsTable.findMany({
		where: eq(sessionParticipantsTable.studySessionID, studySessionID)
	});

	return sps;
};
