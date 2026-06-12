CREATE TABLE "topic" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"era" text,
	"accent" text NOT NULL,
	"glyph" text NOT NULL,
	"place_ids" jsonb NOT NULL,
	"sort" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
