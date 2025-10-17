import { z } from "zod/v4";

import { fail, redirect, type Actions } from "@sveltejs/kit";

import { signInSchema } from "$lib/validations/auth";
import { authClient } from "$lib/auth-client";

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

		const { data, error } = await authClient.signIn.email({
			email: result.data.email,
			password: result.data.password,
			callbackURL: "/dashboard"
		});

		if (error) {
			console.error("Better Auth sign in error:", error);

			if (error.status === 401) {
				return fail(401, {
					success: false,
					data: {
						email: result.data.email
					},
					error: {},
					message: "Invalid email or password."
				});
			}

			return fail(error.status || 400, {
				success: false,
				data: {
					email: result.data.email
				},
				error: {},
				message: error.message || "Sign in failed. Please try again."
			});
		}

		return redirect(303, "/dashboard");
	}
} satisfies Actions;
