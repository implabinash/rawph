import { createAuthClient } from "better-auth/svelte";
import { BASE_URL } from "$env/static/private";

export const authClient = createAuthClient({
	baseURL: BASE_URL,
	basePath: "/api/v1/auth"
});
