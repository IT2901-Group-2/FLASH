PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` text PRIMARY KEY NOT NULL,
	`eventId` text NOT NULL,
	`name` text NOT NULL,
	`isModerator` integer NOT NULL,
	`joinedAt` integer NOT NULL,
	`lastAccessedAt` integer NOT NULL,
	FOREIGN KEY (`eventId`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "eventId", "name", "isModerator", "joinedAt", "lastAccessedAt") SELECT "id", "eventId", "name", "isModerator", "joinedAt", "lastAccessedAt" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `name` ON `users` (`eventId`,`name`);