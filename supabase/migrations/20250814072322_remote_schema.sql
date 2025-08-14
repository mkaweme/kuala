create sequence "public"."favorites_id_seq";

create sequence "public"."messages_id_seq";

create table "public"."bookings" (
    "id" uuid not null default gen_random_uuid(),
    "property_id" uuid,
    "client_id" uuid,
    "booked_at" timestamp with time zone not null default now(),
    "status" text default 'pending'::text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."bookings" enable row level security;

create table "public"."favorites" (
    "id" bigint not null default nextval('favorites_id_seq'::regclass),
    "client_id" uuid,
    "property_id" bigint,
    "created_at" timestamp with time zone default now()
);


alter table "public"."favorites" enable row level security;

create table "public"."messages" (
    "id" bigint not null default nextval('messages_id_seq'::regclass),
    "sender_id" uuid,
    "receiver_id" uuid,
    "property_id" bigint,
    "body" text not null,
    "read" boolean default false,
    "created_at" timestamp with time zone default now()
);


alter table "public"."messages" enable row level security;

create table "public"."profiles" (
    "id" uuid not null,
    "full_name" text,
    "avatar_url" text,
    "role" text not null default 'client'::text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."profiles" enable row level security;

create table "public"."properties" (
    "id" uuid not null default gen_random_uuid(),
    "owner_id" uuid,
    "title" text not null,
    "description" text,
    "price" numeric not null,
    "location" text not null,
    "property_type" text not null,
    "use_type" text not null,
    "is_for_sale" boolean not null default false,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."properties" enable row level security;

create table "public"."property_images" (
    "id" uuid not null default gen_random_uuid(),
    "property_id" uuid,
    "image_url" text not null,
    "created_at" timestamp with time zone default now()
);


alter table "public"."property_images" enable row level security;

create table "public"."viewings" (
    "id" uuid not null default gen_random_uuid(),
    "property_id" uuid,
    "client_id" uuid,
    "scheduled_at" timestamp with time zone not null,
    "status" text default 'pending'::text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."viewings" enable row level security;

alter sequence "public"."favorites_id_seq" owned by "public"."favorites"."id";

alter sequence "public"."messages_id_seq" owned by "public"."messages"."id";

CREATE UNIQUE INDEX bookings_pkey ON public.bookings USING btree (id);

CREATE INDEX favorites_client_id_property_id_idx ON public.favorites USING btree (client_id, property_id);

CREATE UNIQUE INDEX favorites_client_id_property_id_key ON public.favorites USING btree (client_id, property_id);

CREATE UNIQUE INDEX favorites_pkey ON public.favorites USING btree (id);

CREATE UNIQUE INDEX messages_pkey ON public.messages USING btree (id);

CREATE INDEX messages_receiver_id_idx ON public.messages USING btree (receiver_id);

CREATE INDEX messages_sender_id_idx ON public.messages USING btree (sender_id);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

CREATE UNIQUE INDEX properties_pkey ON public.properties USING btree (id);

CREATE UNIQUE INDEX property_images_pkey ON public.property_images USING btree (id);

CREATE UNIQUE INDEX viewings_pkey ON public.viewings USING btree (id);

alter table "public"."bookings" add constraint "bookings_pkey" PRIMARY KEY using index "bookings_pkey";

alter table "public"."favorites" add constraint "favorites_pkey" PRIMARY KEY using index "favorites_pkey";

alter table "public"."messages" add constraint "messages_pkey" PRIMARY KEY using index "messages_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."properties" add constraint "properties_pkey" PRIMARY KEY using index "properties_pkey";

alter table "public"."property_images" add constraint "property_images_pkey" PRIMARY KEY using index "property_images_pkey";

alter table "public"."viewings" add constraint "viewings_pkey" PRIMARY KEY using index "viewings_pkey";

alter table "public"."bookings" add constraint "bookings_client_id_fkey" FOREIGN KEY (client_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."bookings" validate constraint "bookings_client_id_fkey";

alter table "public"."bookings" add constraint "bookings_property_id_fkey" FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE not valid;

alter table "public"."bookings" validate constraint "bookings_property_id_fkey";

alter table "public"."bookings" add constraint "bookings_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'approved'::text, 'declined'::text]))) not valid;

alter table "public"."bookings" validate constraint "bookings_status_check";

alter table "public"."favorites" add constraint "favorites_client_id_property_id_key" UNIQUE using index "favorites_client_id_property_id_key";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

alter table "public"."profiles" add constraint "profiles_role_check" CHECK ((role = ANY (ARRAY['client'::text, 'landlord'::text, 'agent'::text]))) not valid;

alter table "public"."profiles" validate constraint "profiles_role_check";

alter table "public"."properties" add constraint "properties_owner_id_fkey" FOREIGN KEY (owner_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."properties" validate constraint "properties_owner_id_fkey";

alter table "public"."properties" add constraint "properties_property_type_check" CHECK ((property_type = ANY (ARRAY['house'::text, 'office'::text, 'plot'::text, 'farm'::text, 'warehouse'::text, 'other'::text]))) not valid;

alter table "public"."properties" validate constraint "properties_property_type_check";

alter table "public"."properties" add constraint "properties_use_type_check" CHECK ((use_type = ANY (ARRAY['residential'::text, 'commercial'::text]))) not valid;

alter table "public"."properties" validate constraint "properties_use_type_check";

alter table "public"."property_images" add constraint "property_images_property_id_fkey" FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE not valid;

alter table "public"."property_images" validate constraint "property_images_property_id_fkey";

alter table "public"."viewings" add constraint "viewings_client_id_fkey" FOREIGN KEY (client_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."viewings" validate constraint "viewings_client_id_fkey";

alter table "public"."viewings" add constraint "viewings_property_id_fkey" FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE not valid;

alter table "public"."viewings" validate constraint "viewings_property_id_fkey";

alter table "public"."viewings" add constraint "viewings_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'approved'::text, 'declined'::text]))) not valid;

alter table "public"."viewings" validate constraint "viewings_status_check";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.set_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  new.updated_at = now();
  return new;
end;
$function$
;

create policy "Clients can request bookings"
on "public"."bookings"
as permissive
for insert
to public
with check (((auth.uid() = client_id) AND (EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'client'::text))))));


create policy "Clients can view their own booking requests"
on "public"."bookings"
as permissive
for select
to public
using ((auth.uid() = client_id));


create policy "Favorites: clients can manage their own favorites"
on "public"."favorites"
as permissive
for all
to public
using ((auth.uid() = client_id))
with check ((auth.uid() = client_id));


create policy "Messages: participants can select"
on "public"."messages"
as permissive
for select
to public
using (((auth.uid() = sender_id) OR (auth.uid() = receiver_id)));


create policy "Messages: participants can update"
on "public"."messages"
as permissive
for update
to public
using (((auth.uid() = sender_id) OR (auth.uid() = receiver_id)));


create policy "Messages: senders can insert as themselves"
on "public"."messages"
as permissive
for insert
to public
with check ((auth.uid() = sender_id));


create policy "Anyone can view profiles"
on "public"."profiles"
as permissive
for select
to public
using (true);


create policy "Users can update their own profile"
on "public"."profiles"
as permissive
for update
to public
using ((auth.uid() = id));


create policy "Anyone can view properties"
on "public"."properties"
as permissive
for select
to public
using (true);


create policy "Landlords and agents can insert properties"
on "public"."properties"
as permissive
for insert
to public
with check (((auth.uid() = owner_id) AND (EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['landlord'::text, 'agent'::text])))))));


create policy "Owners can delete their own properties"
on "public"."properties"
as permissive
for delete
to public
using ((auth.uid() = owner_id));


create policy "Owners can update their own properties"
on "public"."properties"
as permissive
for update
to public
using ((auth.uid() = owner_id));


create policy "Anyone can view property images"
on "public"."property_images"
as permissive
for select
to public
using (true);


create policy "Only property owner can add images"
on "public"."property_images"
as permissive
for insert
to public
with check ((EXISTS ( SELECT 1
   FROM properties
  WHERE ((properties.id = property_images.property_id) AND (properties.owner_id = auth.uid())))));


create policy "Only property owner can delete images"
on "public"."property_images"
as permissive
for delete
to public
using ((EXISTS ( SELECT 1
   FROM properties
  WHERE ((properties.id = property_images.property_id) AND (properties.owner_id = auth.uid())))));


create policy "Clients can request viewings"
on "public"."viewings"
as permissive
for insert
to public
with check (((auth.uid() = client_id) AND (EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'client'::text))))));


create policy "Clients can view their own viewing requests"
on "public"."viewings"
as permissive
for select
to public
using ((auth.uid() = client_id));


CREATE TRIGGER set_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_properties_updated_at BEFORE UPDATE ON public.properties FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_viewings_updated_at BEFORE UPDATE ON public.viewings FOR EACH ROW EXECUTE FUNCTION set_updated_at();


