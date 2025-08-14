-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `board` (
	`ID` int AUTO_INCREMENT NOT NULL,
	`TITLE` varchar(100),
	`CONTENTS` text,
	`USERNAME` text,
	`PASSWORD` varchar(100),
	`VIEWS` int NOT NULL DEFAULT 0,
	`CREATED_DT` datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
	`UPDATED_DT` datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
	`DELETED_YN` tinyint(1) NOT NULL DEFAULT 0,
	CONSTRAINT `board_ID` PRIMARY KEY(`ID`)
);
--> statement-breakpoint
CREATE INDEX `IDX_BOARD` ON `board` (`CREATED_DT`);
*/