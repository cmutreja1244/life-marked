-- LifeMarked production schema
-- Private schema holds SECURITY DEFINER functions (not exposed via PostgREST).

create extension if not exists pgcrypto;
create extension if not exists pg_trgm;
create extension if not exists citext;

create schema if not exists app_private;
revoke all on schema app_private from public;
grant usage on schema app_private to postgres, service_role;

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
do $$ begin
  create type public.admin_role as enum ('super_admin', 'operations');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.member_role as enum ('owner', 'editor', 'viewer');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.memorial_status as enum (
    'draft', 'owner_invited', 'in_progress', 'in_review',
    'changes_requested', 'published', 'archived', 'disabled'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.visibility as enum ('unlisted', 'public', 'private');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.publishing_mode as enum ('admin_review', 'self_publish');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.invitation_kind as enum ('owner', 'collaborator');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.media_kind as enum ('image', 'audio', 'video', 'caption');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.media_status as enum (
    'awaiting_upload', 'uploaded', 'scanning', 'quarantined',
    'processing', 'ready', 'failed', 'deleted'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.contribution_status as enum ('pending', 'approved', 'rejected');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.section_key as enum (
    'hero', 'story', 'timeline', 'gallery', 'favourites',
    'memories', 'voice', 'video', 'places', 'close'
  );
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- Profiles
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete restrict,
  display_name text,
  email citext,
  is_admin boolean not null default false,
  admin_role public.admin_role,
  tos_accepted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

-- ---------------------------------------------------------------------------
-- Partners / packages
-- ---------------------------------------------------------------------------
create table public.partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.partner_branches (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references public.partners (id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create table public.packages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  publishing_mode public.publishing_mode not null default 'admin_review',
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Memorials
-- ---------------------------------------------------------------------------
create table public.memorials (
  id uuid primary key default gen_random_uuid(),
  public_token text not null unique,
  owner_id uuid references public.profiles (id),
  partner_id uuid references public.partners (id),
  package_id uuid references public.packages (id),
  first_name text not null default '',
  full_name text not null default '',
  birth jsonb not null default '{}'::jsonb,
  death jsonb not null default '{}'::jsonb,
  opening_line text not null default '',
  intro text not null default '',
  closing_heading text not null default '',
  closing_text text not null default '',
  pull_quote text not null default '',
  hero_asset_id uuid,
  hero_image_alt text not null default '',
  hero_focal_x numeric,
  hero_focal_y numeric,
  status public.memorial_status not null default 'draft',
  visibility public.visibility not null default 'unlisted',
  publishing_mode public.publishing_mode not null default 'admin_review',
  index_opt_in boolean not null default false,
  is_demo boolean not null default false,
  referral_source text,
  published_version_id uuid,
  published_at timestamptz,
  marker_status text not null default 'unassigned',
  scan_count integer not null default 0,
  last_scanned_at timestamptz,
  disabled_at timestamptz,
  disabled_internal_reason text,
  deleted_at timestamptz,
  purge_after timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint public_token_crockford check (public_token ~ '^[0-9A-HJKMNP-TV-Z]{10}$')
);

create unique index memorials_public_token_idx on public.memorials (public_token);
create index memorials_status_updated_idx on public.memorials (status, updated_at desc);
create index memorials_partner_idx on public.memorials (partner_id);
create index memorials_owner_idx on public.memorials (owner_id);
create index memorials_full_name_trgm on public.memorials using gin (full_name gin_trgm_ops);

create table public.memorial_members (
  id uuid primary key default gen_random_uuid(),
  memorial_id uuid not null references public.memorials (id) on delete cascade,
  user_id uuid not null references public.profiles (id),
  role public.member_role not null,
  created_at timestamptz not null default now(),
  unique (memorial_id, user_id)
);

create unique index memorial_members_one_owner
  on public.memorial_members (memorial_id)
  where role = 'owner';

create table public.memorial_routes (
  slug text primary key,
  memorial_id uuid not null references public.memorials (id) on delete restrict,
  is_canonical boolean not null default true,
  created_at timestamptz not null default now()
);

create unique index memorial_routes_one_canonical
  on public.memorial_routes (memorial_id)
  where is_canonical;

-- Slug rows are permanent: never retarget memorial_id.
create or replace function public.prevent_slug_reassignment()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'DELETE' then
    raise exception 'memorial_routes rows cannot be deleted';
  end if;
  if tg_op = 'UPDATE' and new.memorial_id is distinct from old.memorial_id then
    raise exception 'memorial_routes.memorial_id cannot be reassigned';
  end if;
  if tg_op = 'UPDATE' and new.slug is distinct from old.slug then
    raise exception 'memorial_routes.slug cannot be changed';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_prevent_slug_reassignment on public.memorial_routes;
create trigger trg_prevent_slug_reassignment
  before update or delete on public.memorial_routes
  for each row execute function public.prevent_slug_reassignment();

create or replace function public.sync_memorial_owner_id()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_memorial_id uuid;
  v_owner uuid;
begin
  v_memorial_id := coalesce(new.memorial_id, old.memorial_id);
  select user_id into v_owner
  from public.memorial_members
  where memorial_id = v_memorial_id and role = 'owner';

  update public.memorials
  set owner_id = v_owner, updated_at = now()
  where id = v_memorial_id;

  if exists (
    select 1 from public.memorials
    where id = v_memorial_id
      and status not in ('draft', 'owner_invited')
      and owner_id is null
  ) then
    raise exception 'An accepted memorial must have exactly one owner';
  end if;

  return coalesce(new, old);
end;
$$;

drop trigger if exists trg_sync_memorial_owner_id on public.memorial_members;
create trigger trg_sync_memorial_owner_id
  after insert or update or delete on public.memorial_members
  for each row execute function public.sync_memorial_owner_id();

revoke update (owner_id) on public.memorials from authenticated, anon;

-- ---------------------------------------------------------------------------
-- Invitations vs contribution links
-- ---------------------------------------------------------------------------
create table public.memorial_invitations (
  id uuid primary key default gen_random_uuid(),
  memorial_id uuid not null references public.memorials (id) on delete cascade,
  email citext not null,
  kind public.invitation_kind not null,
  collaborator_role public.member_role,
  token_hash text not null unique,
  expires_at timestamptz not null,
  accepted_at timestamptz,
  revoked_at timestamptz,
  invited_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

create table public.contribution_links (
  id uuid primary key default gen_random_uuid(),
  memorial_id uuid not null references public.memorials (id) on delete cascade,
  created_by uuid references public.profiles (id),
  token_hash text not null unique,
  expires_at timestamptz not null,
  revoked_at timestamptz,
  reusable boolean not null default false,
  max_submissions integer not null default 1,
  submission_count integer not null default 0,
  allowed_kinds text[] not null default array['memory']::text[],
  invitee_email citext,
  require_email boolean not null default false,
  created_at timestamptz not null default now(),
  constraint contribution_caps check (submission_count >= 0 and submission_count <= max_submissions)
);

create table public.contributions (
  id uuid primary key default gen_random_uuid(),
  memorial_id uuid not null references public.memorials (id) on delete cascade,
  contribution_link_id uuid not null references public.contribution_links (id),
  kind text not null,
  payload jsonb not null default '{}'::jsonb,
  status public.contribution_status not null default 'pending',
  submitter_name text,
  submitter_email citext,
  reviewed_by uuid references public.profiles (id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Working-copy content
-- ---------------------------------------------------------------------------
create table public.memorial_sections (
  id uuid primary key default gen_random_uuid(),
  memorial_id uuid not null references public.memorials (id) on delete cascade,
  section_key public.section_key not null,
  enabled boolean not null default true,
  sort_order integer not null default 0,
  unique (memorial_id, section_key)
);

create table public.life_stories (
  memorial_id uuid primary key references public.memorials (id) on delete cascade,
  document jsonb not null default '{"type":"doc","content":[{"type":"paragraph"}]}'::jsonb,
  pull_quote text not null default '',
  updated_at timestamptz not null default now()
);

create table public.timeline_items (
  id uuid primary key default gen_random_uuid(),
  memorial_id uuid not null references public.memorials (id) on delete cascade,
  year text not null default '',
  title text not null default '',
  detail text not null default '',
  sort_order integer not null default 0
);

create table public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  memorial_id uuid not null references public.memorials (id) on delete cascade,
  asset_id uuid,
  alt_text text not null default '',
  caption text not null default '',
  layout text not null default 'standard',
  sort_order integer not null default 0
);

create table public.story_images (
  id uuid primary key default gen_random_uuid(),
  memorial_id uuid not null references public.memorials (id) on delete cascade,
  asset_id uuid,
  alt_text text not null default '',
  caption text not null default '',
  sort_order integer not null default 0
);

create table public.memories (
  id uuid primary key default gen_random_uuid(),
  memorial_id uuid not null references public.memorials (id) on delete cascade,
  quote text not null default '',
  author text not null default '',
  status public.contribution_status not null default 'approved',
  sort_order integer not null default 0
);

create table public.favourites (
  id uuid primary key default gen_random_uuid(),
  memorial_id uuid not null references public.memorials (id) on delete cascade,
  label text not null,
  sort_order integer not null default 0
);

create table public.audio_clips (
  id uuid primary key default gen_random_uuid(),
  memorial_id uuid not null references public.memorials (id) on delete cascade,
  asset_id uuid,
  image_asset_id uuid,
  label text not null default 'Voice memory',
  title text not null default '',
  recorded text not null default '',
  supporting_text text not null default '',
  image_alt text not null default ''
);

create table public.video_clips (
  id uuid primary key default gen_random_uuid(),
  memorial_id uuid not null references public.memorials (id) on delete cascade,
  asset_id uuid,
  poster_asset_id uuid,
  caption_vtt_asset_id uuid,
  title text not null default ''
);

create table public.places (
  id uuid primary key default gen_random_uuid(),
  memorial_id uuid not null references public.memorials (id) on delete cascade,
  heading text not null default '',
  location text not null default '',
  body text not null default '',
  asset_id uuid,
  image_alt text not null default '',
  caption text not null default '',
  sort_order integer not null default 0
);

create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  memorial_id uuid not null references public.memorials (id) on delete cascade,
  kind public.media_kind not null,
  status public.media_status not null default 'awaiting_upload',
  original_bucket text not null default 'memorials-originals',
  original_key text,
  public_prefix text,
  mime_verified boolean not null default false,
  detected_mime text,
  byte_size bigint,
  sha256 text,
  width integer,
  height integer,
  duration_ms integer,
  focal_x numeric,
  focal_y numeric,
  alt_text text not null default '',
  caption text not null default '',
  exif_stripped_at timestamptz,
  waveform_json jsonb,
  quarantine_reason text,
  scan_result text,
  scan_engine text,
  scanned_at timestamptz,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  purge_after timestamptz
);

create index media_assets_lookup_idx
  on public.media_assets (memorial_id, kind, status, deleted_at);

alter table public.memorials
  add constraint memorials_hero_asset_fk
  foreign key (hero_asset_id) references public.media_assets (id);

alter table public.gallery_items
  add constraint gallery_items_asset_fk
  foreign key (asset_id) references public.media_assets (id);

alter table public.story_images
  add constraint story_images_asset_fk
  foreign key (asset_id) references public.media_assets (id);

-- ---------------------------------------------------------------------------
-- Publishing
-- ---------------------------------------------------------------------------
create table public.publication_versions (
  id uuid primary key default gen_random_uuid(),
  memorial_id uuid not null references public.memorials (id) on delete cascade,
  version_number integer not null,
  snapshot jsonb not null,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  trigger text not null default 'admin_publish',
  unique (memorial_id, version_number)
);

create table public.publication_version_assets (
  publication_version_id uuid not null references public.publication_versions (id) on delete cascade,
  asset_id uuid not null references public.media_assets (id),
  primary key (publication_version_id, asset_id)
);

alter table public.memorials
  add constraint memorials_published_version_fk
  foreign key (published_version_id) references public.publication_versions (id);

create or replace function public.assert_asset_purge_allowed()
returns trigger
language plpgsql
as $$
begin
  if old.deleted_at is not null and new.original_key is null and old.original_key is not null then
    if exists (
      select 1 from public.publication_version_assets pva
      where pva.asset_id = old.id
    ) then
      raise exception 'Cannot physically purge an asset referenced by a publication version';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_assert_asset_purge_allowed on public.media_assets;
create trigger trg_assert_asset_purge_allowed
  before update on public.media_assets
  for each row execute function public.assert_asset_purge_allowed();

-- ---------------------------------------------------------------------------
-- Admin / privacy
-- ---------------------------------------------------------------------------
create table public.audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles (id),
  memorial_id uuid references public.memorials (id),
  action text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.internal_notes (
  id uuid primary key default gen_random_uuid(),
  memorial_id uuid not null references public.memorials (id) on delete cascade,
  author_id uuid references public.profiles (id),
  body text not null,
  created_at timestamptz not null default now()
);

create table public.content_reports (
  id uuid primary key default gen_random_uuid(),
  memorial_id uuid references public.memorials (id),
  public_token text,
  body text not null,
  reporter_email citext,
  status text not null default 'open',
  created_at timestamptz not null default now()
);

create table public.system_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create table public.export_jobs (
  id uuid primary key default gen_random_uuid(),
  memorial_id uuid not null references public.memorials (id) on delete cascade,
  requested_by uuid references public.profiles (id),
  status text not null default 'queued',
  download_path text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((
    select p.is_admin from public.profiles p where p.id = auth.uid() and p.deleted_at is null
  ), false);
$$;

create or replace function public.member_role(p_memorial_id uuid)
returns public.member_role
language sql
stable
security definer
set search_path = public
as $$
  select m.role
  from public.memorial_members m
  where m.memorial_id = p_memorial_id and m.user_id = auth.uid()
  limit 1;
$$;

create or replace function public.can_view_memorial(p_memorial_id uuid)
returns boolean
language sql
stable
as $$
  select public.is_admin() or public.member_role(p_memorial_id) is not null;
$$;

create or replace function public.can_edit_memorial(p_memorial_id uuid)
returns boolean
language sql
stable
as $$
  select public.is_admin() or public.member_role(p_memorial_id) in ('owner', 'editor');
$$;

-- Move is_admin / member helpers to app_private to avoid exposing definer in public.
-- Keep thin invoker wrappers in public for policies.

create or replace function app_private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((
    select p.is_admin from public.profiles p where p.id = auth.uid() and p.deleted_at is null
  ), false);
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security invoker
as $$
  select app_private.is_admin();
$$;

create or replace function app_private.member_role(p_memorial_id uuid)
returns public.member_role
language sql
stable
security definer
set search_path = public
as $$
  select m.role
  from public.memorial_members m
  where m.memorial_id = p_memorial_id and m.user_id = auth.uid()
  limit 1;
$$;

create or replace function public.member_role(p_memorial_id uuid)
returns public.member_role
language sql
stable
security invoker
as $$
  select app_private.member_role(p_memorial_id);
$$;

-- ---------------------------------------------------------------------------
-- Published snapshot (the only public read path)
-- ---------------------------------------------------------------------------
create or replace function app_private.get_published_snapshot(p_slug text default null, p_token text default null)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_memorial public.memorials%rowtype;
  v_route public.memorial_routes%rowtype;
  v_version public.publication_versions%rowtype;
  v_is_member boolean;
begin
  if p_token is not null then
    select * into v_memorial from public.memorials where public_token = p_token;
  elsif p_slug is not null then
    select * into v_route from public.memorial_routes where slug = p_slug;
    if not found then
      return null;
    end if;
    select * into v_memorial from public.memorials where id = v_route.memorial_id;
  else
    return null;
  end if;

  if not found or v_memorial.deleted_at is not null then
    return null;
  end if;

  v_is_member := app_private.member_role(v_memorial.id) is not null or app_private.is_admin();

  if v_memorial.visibility = 'private' and not v_is_member then
    return null;
  end if;

  if v_memorial.status is distinct from 'published' then
    if v_memorial.disabled_at is not null and v_memorial.visibility <> 'private' then
      return jsonb_build_object('unavailable', true, 'memorial_id', v_memorial.id);
    end if;
    return null;
  end if;

  if v_memorial.disabled_at is not null then
    return jsonb_build_object('unavailable', true, 'memorial_id', v_memorial.id, 'visibility', v_memorial.visibility);
  end if;

  select * into v_version from public.publication_versions where id = v_memorial.published_version_id;
  if not found then
    return null;
  end if;

  return jsonb_build_object(
    'unavailable', false,
    'snapshot', v_version.snapshot,
    'is_demo', v_memorial.is_demo,
    'visibility', v_memorial.visibility,
    'indexable', (v_memorial.visibility = 'public' and v_memorial.index_opt_in and not v_memorial.is_demo),
    'canonical_slug', (
      select slug from public.memorial_routes
      where memorial_id = v_memorial.id and is_canonical
      limit 1
    ),
    'requested_slug', p_slug,
    'public_token', v_memorial.public_token
  );
end;
$$;

create or replace function public.get_published_snapshot(p_slug text default null, p_token text default null)
returns jsonb
language sql
stable
security invoker
as $$
  select app_private.get_published_snapshot(p_slug, p_token);
$$;

grant execute on function public.get_published_snapshot(text, text) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.partners enable row level security;
alter table public.partner_branches enable row level security;
alter table public.packages enable row level security;
alter table public.memorials enable row level security;
alter table public.memorial_members enable row level security;
alter table public.memorial_routes enable row level security;
alter table public.memorial_invitations enable row level security;
alter table public.contribution_links enable row level security;
alter table public.contributions enable row level security;
alter table public.memorial_sections enable row level security;
alter table public.life_stories enable row level security;
alter table public.timeline_items enable row level security;
alter table public.gallery_items enable row level security;
alter table public.story_images enable row level security;
alter table public.memories enable row level security;
alter table public.favourites enable row level security;
alter table public.audio_clips enable row level security;
alter table public.video_clips enable row level security;
alter table public.places enable row level security;
alter table public.media_assets enable row level security;
alter table public.publication_versions enable row level security;
alter table public.publication_version_assets enable row level security;
alter table public.audit_events enable row level security;
alter table public.internal_notes enable row level security;
alter table public.content_reports enable row level security;
alter table public.system_settings enable row level security;
alter table public.export_jobs enable row level security;

revoke all on table public.life_stories from anon;
revoke all on table public.timeline_items from anon;
revoke all on table public.gallery_items from anon;
revoke all on table public.story_images from anon;
revoke all on table public.memories from anon;
revoke all on table public.favourites from anon;
revoke all on table public.audio_clips from anon;
revoke all on table public.video_clips from anon;
revoke all on table public.places from anon;
revoke all on table public.memorial_sections from anon;
revoke all on table public.media_assets from anon;
revoke all on table public.memorials from anon;
revoke all on table public.publication_versions from anon;
revoke all on table public.publication_version_assets from anon;
revoke all on table public.memorial_invitations from anon;
revoke all on table public.contribution_links from anon;
revoke all on table public.contributions from anon;
revoke all on table public.internal_notes from anon;
revoke all on table public.audit_events from anon;
revoke all on table public.partners from anon;
revoke all on table public.packages from anon;
revoke all on table public.system_settings from anon;

-- profiles
create policy profiles_self_select on public.profiles
  for select to authenticated
  using (id = auth.uid() or public.is_admin());

create policy profiles_self_update on public.profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid() and is_admin is not true);

-- memorials: no anon select
create policy memorials_member_select on public.memorials
  for select to authenticated
  using (public.can_view_memorial(id));

create policy memorials_admin_insert on public.memorials
  for insert to authenticated
  with check (public.is_admin());

create policy memorials_member_update on public.memorials
  for update to authenticated
  using (public.can_edit_memorial(id))
  with check (public.can_edit_memorial(id));

-- members
create policy members_select on public.memorial_members
  for select to authenticated
  using (public.can_view_memorial(memorial_id));

create policy members_manage on public.memorial_members
  for all to authenticated
  using (public.is_admin() or public.member_role(memorial_id) = 'owner')
  with check (public.is_admin() or public.member_role(memorial_id) = 'owner');

-- routes: members can read their slugs (public pages use the definer function)
create policy routes_member_select on public.memorial_routes
  for select to authenticated
  using (public.can_view_memorial(memorial_id));

create policy routes_admin_write on public.memorial_routes
  for insert to authenticated
  with check (public.is_admin() or public.member_role(memorial_id) = 'owner');

create policy routes_canonical_update on public.memorial_routes
  for update to authenticated
  using (public.is_admin() or public.member_role(memorial_id) = 'owner')
  with check (public.is_admin() or public.member_role(memorial_id) = 'owner');

-- invitations / contribution links
create policy invitations_owner on public.memorial_invitations
  for all to authenticated
  using (public.is_admin() or public.member_role(memorial_id) = 'owner')
  with check (public.is_admin() or public.member_role(memorial_id) = 'owner');

create policy contribution_links_owner on public.contribution_links
  for all to authenticated
  using (public.is_admin() or public.member_role(memorial_id) = 'owner')
  with check (public.is_admin() or public.member_role(memorial_id) = 'owner');

create policy contributions_member on public.contributions
  for select to authenticated
  using (public.can_view_memorial(memorial_id));

create policy contributions_review on public.contributions
  for update to authenticated
  using (public.can_edit_memorial(memorial_id))
  with check (public.can_edit_memorial(memorial_id));

-- working tables: viewers may SELECT (preview) but not mutate
create policy life_stories_select on public.life_stories
  for select to authenticated using (public.can_view_memorial(memorial_id));
create policy life_stories_write on public.life_stories
  for all to authenticated
  using (public.can_edit_memorial(memorial_id))
  with check (public.can_edit_memorial(memorial_id));

create policy timeline_select on public.timeline_items
  for select to authenticated using (public.can_view_memorial(memorial_id));
create policy timeline_write on public.timeline_items
  for all to authenticated
  using (public.can_edit_memorial(memorial_id))
  with check (public.can_edit_memorial(memorial_id));

create policy gallery_select on public.gallery_items
  for select to authenticated using (public.can_view_memorial(memorial_id));
create policy gallery_write on public.gallery_items
  for all to authenticated
  using (public.can_edit_memorial(memorial_id))
  with check (public.can_edit_memorial(memorial_id));

create policy story_images_select on public.story_images
  for select to authenticated using (public.can_view_memorial(memorial_id));
create policy story_images_write on public.story_images
  for all to authenticated
  using (public.can_edit_memorial(memorial_id))
  with check (public.can_edit_memorial(memorial_id));

create policy memories_select on public.memories
  for select to authenticated using (public.can_view_memorial(memorial_id));
create policy memories_write on public.memories
  for all to authenticated
  using (public.can_edit_memorial(memorial_id))
  with check (public.can_edit_memorial(memorial_id));

create policy favourites_select on public.favourites
  for select to authenticated using (public.can_view_memorial(memorial_id));
create policy favourites_write on public.favourites
  for all to authenticated
  using (public.can_edit_memorial(memorial_id))
  with check (public.can_edit_memorial(memorial_id));

create policy audio_select on public.audio_clips
  for select to authenticated using (public.can_view_memorial(memorial_id));
create policy audio_write on public.audio_clips
  for all to authenticated
  using (public.can_edit_memorial(memorial_id))
  with check (public.can_edit_memorial(memorial_id));

create policy video_select on public.video_clips
  for select to authenticated using (public.can_view_memorial(memorial_id));
create policy video_write on public.video_clips
  for all to authenticated
  using (public.can_edit_memorial(memorial_id))
  with check (public.can_edit_memorial(memorial_id));

create policy places_select on public.places
  for select to authenticated using (public.can_view_memorial(memorial_id));
create policy places_write on public.places
  for all to authenticated
  using (public.can_edit_memorial(memorial_id))
  with check (public.can_edit_memorial(memorial_id));

create policy sections_select on public.memorial_sections
  for select to authenticated using (public.can_view_memorial(memorial_id));
create policy sections_write on public.memorial_sections
  for all to authenticated
  using (public.can_edit_memorial(memorial_id))
  with check (public.can_edit_memorial(memorial_id));

create policy media_select on public.media_assets
  for select to authenticated using (public.can_view_memorial(memorial_id));
create policy media_write on public.media_assets
  for all to authenticated
  using (public.can_edit_memorial(memorial_id))
  with check (public.can_edit_memorial(memorial_id));

create policy publication_versions_select on public.publication_versions
  for select to authenticated
  using (public.can_view_memorial(memorial_id));

create policy publication_versions_insert on public.publication_versions
  for insert to authenticated
  with check (public.can_edit_memorial(memorial_id) or public.is_admin());

create policy publication_assets_select on public.publication_version_assets
  for select to authenticated
  using (
    exists (
      select 1 from public.publication_versions v
      where v.id = publication_version_id and public.can_view_memorial(v.memorial_id)
    )
  );

create policy admin_partners on public.partners
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy admin_branches on public.partner_branches
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy admin_packages on public.packages
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy admin_notes on public.internal_notes
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy admin_audit on public.audit_events
  for select to authenticated
  using (public.is_admin());

create policy admin_settings on public.system_settings
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy reports_insert_anon on public.content_reports
  for insert to anon, authenticated
  with check (true);

create policy reports_admin on public.content_reports
  for select to authenticated
  using (public.is_admin());

create policy export_jobs_member on public.export_jobs
  for all to authenticated
  using (public.can_view_memorial(memorial_id))
  with check (public.can_view_memorial(memorial_id));

insert into public.system_settings (key, value)
values
  ('upload_limits', '{"photos":200,"audio":20,"video":8,"image_mb":25,"audio_mb":50,"video_gb":1}'::jsonb),
  ('invite_ttl_days', '14'::jsonb),
  ('deletion_grace_days', '30'::jsonb)
on conflict (key) do nothing;

insert into public.packages (id, name, publishing_mode)
values ('00000000-0000-4000-8000-000000000001', 'Pilot', 'admin_review')
on conflict (id) do nothing;
