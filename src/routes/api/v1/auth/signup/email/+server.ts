import { z } from "zod/v4";

import type { RequestHandler } from "./$types";
import { json } from "@sveltejs/kit";

import { findUserByEmail } from "$lib/db/queries/users.query";
import { sessionsTable } from "$lib/db/schemas/auth.schema";
import { generateSessionToken } from "$lib/utils/random";
import { usersTable } from "$lib/db/schemas/user.schema";
import { signUpSchema } from "$lib/validations/auth";
import { COOKIE_NAME } from "$lib/utils/constants";
import { hashPassword } from "$lib/utils/hash";

export const POST: RequestHandler = async ({ request, cookies, locals }) => {
	const body = await request.json();

	const result = signUpSchema.safeParse(body);

	if (!result.success) {
		const response = {
			success: false,
			data: {},
			error: z.flattenError(result.error).fieldErrors,
			message: "Invalid inputs."
		};

		return json(response, { status: 400 });
	}

	const existingUser = await findUserByEmail(locals.db, result.data.email);

	if (existingUser) {
		const response = {
			success: false,
			data: {},
			error: {},
			message: "Email is already in use."
		};

		return json(response, { status: 409 });
	}

	const hashedPassword = await hashPassword(result.data.password);
	const image = Math.floor(Math.random() * 5).toString();

	const sessionToken = generateSessionToken();
	const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

	let userID = "";

	try {
		const [user] = await locals.db
			.insert(usersTable)
			.values({
				name: result.data.name,
				email: result.data.email,
				password: hashedPassword,
				image
			})
			.returning({ userID: usersTable.id });

		userID = user.userID;

		await locals.db.insert(sessionsTable).values({
			token: sessionToken,
			userId: userID,
			expiresAt
		});
	} catch (err) {
		console.error("Sign Up & Session Creation Error: ", err);

		const response = {
			success: false,
			data: {},
			error: {},
			message: "Signup failed. Try Again."
		};

		return json(response, { status: 500 });
	}

	cookies.set(COOKIE_NAME, sessionToken, {
		path: "/",
		secure: true,
		httpOnly: true,
		sameSite: "lax",
		maxAge: 30 * 24 * 60 * 60
	});

	const response = {
		success: true,
		data: {
			userID: userID
		},
		error: {},
		message: "User Created."
	};

	return json(response, { status: 201 });
};
