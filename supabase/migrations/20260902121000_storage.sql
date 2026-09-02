-- Storage policies for memorial originals (private) and public derivatives.

drop policy if exists memorials_originals_select on storage.objects;
drop policy if exists memorials_originals_insert on storage.objects;
drop policy if exists memorials_originals_update on storage.objects;
drop policy if exists memorials_originals_delete on storage.objects;
drop policy if exists memorials_public_select on storage.objects;
drop policy if exists memorials_public_insert on storage.objects;
drop policy if exists memorials_public_update on storage.objects;
drop policy if exists memorials_public_delete on storage.objects;

create policy memorials_originals_select
  on storage.objects for select to authenticated
  using (bucket_id = 'memorials-originals');

create policy memorials_originals_insert
  on storage.objects for insert to authenticated
  with check (bucket_id = 'memorials-originals');

create policy memorials_originals_update
  on storage.objects for update to authenticated
  using (bucket_id = 'memorials-originals')
  with check (bucket_id = 'memorials-originals');

create policy memorials_originals_delete
  on storage.objects for delete to authenticated
  using (bucket_id = 'memorials-originals');

create policy memorials_public_select
  on storage.objects for select to public
  using (bucket_id = 'memorials-public');

create policy memorials_public_insert
  on storage.objects for insert to authenticated
  with check (bucket_id = 'memorials-public');

create policy memorials_public_update
  on storage.objects for update to authenticated
  using (bucket_id = 'memorials-public')
  with check (bucket_id = 'memorials-public');

create policy memorials_public_delete
  on storage.objects for delete to authenticated
  using (bucket_id = 'memorials-public');
