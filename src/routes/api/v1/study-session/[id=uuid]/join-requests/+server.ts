import { findAllJoinRequestByStudySessionID } from "$lib/db/queries/studysessions.query";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ locals, params }) => {
	const studySessionID = params.id;

	const allJoinRequests = await findAllJoinRequestByStudySessionID(locals.db, studySessionID);

	return json(allJoinRequests);
};
