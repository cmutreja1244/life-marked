import { adminCreateMemorial } from "@/lib/admin/actions";

export default function NewMemorialPage() {
  return (
    <main className="max-w-xl">
      <h1 className="font-serif text-3xl">Create memorial</h1>
      <form action={adminCreateMemorial} className="mt-8 space-y-4">
        <label className="block text-sm">
          Full name
          <input name="fullName" required className="input-field mt-2" />
        </label>
        <label className="block text-sm">
          Web address slug
          <input name="slug" required className="input-field mt-2" placeholder="margaret-campbell" />
        </label>
        <label className="block text-sm">
          Owner email
          <input name="ownerEmail" type="email" className="input-field mt-2" />
        </label>
        <label className="block text-sm">
          Publishing
          <select name="publishingMode" defaultValue="admin_review" className="input-field mt-2">
            <option value="admin_review">Admin review (pilot default)</option>
            <option value="self_publish">Self-publish</option>
          </select>
        </label>
        <button className="btn-primary" type="submit">
          Create and invite
        </button>
      </form>
    </main>
  );
}
