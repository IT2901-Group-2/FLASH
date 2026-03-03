CREATE TABLE `eventCodes` (
	`code` text PRIMARY KEY NOT NULL,
	`eventId` text NOT NULL,
	`isModerator` integer NOT NULL,
	FOREIGN KEY (`eventId`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `codeConstraint` ON `eventCodes` (`code`,`eventId`,`isModerator`);--> statement-breakpoint
CREATE TABLE `events` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`startDate` integer NOT NULL,
	`endDate` integer NOT NULL,
	`uploadLimit` integer,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`isArchived` integer DEFAULT false NOT NULL,
	CONSTRAINT "dateConstraint" CHECK("events"."startDate" <= "events"."endDate")
);
--> statement-breakpoint
CREATE TABLE `images` (
	`id` text PRIMARY KEY NOT NULL,
	`eventId` text NOT NULL,
	`isApproved` integer,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`eventId`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE no action
);
