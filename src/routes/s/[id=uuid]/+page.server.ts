import { findParticipantsById, findStudySessionById } from "$lib/db/queries/studysessions.query";
import { sessionParticipantsTable, studySessionsTable } from "$lib/db/schemas/studysession.schema";
import { eq } from "drizzle-orm";
import type { Actions, PageServerLoad } from "./$types";
import { error, fail, redirect } from "@sveltejs/kit";
import { calculateTimeDiffInMin } from "$lib/utils/time";

export const actions = {
	youtube: async ({ request }) => {
		const formData = Object.fromEntries(await request.formData());
		let videoCode = "";

		// Check for valid youtube video or not

		if (formData.videoURL.toString().includes("watch?v=")) {
			videoCode = formData.videoURL.toString().split("watch?v=").at(-1) || "";
		} else {
			videoCode = formData.videoURL.toString().split("/").at(-1) || "";
		}

		// if videoCode is empty return an error

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

	accept: () => {
		console.log("accept");
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
				status: "approved",
				studySessionId: studySession.id,
				userId: locals.user.id,
				role: "creator"
			});

			isApproved = true;
		} catch (err) {
			console.error("Study Session joining error: ", err);
			return error(500, { message: "Something went wrong. Try again!" });
		}
	}

	return { user: locals.user, isApproved };
};
