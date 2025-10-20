import { z } from "zod/v4";

import { fail, redirect, type Actions } from "@sveltejs/kit";
import { BASE_URL } from "$env/static/private";

import { signInSchema } from "$lib/validations/auth";

export const actions = {
	manual: async ({ request, cookies }) => {
		const formData = Object.fromEntries(await request.formData());
		const result = signInSchema.safeParse(formData);

		if (!result.success) {
			return fail(400, {
				success: false,
				data: { email: formData.email },
				error: z.flattenError(result.error).fieldErrors,
				message: "Invalid inputs."
			});
		}

		const res = await fetch(`${BASE_URL}/auth/signin/email`, {
			method: "POST",
			credentials: "include",
			body: JSON.stringify(result.data)
		});

		const data = await res.json();

		if (!data.success) {
			if (res.status === 400) {
				return fail(400, {
					success: false,
					data: {
						email: result.data.email
					},
					error: data.error,
					message: data.message
				});
			}

			if (res.status === 401) {
				return fail(401, {
					success: false,
					data: {
						email: result.data.email
					},
					error: data.error,
					message: data.message
				});
			}

			if (res.status === 500) {
				return fail(500, {
					success: false,
					data: {
						email: result.data.email
					},
					error: data.error,
					message: data.message
				});
			}
		}

		const setCookieHeader = res.headers.get("set-cookie");

		if (setCookieHeader) {
			const [name, token] = setCookieHeader.split(";")[0].split("=");

			cookies.set(name, token, {
				path: "/",
				secure: true,
				httpOnly: true,
				sameSite: "none",
				maxAge: 7 * 24 * 60 * 60
			});
		}

		return redirect(303, "/dashboard");
	}
} satisfies Actions;
