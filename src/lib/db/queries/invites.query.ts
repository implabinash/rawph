import { eq } from "drizzle-orm";

import { inviteCodesTable } from "$lib/db/schemas/invite.schema";
import type { DrizzleClient } from "$lib/db/index";

export const findInviteCodeData = async (db: DrizzleClient, code: string) => {
	const inviteCodeData = await db.query.inviteCodesTable.findFirst({
		where: eq(inviteCodesTable.code, code),
		columns: {
			id: true,
			isUsed: true
		}
	});

	return inviteCodeData;
};

export const findInviteCodesByUserID = async (db: DrizzleClient, userID: string) => {
	const inviteCodes = await db.query.inviteCodesTable.findMany({
		where: eq(inviteCodesTable.createdBy, userID),
		columns: {
			id: true,
			code: true,
			isUsed: true
		}
	});

	return inviteCodes;
};
