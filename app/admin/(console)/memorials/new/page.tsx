import { adminCreateMemorial } from "@/lib/admin/actions";

export default function NewMemorialPage() {
  return (
    <main className="max-w-xl">
      <h1 className="font-serif text-3xl">Create memorial</h1>
      <p className="mt-3 text-warm-grey">
        This sets up the record, the public web address, and the QR marker code. The family still needs an invite before
        they can write anything.
      </p>
      <form action={adminCreateMemorial} className="mt-8 space-y-6">
        <label className="block text-sm">
          Full name
          <input name="fullName" required className="input-field mt-2" />
        </label>
        <label className="block text-sm">
          Public page ending
          <input name="slug" required className="input-field mt-2" placeholder="margaret-campbell" />
          <span className="mt-2 block text-warm-grey">
            The live page will be lifemarked.co.uk/m/this-ending. Use lowercase letters, numbers, and hyphens.
          </span>
        </label>
        <label className="block text-sm">
          Family email (optional)
          <input name="ownerEmail" type="email" className="input-field mt-2" />
          <span className="mt-2 block text-warm-grey">
            If you add an email, we send them an invite to write the memorial. You can also invite them later.
          </span>
        </label>
        <label className="block text-sm">
          Who can make it live
          <select name="publishingMode" defaultValue="admin_review" className="input-field mt-2">
            <option value="admin_review">Only LifeMarked staff (usual for the pilot)</option>
            <option value="self_publish">The family can make it live themselves</option>
          </select>
        </label>
        <button className="btn-primary" type="submit">
          Create memorial
        </button>
      </form>
    </main>
  );
}
