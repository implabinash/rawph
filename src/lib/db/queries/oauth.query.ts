import { and, eq } from "drizzle-orm";

import { oauthAccountsTable } from "$lib/db/schemas/auth.schema";
import type { DrizzleClient } from "$lib/db/index";

export const findOAuthAccount = async (
	db: DrizzleClient,
	provider: string,
	providerUserId: string
) => {
	const account = await db.query.oauthAccountsTable.findFirst({
		where: and(
			eq(oauthAccountsTable.provider, provider),
			eq(oauthAccountsTable.providerUserId, providerUserId)
		)
	});

	return account;
};
