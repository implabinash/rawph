import { z } from "zod/v4";

import type { Actions } from "@sveltejs/kit";

import { signUpSchema } from "$lib/validations/auth";

export const actions = {
	manual: async ({ request }) => {
		const formData = Object.fromEntries(await request.formData());
		const result = signUpSchema.safeParse(formData);

		console.log(result);

		if (!result.success) {
			return {
				success: false,
				data: { email: formData.email, name: formData.name },
				error: z.flattenError(result.error)
			};
		}
	}
} satisfies Actions;
