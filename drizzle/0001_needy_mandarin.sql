PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_session_participants` (
	`id` text PRIMARY KEY NOT NULL,
	`study_session_id` text NOT NULL,
	`user_id` text NOT NULL,
	`role` text DEFAULT 'sm' NOT NULL,
	`status` text NOT NULL,
	`joined_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`left_at` integer,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`study_session_id`) REFERENCES `study_sessions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_session_participants`("id", "study_session_id", "user_id", "role", "status", "joined_at", "left_at", "created_at", "updated_at") SELECT "id", "study_session_id", "user_id", "role", "status", "joined_at", "left_at", "created_at", "updated_at" FROM `session_participants`;--> statement-breakpoint
DROP TABLE `session_participants`;--> statement-breakpoint
ALTER TABLE `__new_session_participants` RENAME TO `session_participants`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `session_participants_id_unique` ON `session_participants` (`id`);