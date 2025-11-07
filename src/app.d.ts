import type { DrizzleClient } from "$lib/db";

declare global {
	interface Window {
		YT: any;
		onYouTubeIframeAPIReady: () => void;
	}
	namespace App {
		interface Platform {
			env: {
				DB: D1Database;
				DO: DurableObjectNamespace;
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
				hasPassword: boolean;
				image: string;
				joinedCode: string;
				createdAt: Date;
				updatedAt: Date;
			};
		}
	}
}

export {};
