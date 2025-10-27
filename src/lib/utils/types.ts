export type User = {
	id: string;
	name: string;
	email: string;
	hasPassword?: boolean;
	image: string;
	isInvited: boolean;
	joinedCode: string | null;
	createdAt: Date;
	updatedAt: Date;
};

type MessageRecipient = "ss" | "sp";

type MessageType =
	// User actions
	| "mute"
	| "unmute"

	// Session control
	| "add_participant"
	| "remove_participant"
	| "approve_participant"
	| "reject_participant"

	// Content
	| "remove_video"
	| "add_video";

type WSMessage<T> = {
	type: MessageType;
	data: T;
	for: MessageRecipient;
};

type ParticipantData = {
	userId: string;
	name: string;
	image: string;
};

export type NewParticipantMessage = WSMessage<ParticipantData>;
