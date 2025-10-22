import type { DrizzleClient } from "$lib/db";

declare global {
	namespace App {
		interface Platform {
			env: {
				DB: D1Database;
			};
			cf: CfProperties;
			ctx: ExecutionContext;
		}
		interface Locals {
			db: DrizzleClient;
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
