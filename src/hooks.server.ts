import { authClient } from "$lib/auth-client";

export async function handle({ event, resolve }) {
	const user = authClient.useSession().value?.data?.user;

	event.locals.user = user;

	const response = await resolve(event);
	return response;
}
