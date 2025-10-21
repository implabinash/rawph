import { COOKIE_NAME } from "$lib/utils/constants";
import { BASE_URL } from "$env/static/private";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get(COOKIE_NAME);

	if (token) {
		try {
			const res = await event.fetch(`${BASE_URL}/users/me`, {
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
							sameSite: "none",
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
