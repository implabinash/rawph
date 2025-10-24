import { and, eq } from "drizzle-orm";
import type { DrizzleClient } from "..";
import { oauthAccountsTable } from "../schemas/auth.schema";

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
