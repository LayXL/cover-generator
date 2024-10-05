DO $$ BEGIN
 CREATE TYPE "public"."icon_types" AS ENUM('svg', 'png');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fonts" (
	"name" text PRIMARY KEY NOT NULL,
	"category" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "icons" (
	"name" text PRIMARY KEY NOT NULL,
	"category" "icon_types" NOT NULL,
	"type" "icon_types" NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_payments" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now(),
	"paymentData" json NOT NULL,
	"isTestPayment" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_purchases" ALTER COLUMN "purchasedAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "user_purchases" ALTER COLUMN "purchasedAt" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user_purchases" ADD COLUMN "purchaseData" json NOT NULL;--> statement-breakpoint
ALTER TABLE "user_purchases" ADD COLUMN "isTestPurchase" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "user_purchases" ADD COLUMN "price" integer NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_payments" ADD CONSTRAINT "user_payments_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
