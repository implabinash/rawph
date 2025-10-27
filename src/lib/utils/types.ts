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
