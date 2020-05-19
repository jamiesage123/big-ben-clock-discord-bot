--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

CREATE TABLE "servers" (
	"id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	"server_id"	TEXT NOT NULL,
	"channel_id" TEXT,
	"frequency"	INTEGER DEFAULT NULL,
	"created_at" TEXT NOT NULL
);

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

DROP TABLE `servers`