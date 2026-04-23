CREATE TABLE `imageSizes` (
	`imageId` text NOT NULL,
	`width` integer NOT NULL,
	`height` integer NOT NULL,
	PRIMARY KEY(`imageId`, `width`, `height`),
	FOREIGN KEY (`imageId`) REFERENCES `images`(`id`) ON UPDATE no action ON DELETE cascade
);
