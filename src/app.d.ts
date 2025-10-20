declare global {
	namespace App {
		interface Locals {
			user: {
				id: string;
				name: string;
				email: string;
				image: string;
				createdAt: Date;
				updatedAt: Date;
			};
		}
	}
}

export {};
