import { z } from "zod/v4";

import type { RequestHandler } from "./$types";
import { json } from "@sveltejs/kit";

import { findUserByEmail } from "$lib/db/queries/users.query";
import { generateSessionToken } from "$lib/utils/random";
import { signInSchema } from "$lib/validations/auth";
import { COOKIE_NAME } from "$lib/utils/constants";
import { verifyPassword } from "$lib/utils/hash";
import { authSessionsTable } from "$lib/db/schemas/auth.schema";

export const POST: RequestHandler = async ({ request, locals, cookies }) => {
	const body = await request.json();

	const result = signInSchema.safeParse(body);

	if (!result.success) {
		const response = {
			success: false,
			data: {},
			error: z.flattenError(result.error).fieldErrors,
			message: "Invalid inputs."
		};

		return json(response, { status: 400 });
	}

	const user = await findUserByEmail(locals.db, result.data.email);

	if (!user) {
		const response = {
			success: false,
			data: {},
			error: {},
			message: "Invalid email or password."
		};

		return json(response, { status: 401 });
	}

	const isValidPassword = await verifyPassword(result.data.password, user.password!);

	if (!isValidPassword) {
		const response = {
			success: false,
			data: {},
			error: {},
			message: "Invalid email or password."
		};

		return json(response, { status: 401 });
	}

	const sessionToken = generateSessionToken();
	const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

	try {
		await locals.db.insert(authSessionsTable).values({
			token: sessionToken,
			userId: user.id,
			expiresAt
		});
	} catch (err) {
		console.error("Signin error: ", err);

		const response = {
			success: false,
			data: {},
			error: {},
			message: "Signin failed. Try Again."
		};

		return json(response, { status: 500 });
	}

	cookies.set(COOKIE_NAME, sessionToken, {
		httpOnly: true,
		sameSite: "lax",
		secure: true,
		path: "/",
		maxAge: 30 * 24 * 60 * 60
	});

	const response = {
		success: true,
		data: {},
		error: {},
		message: "Signed In successfully."
	};

	return json(response, { status: 200 });
};
