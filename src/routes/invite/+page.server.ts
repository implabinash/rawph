import { z } from "zod/v4";

import { fail, redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

import { inviteCodeSchema } from "$lib/validations/auth";

export const actions = {
	default: async ({ request, fetch }) => {
		const formData = Object.fromEntries(await request.formData());
		const result = inviteCodeSchema.safeParse(formData);

		if (!result.success) {
			return fail(400, {
				success: false,
				data: {},
				error: z.flattenError(result.error).fieldErrors,
				message: "Check your invite code and try again."
			});
		}

		const res = await fetch("/api/v1/auth/invites/validate", {
			method: "POST",
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

			if (res.status === 409) {
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

		throw redirect(303, "/dashboard");
	}
} satisfies Actions;

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(307, "/signin");
	}

	if (locals.user.isInvited) {
		throw redirect(303, "/dashboard");
	}
};
