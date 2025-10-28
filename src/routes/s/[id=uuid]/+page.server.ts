import { eq } from "drizzle-orm";
import { z } from "zod/v4";

import type { Actions, PageServerLoad } from "./$types";
import { error, fail, redirect } from "@sveltejs/kit";

import { youtubeUrlSchema } from "$lib/validations/video";
import { calculateTimeDiffInMin } from "$lib/utils/time";
import {
	findAllSPsBySessionId,
	findParticipantsById,
	findSessionVideoByUrl,
	findStudySessionById
} from "$lib/db/queries/studysessions.query";
import {
	sessionParticipantsTable,
	sessionVideosTable,
	studySessionsTable
} from "$lib/db/schemas/studysession.schema";
import { findUserById } from "$lib/db/queries/users.query";
import { pendingParticipantSchema } from "$lib/validations/websocket";

export const actions = {
	addVideo: async ({ request, locals, url }) => {
		const formData = Object.fromEntries(await request.formData());

		const result = youtubeUrlSchema.safeParse(formData);

		if (!result.success) {
			return {
				error: z.flattenError(result.error).fieldErrors,
				videoCode: null
			};
		}

		const videoURL = result.data.videoURL;
		let videoCode = "";

		if (videoURL.includes("watch?v=")) {
			const params = new URLSearchParams(new URL(videoURL).search);
			videoCode = params.get("v") || "";
		} else if (videoURL.includes("youtu.be/")) {
			videoCode = videoURL.split("youtu.be/")[1]?.split("?")[0] || "";
		} else if (videoURL.includes("/embed/")) {
			videoCode = videoURL.split("/embed/")[1]?.split("?")[0] || "";
		} else if (videoURL.includes("/shorts/")) {
			videoCode = videoURL.split("/shorts/")[1]?.split("?")[0] || "";
		} else {
			videoCode = videoURL.split("/").at(-1)?.split("?")[0] || "";
		}

		try {
			const studySessionId = url.pathname.split("/")[2];

			const video = await findSessionVideoByUrl(locals.db, studySessionId, result.data.videoURL);

			if (!video) {
				await locals.db.insert(sessionVideosTable).values({
					studySessionId: studySessionId,
					addedBy: locals.user.id,
					youtubeUrl: result.data.videoURL
				});
			}
		} catch (err) {
			console.error("Video add error: ", err);
			return fail(500, {
				message: "Something went wrong. Try again."
			});
		}

		return { videoCode };
	},

	changeVideo: () => {
		return { change: true };
	},

	leave: async ({ url, locals }) => {
		const studySessionId = url.pathname.split("/")[2];

		try {
			const studySession = await findStudySessionById(locals.db, studySessionId);

			const duration = calculateTimeDiffInMin(studySession!.startedAt, new Date());

			await locals.db
				.update(studySessionsTable)
				.set({
					status: "completed",
					endedAt: new Date(),
					durationMinutes: duration
				})
				.where(eq(studySessionsTable.id, studySessionId));
		} catch (err) {
			console.log("Leave error: ", err);

			return fail(500, {
				message: "Failed. Try again."
			});
		}

		throw redirect(303, "/dashboard");
	},

	request: async ({ locals, url }) => {
		const sessionId = url.pathname.split("/")[2];

		const session = await findStudySessionById(locals.db, sessionId);
		const sp = await findParticipantsById(locals.db, session!.id, locals.user.id);

		if (!session) {
			return fail(404, { message: "session not found" });
		}

		if (session.status === "completed") {
			return fail(404, { message: "session completed" });
		}

		if (sp && sp.status === "kicked") {
			return fail(404, { message: "not allowed" });
		}

		return { success: true };
	},

	cancel: () => {
		return { success: true };
	},

	accept: async ({ request }) => {
		const formData = Object.fromEntries(await request.formData());
		const result = pendingParticipantSchema.safeParse(formData);

		if (!result.success) {
			return fail(401, { message: "invalid id" });
		}
	},

	reject: () => {
		console.log("reject");
	}
} satisfies Actions;

export const load: PageServerLoad = async ({ locals, url }) => {
	if (!locals.user) {
		throw redirect(307, "/signin");
	}

	if (!locals.user.isInvited) {
		throw redirect(307, "/invite");
	}

	const studySessionId = url.pathname.split("/")[2];

	const studySession = await findStudySessionById(locals.db, studySessionId);
	const ss = await findUserById(locals.db, studySession!.createdBy);

	if (!studySession) {
		return error(404, { message: "Study session not found." });
	}

	if (studySession.status === "completed") {
		return error(404, { message: "Study session already finished" });
	}

	let isApproved = false;

	const existingParticipant = await findParticipantsById(
		locals.db,
		studySession.id,
		locals.user.id
	);

	if (existingParticipant) {
		isApproved = existingParticipant.status === "approved";
	}

	if (!existingParticipant && studySession.createdBy === locals.user.id) {
		try {
			await locals.db.insert(sessionParticipantsTable).values({
				studySessionId: studySession.id,
				userId: locals.user.id,
				status: "approved",
				role: "ss"
			});

			isApproved = true;
		} catch (err) {
			console.error("Study Session joining error: ", err);
			return error(500, { message: "Something went wrong. Try again!" });
		}
	}

	const sp = await findParticipantsById(locals.db, studySession!.id, locals.user.id);
	const sps = await findAllSPsBySessionId(locals.db, studySession!.id);

	return { user: locals.user, ss, sps, sp, isApproved };
};
