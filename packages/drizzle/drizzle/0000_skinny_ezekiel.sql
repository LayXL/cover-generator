CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"vkId" integer,
	"displayName" text,
	"latestActivity" timestamp with time zone DEFAULT now() NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now(),
	CONSTRAINT "users_vkId_unique" UNIQUE("vkId")
);
