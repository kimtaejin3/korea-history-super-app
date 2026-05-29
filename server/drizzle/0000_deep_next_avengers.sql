CREATE TABLE "achievement" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"max_value" integer
);
--> statement-breakpoint
CREATE TABLE "heritage" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"name_hanja" text NOT NULL,
	"region" text NOT NULL,
	"era" text NOT NULL,
	"period" text NOT NULL,
	"tag" text NOT NULL,
	"accent" text NOT NULL,
	"lat" double precision,
	"lon" double precision,
	"coords" jsonb,
	"summary" text NOT NULL,
	"story" text NOT NULL,
	"visits" integer DEFAULT 0 NOT NULL,
	"nearby_stamps" integer DEFAULT 0 NOT NULL,
	"quiz" jsonb,
	"photo" jsonb,
	"source" text DEFAULT 'curated' NOT NULL,
	"ccba_kdcd" integer,
	"designation" text,
	"designation_date" text,
	"classification" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "level" (
	"level" integer PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"hanja" text NOT NULL,
	"min_xp" integer NOT NULL,
	"color" text NOT NULL,
	"description" text NOT NULL,
	"perks" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stamp" (
	"user_id" text NOT NULL,
	"place_id" text NOT NULL,
	"visited_at" timestamp DEFAULT now() NOT NULL,
	"quiz_correct" integer,
	"photo_url" text,
	CONSTRAINT "stamp_user_id_place_id_pk" PRIMARY KEY("user_id","place_id")
);
--> statement-breakpoint
CREATE TABLE "theme" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"subtitle" text NOT NULL,
	"description" text NOT NULL,
	"cover" text NOT NULL,
	"color" text NOT NULL,
	"glyph" text NOT NULL,
	"total_places" integer NOT NULL,
	"reward_goods" text NOT NULL,
	"badge" text NOT NULL,
	"place_ids" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "today_entry" (
	"id" text PRIMARY KEY NOT NULL,
	"date" text NOT NULL,
	"year" integer,
	"title" text NOT NULL,
	"summary" text NOT NULL,
	"place_id" text,
	"accent" text NOT NULL,
	"glyph" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"nickname" text NOT NULL,
	"email" text,
	"joined_at" timestamp DEFAULT now() NOT NULL,
	"days_active" integer DEFAULT 0 NOT NULL,
	"quiz_correct" integer DEFAULT 0 NOT NULL,
	"themes_completed" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_achievement" (
	"user_id" text NOT NULL,
	"achievement_id" text NOT NULL,
	"progress" integer DEFAULT 0 NOT NULL,
	"done" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_achievement_user_id_achievement_id_pk" PRIMARY KEY("user_id","achievement_id")
);
--> statement-breakpoint
CREATE INDEX "heritage_coords_idx" ON "heritage" USING btree ("lat","lon");--> statement-breakpoint
CREATE INDEX "heritage_region_idx" ON "heritage" USING btree ("region");--> statement-breakpoint
CREATE INDEX "stamp_user_idx" ON "stamp" USING btree ("user_id");