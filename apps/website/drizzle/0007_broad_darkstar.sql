INSERT INTO `imageSizes`
SELECT `images`.`id`, 0, 0 FROM `images`
LEFT JOIN `imageSizes` ON `images`.`id` = `imageSizes`.`imageId`
WHERE `imageSizes`.`imageId` IS NULL;
