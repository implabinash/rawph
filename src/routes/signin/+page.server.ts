import { z } from "zod/v4";

import type { Actions } from "@sveltejs/kit";

import { signInSchema } from "$lib/validations/auth";

export const actions = {
	manual: async ({ request }) => {
		const formData = Object.fromEntries(await request.formData());
		const result = signInSchema.safeParse(formData);

		console.log(result);

		if (!result.success) {
			return { success: false, data: formData.email, error: z.flattenError(result.error) };
		}
	}
} satisfies Actions;
