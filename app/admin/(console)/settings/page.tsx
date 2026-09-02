export default function AdminSettingsPage() {
  return (
    <main className="max-w-2xl">
      <h1 className="font-serif text-3xl">Settings</h1>
      <ul className="mt-8 space-y-3 text-warm-grey">
        <li>Photos: 200 per memorial, 25MB each</li>
        <li>Audio: 20 clips, 50MB</li>
        <li>Video: 8 clips, 1GB / 10 minutes</li>
        <li>Invite lifetime: 14 days</li>
        <li>Deletion grace: 30 days</li>
        <li>Originals stay in Supabase Storage</li>
      </ul>
    </main>
  );
}
