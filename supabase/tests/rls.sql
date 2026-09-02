-- RLS / invariant checks to run after `supabase db reset`
-- Example: psql "$DATABASE_URL" -f supabase/tests/rls.sql

do $$
begin
  -- Anon must not have table-level SELECT on working copy.
  if has_table_privilege('anon', 'public.life_stories', 'select') then
    raise exception 'anon must not SELECT life_stories';
  end if;
  if has_table_privilege('anon', 'public.media_assets', 'select') then
    raise exception 'anon must not SELECT media_assets';
  end if;
  if has_table_privilege('anon', 'public.memorials', 'select') then
    raise exception 'anon must not SELECT memorials';
  end if;
end $$;
