CREATE TABLE `invite_codes` (
	`id` text PRIMARY KEY NOT NULL,
	`code` text NOT NULL,
	`created_by` text DEFAULT '00000000-0000-0000-0000-000000000000',
	`is_used` integer DEFAULT false NOT NULL,
	`used_by` text,
	`used_at` integer,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `invite_codes_id_unique` ON `invite_codes` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `invite_codes_code_unique` ON `invite_codes` (`code`);--> statement-breakpoint
ALTER TABLE `users` ADD `joined_code` text NOT NULL REFERENCES invite_codes(code);