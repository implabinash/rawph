import { z } from "zod/v4";

import type { PageServerLoad } from "./$types";
import { fail, redirect, type Actions } from "@sveltejs/kit";
import { inviteCodeSchema } from "$lib/validations/auth";

export const actions = {
	default: async ({ request }) => {
		const formData = Object.fromEntries(await request.formData());
		const result = inviteCodeSchema.safeParse(formData);

		if (!result.success) {
			return fail(400, {
				success: false,
				data: {},
				error: z.flattenError(result.error).fieldErrors,
				message: "Invalid code."
			});
		}

		console.log(result);
	}
} satisfies Actions;

export const load: PageServerLoad = async ({ locals }) => {
	// if (!locals.user) {
	// 	throw redirect(307, "/signin");
	// }
};
