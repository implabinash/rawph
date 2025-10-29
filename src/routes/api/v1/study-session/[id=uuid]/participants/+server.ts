import type { RequestHandler } from "./$types";
import { json } from "@sveltejs/kit";

import { findAllSPsBySessionID } from "$lib/db/queries/studysessions.query";

export const GET: RequestHandler = async ({ params, locals }) => {
	const studySessionID = params.id;

	const allSPs = await findAllSPsBySessionID(locals.db, studySessionID);

	return json(allSPs, { status: 200 });
};
