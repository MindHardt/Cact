CREATE TABLE "meals" (
	"id" uuid PRIMARY KEY NOT NULL,
	"note" text,
	"meal_time" timestamp NOT NULL,
	"portions" jsonb NOT NULL,
	"nutrition" jsonb NOT NULL,
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "foods" ADD COLUMN "units" jsonb NOT NULL DEFAULT '[{"name": "100г", "multiplier":1}]'::jsonb;--> statement-breakpoint
ALTER TABLE "meals" ADD CONSTRAINT "meals_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "meal_time_user_idx" ON "meals" USING btree ("user_id","meal_time");