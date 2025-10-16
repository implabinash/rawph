import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { randomUUID } from "crypto";

export const actions = {
	create: async () => {
		const roomID = randomUUID();

		return redirect(301, `/${roomID}`);
	},

	join: async ({ request }) => {
		const formData = Object.fromEntries(await request.formData());
		const roomID = formData.videoURL.toString().split("/").at(-1);
		return redirect(301, `/${roomID}`);
	}
} satisfies Actions;

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(301, "/signin");
	}
};
