# Security review notes

Pre-production checks (not a substitute for a paid review):

- [ ] Anon cannot SELECT working-copy tables (`life_stories`, `media_assets`, …). Public HTML comes only from `get_published_snapshot`.
- [ ] Private memorials: unauthenticated `/m` and `/q` return the same 404 as an unknown URL. No OG person data.
- [ ] Invite and contribution tokens are hashed at rest. Raw tokens only in email/links.
- [ ] Admin without TOTP (`aal2`) cannot open `/admin`.
- [ ] `owner_id` is trigger-maintained; application code does not write it.
- [ ] Slugs in `memorial_routes` cannot be reassigned to another memorial.
- [ ] Uploads: extension allowlist, in-process EICAR/MIME check, quarantine, no VirusTotal.
- [ ] Snapshots include only `ready` assets. Physical purge blocked while `publication_version_assets` exists.
- [ ] Service role key is never `NEXT_PUBLIC_*`.
- [ ] CSP, HSTS, nosniff, frame-ancestors none, camera/mic only on editor and contribution routes.
