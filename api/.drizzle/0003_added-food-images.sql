ALTER TABLE "foods" ALTER COLUMN "facts" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "foods" ADD COLUMN "image_id" uuid;--> statement-breakpoint
ALTER TABLE "foods" ADD CONSTRAINT "foods_image_id_uploads_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."uploads"("id") ON DELETE no action ON UPDATE no action;