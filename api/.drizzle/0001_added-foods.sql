CREATE TABLE "foods" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"facts" jsonb,
	"author_id" uuid,
	"tags" text GENERATED ALWAYS AS (UPPER("foods"."name" || ' ' || COALESCE("foods"."description", ''))) STORED NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "foods" ADD CONSTRAINT "foods_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "foods_tags_idx" ON "foods" USING btree ("tags");