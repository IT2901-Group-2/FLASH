CREATE TABLE `imageSizes` (
	`id` text NOT NULL,
	`width` integer NOT NULL,
	`height` integer NOT NULL,
	`original` integer DEFAULT false NOT NULL,
	PRIMARY KEY(`id`, `width`, `height`),
	FOREIGN KEY (`id`) REFERENCES `images`(`id`) ON UPDATE no action ON DELETE no action
);
