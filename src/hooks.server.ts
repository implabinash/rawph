import { redirect, type Handle } from "@sveltejs/kit";
import { BASE_URL } from "$env/static/private";

export const handle: Handle = async ({ event, resolve }) => {
	if (event.url.pathname.startsWith("/dashboard")) {
		const res = await event.fetch(`${BASE_URL}/users/me`, {
			credentials: "include"
		});

		if (!res.ok) {
			redirect(302, "/signin");
		}

		const data = await res.json();

		if (!data.success) {
			redirect(302, "/signin");
		}

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

	const response = await resolve(event);
	return response;
};
