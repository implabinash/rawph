import { z } from "zod/v4";
import { fail, redirect, type Actions } from "@sveltejs/kit";
import { signUpSchema } from "$lib/validations/auth";

export const actions = {
	manual: async ({ request }) => {
		const formData = Object.fromEntries(await request.formData());
		const result = signUpSchema.safeParse(formData);

		if (!result.success) {
			return fail(400, {
				success: false,
				data: {
					email: formData.email as string,
					name: formData.name as string
				},
				errors: z.flattenError(result.error).fieldErrors,
				message: "Validation failed"
			});
		}

		redirect(303, "/dashboard");
	}
} satisfies Actions;
