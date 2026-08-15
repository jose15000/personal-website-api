CREATE TABLE "profile" (
	"id" serial PRIMARY KEY,
	"title" text,
	"content" text,
	"type" text,
	"metadata" json,
	"embbeding" vector NOT NULL
);
