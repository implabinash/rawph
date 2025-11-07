import type { RequestHandler } from "./$types";
import { redirect } from "@sveltejs/kit";

import { authSessionsTable, oAuthAccountsTable } from "$lib/db/schemas/auth.schema";
import { findOAuthAccount } from "$lib/db/queries/oauth.query";
import { findUserByEmail } from "$lib/db/queries/users.query";
import { generateSessionToken } from "$lib/utils/random";
import { usersTable } from "$lib/db/schemas/user.schema";
import { COOKIE_NAME } from "$lib/utils/constants";
import { google } from "$lib/server/oauth";

interface GoogleUser {
	sub: string;
	email: string;
	email_verified: boolean;
	name: string;
	picture: string;
}

export const GET: RequestHandler = async ({ url, cookies, locals }) => {
	const code = url.searchParams.get("code");
	const state = url.searchParams.get("state");
	const storedState = cookies.get("google_oauth_state");
	const storedCodeVerifier = cookies.get("google_code_verifier");
	const oauthFlow = cookies.get("oauth_flow");

	if (!code || !state || !storedState || !storedCodeVerifier || state !== storedState) {
		cookies.delete("google_oauth_state", { path: "/" });
		cookies.delete("google_code_verifier", { path: "/" });
		cookies.delete("oauth_flow", { path: "/" });

		const redirectPath = oauthFlow === "signup" ? "/signup" : "/signin";
		redirect(303, `${redirectPath}?error=invalid_state`);
	}

	try {
		const tokens = await google.validateAuthorizationCode(code, storedCodeVerifier);

		const response = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
			headers: {
				Authorization: `Bearer ${tokens.accessToken()}`
			}
		});

		const googleUser: GoogleUser = await response.json();

		let userID: string;
		const existingOAuthAccount = await findOAuthAccount(locals.db, "google", googleUser.sub);

		if (existingOAuthAccount) {
			userID = existingOAuthAccount.userID;
		} else {
			const existingUser = await findUserByEmail(locals.db, googleUser.email);

			if (existingUser) {
				userID = existingUser.id;

				await locals.db.insert(oAuthAccountsTable).values({
					userID,
					provider: "google",
					providerUserID: googleUser.sub
				});
			} else {
				const image = googleUser.picture || Math.floor(Math.random() * 5).toString();

				const [newUser] = await locals.db
					.insert(usersTable)
					.values({
						name: googleUser.name,
						email: googleUser.email,
						password: null,
						image
					})
					.returning({ id: usersTable.id });

				userID = newUser.id;

				await locals.db.insert(oAuthAccountsTable).values({
					userID,
					provider: "google",
					providerUserID: googleUser.sub
				});
			}
		}

		const sessionToken = generateSessionToken();
		const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

		await locals.db.insert(authSessionsTable).values({
			token: sessionToken,
			userID,
			expiresAt
		});

		cookies.set(COOKIE_NAME, sessionToken, {
			path: "/",
			secure: true,
			httpOnly: true,
			sameSite: "lax",
			maxAge: 30 * 24 * 60 * 60
		});

		cookies.delete("google_oauth_state", { path: "/" });
		cookies.delete("google_code_verifier", { path: "/" });
		cookies.delete("oauth_flow", { path: "/" });
	} catch (error) {
		console.error("Google OAuth Error:", error);

		cookies.delete("google_oauth_state", { path: "/" });
		cookies.delete("google_code_verifier", { path: "/" });
		cookies.delete("oauth_flow", { path: "/" });

		const redirectPath = oauthFlow === "signup" ? "/signup" : "/signin";
		redirect(303, `${redirectPath}?error=oauth_failed`);
	}

	redirect(303, "/dashboard");
};
