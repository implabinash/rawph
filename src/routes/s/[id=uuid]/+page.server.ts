import type { Actions, PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const actions = {
	youtube: async ({ request }) => {
		const formData = Object.fromEntries(await request.formData());
		let videoCode = "";

		// Check for valid youtube video or not

		if (formData.videoURL.toString().includes("watch?v=")) {
			videoCode = formData.videoURL.toString().split("watch?v=").at(-1) || "";
		} else {
			videoCode = formData.videoURL.toString().split("/").at(-1) || "";
		}

		// if videoCode is empty return an error

		return { videoCode };
	},

	changeVideo: () => {
		return { change: true };
	},

	leave: () => {
		throw redirect(303, "/dashboard");
	},

	accept: () => {
		console.log("accept");
	},

	reject: () => {
		console.log("reject");
	}
} satisfies Actions;

export const load: PageServerLoad = async ({ locals, url }) => {
	if (!locals.user) {
		throw redirect(307, "/signin");
	}

	if (!locals.user.isInvited) {
		throw redirect(307, "/invite");
	}

	return { user: locals.user };
};
