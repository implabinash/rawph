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
		}
	}
}

export {};
