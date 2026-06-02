CREATE TABLE "targets" (
	"id" uuid PRIMARY KEY NOT NULL,
	"active_from" timestamp NOT NULL,
	"name" text,
	"calories" integer,
	"protein" integer,
	"fats" integer,
	"carbs" integer,
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "targets" ADD CONSTRAINT "targets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "target_active_from_user_id_idx" ON "targets" USING btree ("active_from","user_id");