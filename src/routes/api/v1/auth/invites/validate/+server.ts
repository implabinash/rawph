import { eq } from "drizzle-orm";
import { z } from "zod/v4";

import type { RequestHandler } from "./$types";
import { json } from "@sveltejs/kit";

import { findInviteCodeData } from "$lib/db/queries/invites.query";
import { inviteCodesTable } from "$lib/db/schemas/invite.schema";
import { inviteCodeSchema } from "$lib/validations/auth";
import { usersTable } from "$lib/db/schemas/user.schema";
import { generateInviteCode } from "$lib/utils/random";

export const POST: RequestHandler = async ({ request, locals }) => {
	const body = await request.json();

	const result = inviteCodeSchema.safeParse(body);

	if (!result.success) {
		const response = {
			success: false,
			data: {},
			error: z.flattenError(result.error).fieldErrors,
			message: "Invalid invite code."
		};

		return json(response, { status: 400 });
	}

	const inviteCodeData = await findInviteCodeData(locals.db, result.data.code);

	if (!inviteCodeData || inviteCodeData.isUsed) {
		const response = {
			success: false,
			data: {},
			error: {},
			message: "Invalid invite code."
		};

		return json(response, { status: 400 });
	}

	if (!locals.user) {
		const response = {
			success: false,
			data: {},
			error: {},
			message: "Authentication required."
		};

		return json(response, { status: 401 });
	}

	try {
		await locals.db
			.update(inviteCodesTable)
			.set({
				isUsed: true,
				usedBy: locals.user.id,
				usedAt: new Date(Date.now())
			})
			.where(eq(inviteCodesTable.code, result.data.code));

		await locals.db
			.update(usersTable)
			.set({
				isInvited: true
			})
			.where(eq(usersTable.id, locals.user.id));

		const inviteCode1 = generateInviteCode();
		const inviteCode2 = generateInviteCode();

		await locals.db.insert(inviteCodesTable).values([
			{
				code: inviteCode1,
				createdBy: locals.user.id
			},
			{
				code: inviteCode2,
				createdBy: locals.user.id
			}
		]);
	} catch (err) {
		console.error("Invite code update failed. ", err);

		const response = {
			success: false,
			data: {},
			error: {},
			message: "Invite code verification failed. Try again."
		};

		return json(response, { status: 500 });
	}

	const response = {
		success: true,
		data: {},
		error: {},
		message: "Verified successfully."
	};

	return json(response, { status: 200 });
};
