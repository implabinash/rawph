import type { Handle } from "@sveltejs/kit";

import { getDB } from "$lib/db";

export const handle: Handle = async ({ event, resolve }) => {
	if (event.platform?.env.DB) {
		event.locals.db = getDB(event.platform.env.DB);
	}

	const response = await resolve(event);
	return response;
};
