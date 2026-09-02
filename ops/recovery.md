# Recovery runbook

## Objectives

- Database: RPO 1 hour (Supabase PITR). RTO 4 hours to a restored project.
- Original media: Supabase Storage on the same project. RTO 8 hours to restore objects from a Storage backup or a new project restore.
- Accidental deletion: 30-day application grace before physical purge.

## Quarterly database drill

1. Note the production project ref (`wpbatwiruatunvzqgcae`) and the PITR window.
2. Restore to a new Supabase project at a timestamp about 1 hour ago.
3. Confirm `memorials.public_token`, `memorial_routes`, and `publication_versions` row counts.
4. Confirm `get_published_snapshot('margaret-campbell')` returns the live snapshot.
5. Record elapsed time against the 4-hour RTO.

## Quarterly original-media drill

1. Pick a random `media_assets` row with `status = ready`.
2. Confirm the object exists in the `memorials-originals` bucket.
3. Compare SHA-256 to `media_assets.sha256`.
4. Copy the object to a staging prefix and confirm it can replace the live key.
5. Record elapsed time against the 8-hour RTO.

## If Supabase Storage is down

Public pages that already have CDN-cached derivatives may still render. New uploads wait until Storage is back. Restore from PITR or a Storage backup; do not introduce a second object store.
