import z from "zod/v4";

export const pendingParticipantSchema = z.object({
	pendingParticipant: z.uuid()
});
