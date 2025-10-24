import { generateCodeVerifier, generateState } from "arctic";
import type { RequestHandler } from "./$types";
import { redirect } from "@sveltejs/kit";

import { google } from "$lib/server/oauth";

export const GET: RequestHandler = ({ cookies }) => {
	const state = generateState();
	const codeVerifier = generateCodeVerifier();

	const url = google.createAuthorizationURL(state, codeVerifier, ["openid", "profile", "email"]);

	cookies.set("google_oauth_state", state, {
		path: "/",
		secure: true,
		httpOnly: true,
		sameSite: "lax",
		maxAge: 60 * 10
	});

	cookies.set("google_code_verifier", codeVerifier, {
		path: "/",
		secure: true,
		httpOnly: true,
		sameSite: "lax",
		maxAge: 60 * 10
	});

	redirect(302, url.toString());
};
