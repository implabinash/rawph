import { randomUUID } from "crypto";

import type { Actions, PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const actions = {
	create: async () => {
		const roomID = randomUUID();

		throw redirect(303, `/${roomID}`);
	},

	join: async ({ request }) => {
		const formData = Object.fromEntries(await request.formData());
		const roomID = formData.videoURL.toString().split("/").at(-1);
		throw redirect(303, `/${roomID}`);
	}
} satisfies Actions;

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user || !locals.user.isInvited) {
		throw redirect(307, "/signin");
	}

	return { user: locals.user };
};
