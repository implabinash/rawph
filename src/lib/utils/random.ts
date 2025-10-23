export const generateSessionToken = () => {
	const randomValues = new Uint8Array(256);
	crypto.getRandomValues(randomValues);

	return Array.from(randomValues, (byte) => byte.toString(16).padStart(2, "0")).join("");
};

export const generateInviteCode = () => {
	const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	const randomValues = new Uint8Array(10);
	crypto.getRandomValues(randomValues);

	return Array.from(randomValues, (byte) => chars[byte % chars.length]).join("");
};
