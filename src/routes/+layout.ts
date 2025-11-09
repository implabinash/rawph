import posthog from "posthog-js";

import { PUBLIC_POSTHOG_API_KEY } from "$env/static/public";
import { browser } from "$app/environment";

export const load = async ({ url, data }) => {
	if (browser && !url.host.includes("localhost")) {
		posthog.init(PUBLIC_POSTHOG_API_KEY, {
			api_host: "https://us.i.posthog.com",
			defaults: "2025-05-24"
		});

		if (data.user) {
			posthog.identify(data.user.id, {
				email: data.user.email,
				name: data.user.name
			});
		}
	}

	return;
};
