import { eq } from "drizzle-orm";
import { z } from "zod/v4";

import type { RequestHandler } from "./$types";
import { json } from "@sveltejs/kit";

import { findSessionData } from "$lib/db/queries/sessions.query";
import { hashPassword, verifyPassword } from "$lib/utils/hash";
import { changePasswordSchema } from "$lib/validations/auth";
import { usersTable } from "$lib/db/schemas/user.schema";
import { COOKIE_NAME } from "$lib/utils/constants";

export const POST: RequestHandler = async ({ request, cookies, locals }) => {
	const body = await request.json();

	const result = changePasswordSchema.safeParse(body);

	if (!result.success) {
		const response = {
			success: false,
			data: {},
			error: z.flattenError(result.error).fieldErrors,
			message: "Invalid inputs."
		};

		return json(response, { status: 400 });
	}

	const sessionToken = cookies.get(COOKIE_NAME);

	if (!sessionToken) {
		const response = {
			success: false,
			data: {},
			error: {},
			message: "Invalid session."
		};

		return json(response, { status: 401 });
	}

	const data = await findSessionData(locals.db, sessionToken);

	if (!data || !data.users) {
		const response = {
			success: false,
			data: {},
			error: {},
			message: "Invalid session."
		};

		return json(response, { status: 401 });
	}

	const isValidPassword = await verifyPassword(result.data.currentPassword, data.users.password);

	if (!isValidPassword) {
		const response = {
			success: false,
			data: {},
			error: {},
			message: "Current password is incorrect."
		};

		return json(response, { status: 401 });
	}

	const newHashedPassword = await hashPassword(result.data.newPassword);

	try {
		await locals.db
			.update(usersTable)
			.set({ password: newHashedPassword })
			.where(eq(usersTable.id, data.users.id));
	} catch (err) {
		console.error("Password change error: ", err);

		const response = {
			success: false,
			data: {},
			error: {},
			message: "Password change failed. Try Again."
		};

		return json(response, { status: 500 });
	}

	const response = {
		success: true,
		data: {},
		error: {},
		message: "Password changed successfully."
	};

	return json(response, { status: 200 });
};
