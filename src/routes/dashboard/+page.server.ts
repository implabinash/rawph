import { randomUUID } from "crypto";

import type { Actions, PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

import { COOKIE_NAME } from "$lib/utils/constants";

export const actions = {
	create: async () => {
		const roomID = randomUUID();

		throw redirect(303, `/${roomID}`);
	},

	join: async ({ request }) => {
		const formData = Object.fromEntries(await request.formData());
		const roomID = formData.videoURL.toString().split("/").at(-1);
		throw redirect(303, `/${roomID}`);
	},

	logout: ({ cookies }) => {
		cookies.delete(COOKIE_NAME, { path: "/" });

		throw redirect(303, "/signin");
	}
} satisfies Actions;

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(307, "/signin");
	}

	if (!locals.user.isInvited) {
		throw redirect(307, "/invite");
	}

	return { user: locals.user };
};
