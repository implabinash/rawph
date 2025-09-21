import type { Actions } from "./$types";

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
	}
} satisfies Actions;
