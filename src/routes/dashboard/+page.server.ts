import { randomUUID } from "crypto";

import type { Actions, PageServerLoad } from "./$types";
import { fail, redirect } from "@sveltejs/kit";

import { COOKIE_NAME } from "$lib/utils/constants";
import { changePasswordSchema } from "$lib/validations/auth";
import { z } from "zod/v4";

export const actions = {
	create: async () => {
		const roomID = randomUUID();

		throw redirect(303, `/${roomID}`);
	},

	join: async ({ request }) => {
		const formData = Object.fromEntries(await request.formData());
		const roomID = formData.videoURL.toString().split("/").at(-1);
		throw redirect(303, `/${roomID}`);
	},

	changePassword: async ({ request, fetch, cookies }) => {
		const formData = Object.fromEntries(await request.formData());

		const result = changePasswordSchema.safeParse(formData);

		if (!result.success) {
			return fail(400, {
				success: false,
				data: {},
				error: z.flattenError(result.error).fieldErrors,
				message: "Invalid inputs."
			});
		}

		const res = await fetch("/api/v1/auth/change-password", {
			method: "POST",
			credentials: "include",
			body: JSON.stringify(result.data)
		});

		const data = await res.json();

		if (!data.success) {
			if (res.status === 400) {
				return fail(400, {
					success: false,
					data: {},
					error: data.error,
					message: data.message
				});
			}

			if (res.status === 401) {
				return fail(401, {
					success: false,
					data: {},
					error: data.error,
					message: data.message
				});
			}

			if (res.status === 500) {
				return fail(500, {
					success: false,
					data: {},
					error: data.error,
					message: data.message
				});
			}
		}

		cookies.delete(COOKIE_NAME, { path: "/" });

		throw redirect(303, "/signin");
	},

	logout: ({ cookies }) => {
		cookies.delete(COOKIE_NAME, { path: "/" });

		throw redirect(303, "/signin");
	}
} satisfies Actions;

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(307, "/signin");
	}

	if (!locals.user.isInvited) {
		throw redirect(307, "/invite");
	}

	return { user: locals.user };
};
