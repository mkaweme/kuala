-- Fix favorites table property_id type to match properties table
-- Drop existing constraints and indexes
DROP INDEX IF EXISTS favorites_client_id_property_id_idx;
DROP INDEX IF EXISTS favorites_client_id_property_id_key;

-- Alter the property_id column type from bigint to uuid
ALTER TABLE public.favorites 
ALTER COLUMN property_id TYPE uuid USING property_id::text::uuid;

-- Recreate the indexes with correct types
CREATE INDEX favorites_client_id_property_id_idx ON public.favorites USING btree (client_id, property_id);
CREATE UNIQUE INDEX favorites_client_id_property_id_key ON public.favorites USING btree (client_id, property_id);

-- Add foreign key constraint
ALTER TABLE public.favorites 
ADD CONSTRAINT favorites_property_id_fkey 
FOREIGN KEY (property_id) REFERENCES public.properties(id) ON DELETE CASCADE;

-- Add foreign key constraint for client_id
ALTER TABLE public.favorites 
ADD CONSTRAINT favorites_client_id_fkey 
FOREIGN KEY (client_id) REFERENCES auth.users(id) ON DELETE CASCADE;
