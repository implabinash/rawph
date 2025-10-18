import { z } from "zod/v4";

import { fail, redirect, type Actions } from "@sveltejs/kit";

import { signInSchema } from "$lib/validations/auth";

export const actions = {
	manual: async ({ request }) => {
		const formData = Object.fromEntries(await request.formData());
		const result = signInSchema.safeParse(formData);

		if (!result.success) {
			return fail(400, {
				success: false,
				data: { email: formData.email },
				error: z.flattenError(result.error).fieldErrors,
				message: ""
			});
		}

		return redirect(303, "/dashboard");
	}
} satisfies Actions;
