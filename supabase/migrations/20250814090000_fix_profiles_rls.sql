-- Fix RLS policies for profiles table to allow users to access their own profiles

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view profiles" ON "public"."profiles";
DROP POLICY IF EXISTS "Users can update their own profile" ON "public"."profiles";

-- Create new policies
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON "public"."profiles"
FOR SELECT USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON "public"."profiles"
FOR INSERT WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON "public"."profiles"
FOR UPDATE USING (auth.uid() = id);

-- Users can delete their own profile
CREATE POLICY "Users can delete own profile" ON "public"."profiles"
FOR DELETE USING (auth.uid() = id);

-- Enable RLS if not already enabled
ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;
