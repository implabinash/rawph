import type { Handle } from "@sveltejs/kit";

import { COOKIE_NAME } from "$lib/utils/constants";
import { getDB } from "$lib/db";

export const handle: Handle = async ({ event, resolve }) => {
	if (event.platform?.env.DB) {
		event.locals.db = getDB(event.platform.env.DB);
	}

	const token = event.cookies.get(COOKIE_NAME);

	if (token && !event.url.pathname.startsWith("/api/v1/users/me")) {
		try {
			const res = await event.fetch("/api/v1/users/me", {
				credentials: "include"
			});

			if (res.ok) {
				const data = await res.json();

				if (data.success) {
					const setCookieHeader = res.headers.get("set-cookie");

					if (setCookieHeader) {
						const [name, token] = setCookieHeader.split(";")[0].split("=");

						event.cookies.set(name, token, {
							path: "/",
							secure: true,
							httpOnly: true,
							sameSite: "lax",
							maxAge: 30 * 24 * 60 * 60
						});
					}

					event.locals.user = data.data.user;
				}
			}
		} catch (error) {
			event.cookies.delete(COOKIE_NAME, { path: "/" });
			console.error("Auth verification failed:", error);
		}
	}

	const response = await resolve(event);
	return response;
};
