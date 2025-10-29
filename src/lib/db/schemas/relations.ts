import { relations } from "drizzle-orm";

import { authSessionsTable, oAuthAccountsTable } from "./auth.schema";
import { usersTable } from "./user.schema";
import {
	sessionParticipantsTable,
	sessionVideosTable,
	studySessionJoinRequestTable,
	studySessionsTable
} from "./studysession.schema";

export const userRelations = relations(usersTable, ({ many }) => ({
	authSessions: many(authSessionsTable),
	oAuthSessions: many(oAuthAccountsTable),
	createdStudySessions: many(studySessionsTable),
	sessionParticipations: many(sessionParticipantsTable),
	addedVideos: many(sessionVideosTable)
}));

export const authRelations = relations(authSessionsTable, ({ one }) => ({
	user: one(usersTable, {
		fields: [authSessionsTable.userID],
		references: [usersTable.id]
	})
}));

export const oAuthRelations = relations(oAuthAccountsTable, ({ one }) => ({
	user: one(usersTable, {
		fields: [oAuthAccountsTable.userID],
		references: [usersTable.id]
	})
}));

export const studySessionRelations = relations(studySessionsTable, ({ one, many }) => ({
	creator: one(usersTable, {
		fields: [studySessionsTable.createdBy],
		references: [usersTable.id]
	}),
	participants: many(sessionParticipantsTable),
	joinRequests: many(studySessionJoinRequestTable),
	videos: many(sessionVideosTable)
}));

export const sessionParticipantsRelations = relations(sessionParticipantsTable, ({ one }) => ({
	studySession: one(studySessionsTable, {
		fields: [sessionParticipantsTable.studySessionID],
		references: [studySessionsTable.id]
	}),
	user: one(usersTable, {
		fields: [sessionParticipantsTable.userID],
		references: [usersTable.id]
	})
}));

export const joinRequestRelations = relations(studySessionJoinRequestTable, ({ one }) => ({
	studySession: one(studySessionsTable, {
		fields: [studySessionJoinRequestTable.studySessionID],
		references: [studySessionsTable.id]
	}),
	requestBy: one(usersTable, {
		fields: [studySessionJoinRequestTable.requestedBy],
		references: [usersTable.id]
	}),
	respondedBy: one(usersTable, {
		fields: [studySessionJoinRequestTable.respondedBy],
		references: [usersTable.id]
	})
}));

export const sessionVideosRelations = relations(sessionVideosTable, ({ one }) => ({
	studySession: one(studySessionsTable, {
		fields: [sessionVideosTable.studySessionID],
		references: [studySessionsTable.id]
	}),
	addedBy: one(usersTable, {
		fields: [sessionVideosTable.addedBy],
		references: [usersTable.id]
	})
}));
