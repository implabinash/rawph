import { z } from "zod/v4";

import type { Actions, PageServerLoad } from "./$types";
import { fail, redirect } from "@sveltejs/kit";

import { changePasswordSchema, setPasswordSchema } from "$lib/validations/auth";
import { studySessionsTable } from "$lib/db/schemas/studysession.schema";
import { findInviteCodesByUserID } from "$lib/db/queries/invites.query";
import { COOKIE_NAME } from "$lib/utils/constants";

export const actions = {
	create: async ({ locals }) => {
		const [studySession] = await locals.db
			.insert(studySessionsTable)
			.values({
				createdBy: locals.user.id
			})
			.returning({ studySessionID: studySessionsTable.id });

		if (!studySession.studySessionID) {
			return fail(409, {
				success: false,
				data: {},
				error: {},
				message: "Study session creation failed. Try again."
			});
		}

		throw redirect(303, `/s/${studySession.studySessionID}`);
	},

	join: async ({ request }) => {
		const formData = Object.fromEntries(await request.formData());
		const roomID = formData.videoURL.toString().split("/").at(-1);
		throw redirect(303, `/${roomID}`);
	},

	changePassword: async ({ request, fetch, cookies, locals }) => {
		const formData = Object.fromEntries(await request.formData());

		let result;

		if (locals.user.hasPassword) {
			result = changePasswordSchema.safeParse(formData);

			if (!result.success) {
				return fail(400, {
					success: false,
					data: {},
					error: z.flattenError(result.error).fieldErrors,
					message: "Invalid inputs."
				});
			}
		} else {
			result = setPasswordSchema.safeParse(formData);

			if (!result.success) {
				return fail(400, {
					success: false,
					data: {},
					error: z.flattenError(result.error).fieldErrors,
					message: "Invalid inputs."
				});
			}
		}

		const res = await fetch("/api/v1/auth/update-password", {
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

	const inviteCodes = await findInviteCodesByUserID(locals.db, locals.user.id);

	return { user: locals.user, inviteCodes };
};
