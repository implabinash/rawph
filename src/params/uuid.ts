import type { ParamMatcher } from "@sveltejs/kit";

const UUID_REGEX =
	/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;

export const match = ((param: string) => {
	return UUID_REGEX.test(param);
}) satisfies ParamMatcher;
