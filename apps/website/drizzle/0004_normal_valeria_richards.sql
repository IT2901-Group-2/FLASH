CREATE TABLE `eventStats` (
	`eventId` text PRIMARY KEY NOT NULL,
	`pendingImages` integer DEFAULT 0 NOT NULL,
	`approvedImages` integer DEFAULT 0 NOT NULL,
	`rejectedImages` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`eventId`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade
);--> statement-breakpoint
INSERT INTO `eventStats` SELECT `id`, 0, 0, 0 FROM `events`;--> statement-breakpoint
CREATE TRIGGER `eventCreated`
AFTER INSERT ON `events`
FOR EACH ROW
BEGIN
  INSERT INTO `eventStats` VALUES (`NEW`.`id`, 0, 0, 0);
END;--> statement-breakpoint
CREATE TRIGGER `imageCreated`
AFTER INSERT ON `images`
FOR EACH ROW
BEGIN
  UPDATE `eventStats` SET
    `pendingImages` = `pendingImages` + IIF(`NEW`.`isApproved` IS NULL, 1, 0),
    `approvedImages` = `approvedImages` + IIF(`NEW`.`isApproved` = TRUE, 1, 0),
    `rejectedImages` = `rejectedImages` + IIF(`NEW`.`isApproved` = FALSE, 1, 0)
  WHERE `eventId` = `NEW`.`eventId`;
END;--> statement-breakpoint
CREATE TRIGGER `imageUpdated`
AFTER UPDATE ON `images`
FOR EACH ROW
WHEN `NEW`.`eventId` = `OLD`.`eventId`
BEGIN
  UPDATE `eventStats` SET
    `pendingImages` = `pendingImages` + IIF(`NEW`.`isApproved` IS NULL, 1, 0) - IIF(`OLD`.`isApproved` IS NULL, 1, 0),
    `approvedImages` = `approvedImages` + IIF(`NEW`.`isApproved` = TRUE, 1, 0) - IIF(`OLD`.`isApproved` = TRUE, 1, 0),
    `rejectedImages` = `rejectedImages` + IIF(`NEW`.`isApproved` = FALSE, 1, 0) - IIF(`OLD`.`isApproved` = FALSE, 1, 0)
  WHERE `eventId` = `NEW`.`eventId`;
END;
