import type { RequestHandler } from "./$types";
import { json } from "@sveltejs/kit";

export const GET: RequestHandler = async () => {
	const response = {
		success: true,
		message: "Working fine!"
	};

	return json(response, { status: 200 });
};
