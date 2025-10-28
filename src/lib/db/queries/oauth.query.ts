import { and, eq } from "drizzle-orm";

import { oAuthAccountsTable } from "$lib/db/schemas/auth.schema";
import type { DrizzleClient } from "$lib/db/index";

export const findOAuthAccount = async (
	db: DrizzleClient,
	provider: string,
	providerUserID: string
) => {
	const account = await db.query.oAuthAccountsTable.findFirst({
		where: and(
			eq(oAuthAccountsTable.provider, provider),
			eq(oAuthAccountsTable.providerUserID, providerUserID)
		),
		columns: {
			userID: true
		}
	});

	return account;
};
