import { and, eq } from "drizzle-orm";

import type { DrizzleClient } from "$lib/db/index";
import {
	sessionParticipantsTable,
	sessionVideosTable,
	studySessionJoinRequestTable,
	studySessionsTable
} from "$lib/db/schemas/studysession.schema";

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

export const findSPByID = async (
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
			role: true,
			status: true,
			userID: true,
			studySessionID: true
		},
		with: {
			user: {
				columns: {
					id: true,
					name: true,
					image: true
				}
			}
		}
	});

	return participant;
};

export const findAllSPsBySessionID = async (db: DrizzleClient, studySessionID: string) => {
	const sps = await db.query.sessionParticipantsTable.findMany({
		where: eq(sessionParticipantsTable.studySessionID, studySessionID),
		columns: {
			id: true,
			role: true,
			status: true,
			userID: true,
			studySessionID: true
		},
		with: {
			user: {
				columns: {
					id: true,
					name: true,
					image: true
				}
			}
		}
	});

	return sps;
};

export const findAllJoinRequestByStudySessionID = async (
	db: DrizzleClient,
	studySessionID: string
) => {
	const allJoinRequests = await db.query.studySessionJoinRequestTable.findMany({
		where: eq(studySessionJoinRequestTable.studySessionID, studySessionID),
		columns: {
			id: true,
			status: true,
			requestedBy: true,
			studySessionID: true
		},
		with: {
			requestBy: {
				columns: {
					id: true,
					name: true,
					image: true
				}
			}
		}
	});

	return allJoinRequests;
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

export type SP = NonNullable<Awaited<ReturnType<typeof findSPByID>>>;
export type JoinRequests = Awaited<ReturnType<typeof findAllJoinRequestByStudySessionID>>;
