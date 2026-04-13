ALTER TABLE `events` ADD `autoApprove` integer DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `events` ADD `uploadsArePrivate` integer DEFAULT false NOT NULL;