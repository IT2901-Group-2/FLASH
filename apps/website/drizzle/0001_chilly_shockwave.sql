CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`eventId` text NOT NULL,
	`name` text NOT NULL,
	`isModerator` integer NOT NULL,
	`joinedAt` integer NOT NULL,
	`lastAccessedAt` integer NOT NULL,
	FOREIGN KEY (`eventId`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `name` ON `users` (`eventId`,`name`);--> statement-breakpoint
ALTER TABLE `images` ADD `userId` text NOT NULL REFERENCES users(id);