CREATE TABLE `events` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`startDate` integer NOT NULL,
	`endDate` integer NOT NULL,
	`uploadLimit` integer,
	`guestCode` text NOT NULL,
	`moderatorCode` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`isArchived` integer DEFAULT false NOT NULL,
	CONSTRAINT "dateConstraint" CHECK("events"."startDate" <= "events"."endDate")
);
--> statement-breakpoint
CREATE UNIQUE INDEX `events_guestCode_unique` ON `events` (`guestCode`);--> statement-breakpoint
CREATE UNIQUE INDEX `events_moderatorCode_unique` ON `events` (`moderatorCode`);--> statement-breakpoint
CREATE TABLE `images` (
	`id` text PRIMARY KEY NOT NULL,
	`eventId` text NOT NULL,
	`isApproved` integer,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`eventId`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE no action
);
