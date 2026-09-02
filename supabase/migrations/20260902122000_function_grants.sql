-- Tighten function grants and search_path after the initial schema.

revoke execute on function public.sync_memorial_owner_id() from public, anon, authenticated;
grant execute on function public.sync_memorial_owner_id() to postgres, service_role;

alter function public.prevent_slug_reassignment() set search_path = public;
alter function public.assert_asset_purge_allowed() set search_path = public;
alter function public.is_admin() set search_path = public;
alter function public.member_role(uuid) set search_path = public;
alter function public.can_view_memorial(uuid) set search_path = public;
alter function public.can_edit_memorial(uuid) set search_path = public;
alter function public.get_published_snapshot(text, text) set search_path = public;
