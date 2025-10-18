import { z } from "zod/v4";

import { fail, redirect, type Actions } from "@sveltejs/kit";

import { signUpSchema } from "$lib/validations/auth";
import { BASE_URL } from "$env/static/private";

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
				message: "Validation failed"
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
			// Parse the cookie
			const cookieParts = setCookieHeader.split(";").map((part) => part.trim());
			const [cookieNameValue] = cookieParts;
			const [name, value] = cookieNameValue.split("=");

			// Extract cookie attributes
			const maxAge = cookieParts.find((p) => p.toLowerCase().startsWith("max-age="))?.split("=")[1];
			const path = cookieParts.find((p) => p.toLowerCase().startsWith("path="))?.split("=")[1];
			const secure = cookieParts.some((p) => p.toLowerCase() === "secure");
			const httpOnly = cookieParts.some((p) => p.toLowerCase() === "httponly");
			const sameSite = cookieParts
				.find((p) => p.toLowerCase().startsWith("samesite="))
				?.split("=")[1];

			// Set cookie in SvelteKit
			cookies.set(name, value, {
				path: path || "/",
				maxAge: maxAge ? parseInt(maxAge) : 7 * 24 * 60 * 60,
				httpOnly: httpOnly,
				secure: secure,
				sameSite: (sameSite?.toLowerCase() as "strict" | "lax" | "none") || "lax"
			});
		}

		redirect(303, "/dashboard");
	}
} satisfies Actions;
