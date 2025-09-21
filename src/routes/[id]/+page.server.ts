import type { Actions } from "./$types";

export const actions = {
	youtube: async ({ request }) => {
		const formData = Object.fromEntries(await request.formData());
		const videoCode = formData.videoURL.toString().split("/").at(-1);

		return { videoCode };
	}
} satisfies Actions;
