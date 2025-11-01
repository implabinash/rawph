import type { RequestHandler } from "./$types";
import { json } from "@sveltejs/kit";

import { findAllJoinRequestByStudySessionID } from "$lib/db/queries/studysessions.query";

export const GET: RequestHandler = async ({ locals, params }) => {
	const studySessionID = params.id;

	const allJoinRequests = await findAllJoinRequestByStudySessionID(locals.db, studySessionID);

	return json(allJoinRequests);
};
