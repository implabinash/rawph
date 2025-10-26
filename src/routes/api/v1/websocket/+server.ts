import type { RequestHandler } from "./$types";

export const GET: RequestHandler = ({ request, platform }) => {
	const upgradeHeader = request.headers.get("Upgrade");

	if (!upgradeHeader || upgradeHeader !== "websocket") {
		return new Response("Worker expected Upgrade: websocket", {
			status: 426
		});
	}

	const env = platform?.env;

	if (!env?.DO) {
		return new Response("Durable Object binding not found", { status: 500 });
	}

	const id = env.DO.idFromName("websocket-room");

	const stub = env.DO.get(id);

	return stub.fetch(request);
};
