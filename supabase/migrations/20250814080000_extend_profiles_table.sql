-- Extend profiles table with additional fields for comprehensive user profiles
ALTER TABLE "public"."profiles" 
ADD COLUMN "first_name" text,
ADD COLUMN "last_name" text,
ADD COLUMN "phone" text,
ADD COLUMN "bio" text,
ADD COLUMN "location" text,
ADD COLUMN "preferences" jsonb DEFAULT '{}'::jsonb;

-- Update the role check constraint to include 'tenant'
ALTER TABLE "public"."profiles" DROP CONSTRAINT "profiles_role_check";
ALTER TABLE "public"."profiles" ADD CONSTRAINT "profiles_role_check" 
CHECK (role = ANY (ARRAY['tenant'::text, 'landlord'::text, 'agent'::text]));

-- Add index for better query performance
CREATE INDEX "profiles_user_id_idx" ON "public"."profiles" ("id");

-- Update existing profiles to have default values
UPDATE "public"."profiles" 
SET 
  first_name = COALESCE(first_name, split_part(COALESCE(full_name, ''), ' ', 1)),
  last_name = COALESCE(last_name, CASE 
    WHEN full_name IS NOT NULL AND position(' ' in full_name) > 0 
    THEN substring(full_name from position(' ' in full_name) + 1)
    ELSE ''
  END),
  preferences = COALESCE(preferences, '{}'::jsonb)
WHERE first_name IS NULL OR last_name IS NULL OR preferences IS NULL;
