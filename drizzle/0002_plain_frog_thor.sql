CREATE TABLE `session_join_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`study_session_id` text NOT NULL,
	`requested_by` text NOT NULL,
	`requested_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`responded_by` text,
	`responded_at` integer,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`study_session_id`) REFERENCES `study_sessions`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`requested_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`responded_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `session_join_requests_id_unique` ON `session_join_requests` (`id`);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_auth_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`token` text NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_auth_sessions`("id", "token", "user_id", "expires_at", "created_at", "updated_at") SELECT "id", "token", "user_id", "expires_at", "created_at", "updated_at" FROM `auth_sessions`;--> statement-breakpoint
DROP TABLE `auth_sessions`;--> statement-breakpoint
ALTER TABLE `__new_auth_sessions` RENAME TO `auth_sessions`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `auth_sessions_id_unique` ON `auth_sessions` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `auth_sessions_token_unique` ON `auth_sessions` (`token`);