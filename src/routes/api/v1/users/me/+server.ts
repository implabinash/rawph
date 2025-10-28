import { eq } from "drizzle-orm";

import type { RequestHandler } from "./$types";
import { json } from "@sveltejs/kit";

import { COOKIE_NAME, EXTENSION_THRESHOLD, SESSION_DURATION } from "$lib/utils/constants";
import { findAuthSessionData } from "$lib/db/queries/authsessions.query";
import { authSessionsTable } from "$lib/db/schemas/auth.schema";

export const GET: RequestHandler = async ({ cookies, locals }) => {
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

	const data = await findAuthSessionData(locals.db, sessionToken);

	if (!data || !data.user) {
		const response = {
			success: false,
			data: {},
			error: {},
			message: "Invalid session."
		};

		return json(response, { status: 401 });
	}

	const now = new Date();
	const expiresAt = new Date(data.expiresAt);
	const timeUntilExpiry = expiresAt.getTime() - now.getTime();

	if (timeUntilExpiry <= 0) {
		const response = {
			success: false,
			data: {},
			error: {},
			message: "Session expired. Please log in again."
		};
		return json(response, { status: 401 });
	}

	if (timeUntilExpiry < EXTENSION_THRESHOLD) {
		const newExpiresAt = new Date(now.getTime() + SESSION_DURATION);

		try {
			await locals.db
				.update(authSessionsTable)
				.set({ expiresAt: newExpiresAt })
				.where(eq(authSessionsTable.token, sessionToken));
		} catch (err) {
			console.error("Failed to extend session:", err);

			const response = {
				success: false,
				data: {},
				error: {},
				message: "Failed to retrieve user data. Try again."
			};

			return json(response, { status: 500 });
		}

		cookies.set(COOKIE_NAME, sessionToken, {
			path: "/",
			secure: true,
			httpOnly: true,
			sameSite: "lax",
			expires: newExpiresAt
		});
	}

	const { password, ...userWithoutPassword } = data.user;

	const response = {
		success: true,
		data: {
			user: userWithoutPassword,
			hasPassword: !!password
		},
		error: {},
		message: "User retrieved successfully."
	};

	return json(response, { status: 200 });
};
