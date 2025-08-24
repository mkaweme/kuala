-- Add foreign key constraints to viewings table
-- Add foreign key constraint for client_id
ALTER TABLE public.viewings 
ADD CONSTRAINT viewings_client_id_fkey 
FOREIGN KEY (client_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add foreign key constraint for property_id
ALTER TABLE public.viewings 
ADD CONSTRAINT viewings_property_id_fkey 
FOREIGN KEY (property_id) REFERENCES public.properties(id) ON DELETE CASCADE;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS viewings_client_id_idx ON public.viewings USING btree (client_id);
CREATE INDEX IF NOT EXISTS viewings_property_id_idx ON public.viewings USING btree (property_id);
CREATE INDEX IF NOT EXISTS viewings_status_idx ON public.viewings USING btree (status);
CREATE INDEX IF NOT EXISTS viewings_scheduled_at_idx ON public.viewings USING btree (scheduled_at);
