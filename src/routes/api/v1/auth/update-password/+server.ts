import { eq } from "drizzle-orm";
import { z } from "zod/v4";

import type { RequestHandler } from "./$types";
import { json } from "@sveltejs/kit";

import { changePasswordSchema, setPasswordSchema } from "$lib/validations/auth";
import { findAuthSessionData } from "$lib/db/queries/authsessions.query";
import { hashPassword, verifyPassword } from "$lib/utils/hash";
import { usersTable } from "$lib/db/schemas/user.schema";
import { COOKIE_NAME } from "$lib/utils/constants";

export const POST: RequestHandler = async ({ request, cookies, locals }) => {
	const body = await request.json();

	let result;

	if (locals.user.hasPassword) {
		result = changePasswordSchema.safeParse(body);

		if (!result.success) {
			const response = {
				success: false,
				data: {},
				error: z.flattenError(result.error).fieldErrors,
				message: "Check your password and try again."
			};

			return json(response, { status: 400 });
		}
	} else {
		result = setPasswordSchema.safeParse(body);

		if (!result.success) {
			const response = {
				success: false,
				data: {},
				error: z.flattenError(result.error).fieldErrors,
				message: "Check your password and try again."
			};

			return json(response, { status: 400 });
		}
	}

	const sessionToken = cookies.get(COOKIE_NAME);

	if (!sessionToken) {
		const response = {
			success: false,
			data: {},
			error: {},
			message: "Sign in to continue."
		};

		return json(response, { status: 401 });
	}

	const data = await findAuthSessionData(locals.db, sessionToken);

	if (!data || !data.user) {
		const response = {
			success: false,
			data: {},
			error: {},
			message: "Sign in to continue."
		};

		return json(response, { status: 401 });
	}

	if (locals.user.hasPassword) {
		const isValidPassword = await verifyPassword(
			result.data.currentPassword,
			data.user.password ?? ""
		);

		if (!isValidPassword) {
			const response = {
				success: false,
				data: {},
				error: {},
				message: "Your current password is incorrect."
			};

			return json(response, { status: 401 });
		}
	}

	const newHashedPassword = await hashPassword(result.data.newPassword);

	try {
		await locals.db
			.update(usersTable)
			.set({ password: newHashedPassword })
			.where(eq(usersTable.id, data.user.id));
	} catch (err) {
		console.error("Password change error: ", err);

		const response = {
			success: false,
			data: {},
			error: {},
			message: "We couldn't change your password. Try again."
		};

		return json(response, { status: 500 });
	}

	const response = {
		success: true,
		data: {},
		error: {},
		message: "Your password has been changed."
	};

	return json(response, { status: 200 });
};
