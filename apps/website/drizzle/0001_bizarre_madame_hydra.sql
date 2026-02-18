CREATE TABLE `images` (
	`id` text PRIMARY KEY NOT NULL,
	`eventId` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`eventId`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE no action
);
