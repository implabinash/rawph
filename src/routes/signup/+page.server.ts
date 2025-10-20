import { z } from "zod/v4";

import { fail, redirect, type Actions } from "@sveltejs/kit";
import { BASE_URL } from "$env/static/private";

import { signUpSchema } from "$lib/validations/auth";

export const actions = {
	manual: async ({ request, fetch, cookies }) => {
		const formData = Object.fromEntries(await request.formData());
		const result = signUpSchema.safeParse(formData);

		if (!result.success) {
			return fail(400, {
				success: false,
				data: {
					email: formData.email as string,
					name: formData.name as string
				},
				error: z.flattenError(result.error).fieldErrors,
				message: "Invalid inputs."
			});
		}

		const res = await fetch(`${BASE_URL}/auth/signup/email`, {
			method: "POST",
			credentials: "include",
			body: JSON.stringify(result.data)
		});

		console.log(res);

		const data = await res.json();

		if (!data.success) {
			if (res.status === 400) {
				return fail(400, {
					success: false,
					data: {
						email: result.data.email,
						name: result.data.name
					},
					error: data.error,
					message: data.message
				});
			}

			if (res.status === 409) {
				return fail(409, {
					success: false,
					data: {
						email: result.data.email,
						name: result.data.name
					},
					error: data.error,
					message: data.message
				});
			}

			if (res.status === 500) {
				return fail(500, {
					success: false,
					data: {
						email: result.data.email,
						name: result.data.name
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
				maxAge: 30 * 24 * 60 * 60
			});
		}

		redirect(303, "/dashboard");
	}
} satisfies Actions;
