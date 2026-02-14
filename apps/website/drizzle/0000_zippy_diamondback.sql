CREATE TABLE `events` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`uploadLimit` integer,
	`guestCode` text NOT NULL,
	`adminCode` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `events_guestCode_unique` ON `events` (`guestCode`);--> statement-breakpoint
CREATE UNIQUE INDEX `events_adminCode_unique` ON `events` (`adminCode`);