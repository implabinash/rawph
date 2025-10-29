import { eq } from "drizzle-orm";
import { z } from "zod/v4";

import type { Actions, PageServerLoad } from "./$types";
import { error, fail, redirect } from "@sveltejs/kit";

import { pendingParticipantSchema } from "$lib/validations/websocket";
import { youtubeURLSchema } from "$lib/validations/video";
import { calculateTimeDiffInMin } from "$lib/utils/time";
import {
	findAllJoinRequestByStudySessionID,
	findAllSPsBySessionID,
	findSPByID,
	findSessionVideoByURL,
	findStudySessionByID
} from "$lib/db/queries/studysessions.query";
import {
	sessionParticipantsTable,
	sessionVideosTable,
	studySessionJoinRequestTable,
	studySessionsTable
} from "$lib/db/schemas/studysession.schema";

export const actions = {
	addVideo: async ({ request, locals, url }) => {
		const formData = Object.fromEntries(await request.formData());

		const result = youtubeURLSchema.safeParse(formData);

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
			const studySessionID = url.pathname.split("/")[2];

			const video = await findSessionVideoByURL(locals.db, studySessionID, result.data.videoURL);

			if (!video) {
				await locals.db.insert(sessionVideosTable).values({
					studySessionID: studySessionID,
					addedBy: locals.user.id,
					youtubeURL: result.data.videoURL
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
		const studySessionID = url.pathname.split("/")[2];

		try {
			const studySession = await findStudySessionByID(locals.db, studySessionID);

			const duration = calculateTimeDiffInMin(studySession!.startedAt, new Date());

			await locals.db
				.update(studySessionsTable)
				.set({
					status: "completed",
					endedAt: new Date(),
					durationMinutes: duration
				})
				.where(eq(studySessionsTable.id, studySessionID));
		} catch (err) {
			console.log("Leave error: ", err);

			return fail(500, {
				message: "Failed. Try again."
			});
		}

		throw redirect(303, "/dashboard");
	},

	request: async ({ locals, url }) => {
		const studySessionID = url.pathname.split("/")[2];

		const studySession = await findStudySessionByID(locals.db, studySessionID);
		const currentSP = await findSPByID(locals.db, studySession!.id, locals.user.id);

		if (!studySession) {
			return fail(404, { message: "session not found" });
		}

		if (studySession.status === "completed") {
			return fail(404, { message: "session completed" });
		}

		if (currentSP && currentSP.status === "kicked") {
			return fail(404, { message: "not allowed" });
		}

		try {
			await locals.db.insert(studySessionJoinRequestTable).values({
				studySessionID,
				requestedBy: locals.user.id
			});
		} catch (err) {
			console.error("Session request failed.", err);

			return fail(500, { message: "failed" });
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

	const studySessionID = url.pathname.split("/")[2];

	const studySession = await findStudySessionByID(locals.db, studySessionID);

	if (!studySession) {
		return error(404, { message: "Study session not found." });
	}

	if (studySession.status === "completed") {
		return error(404, { message: "Study session already finished" });
	}

	let allSPs = await findAllSPsBySessionID(locals.db, studySession.id);

	const ss = allSPs.find((sp) => sp.role === "ss");
	const currentSP = allSPs.find((sp) => sp.userID === locals.user.id);

	let isApproved = false;

	if (currentSP) {
		isApproved = currentSP.status === "approved";
	}

	if (!currentSP && currentSP === ss) {
		try {
			await locals.db.insert(sessionParticipantsTable).values({
				studySessionID: studySession.id,
				userID: locals.user.id,
				status: "approved",
				role: "ss"
			});

			isApproved = true;
		} catch (err) {
			console.error("Study Session joining error: ", err);
			return error(500, { message: "Something went wrong. Try again!" });
		}
	}

	allSPs = await findAllSPsBySessionID(locals.db, studySession.id);
	const allJoinRequests = await findAllJoinRequestByStudySessionID(locals.db, studySessionID);

	return { user: locals.user, ss, allSPs, currentSP, allJoinRequests, isApproved };
};
