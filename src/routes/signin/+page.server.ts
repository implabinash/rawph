import { z } from "zod/v4";

import { fail, redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

import { signInSchema } from "$lib/validations/auth";

export const actions = {
	manual: async ({ request, cookies, fetch }) => {
		const formData = Object.fromEntries(await request.formData());
		const result = signInSchema.safeParse(formData);

		if (!result.success) {
			return fail(400, {
				success: false,
				data: { email: formData.email },
				error: z.flattenError(result.error).fieldErrors,
				message: "Check your email and password."
			});
		}

		const res = await fetch("/api/v1/auth/signin/email", {
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
				sameSite: "lax",
				maxAge: 30 * 24 * 60 * 60
			});
		}

		throw redirect(303, "/dashboard");
	}
} satisfies Actions;

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		redirect(303, "/dashboard");
	}
};
