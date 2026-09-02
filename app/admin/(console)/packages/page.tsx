import { store } from "@/lib/platform/store";
import { adminCreatePackage } from "@/lib/admin/actions";

export default function PackagesPage() {
  return (
    <main>
      <h1 className="font-serif text-3xl">Packages</h1>
      <form action={adminCreatePackage} className="mt-6 flex max-w-xl gap-3">
        <input name="name" required className="input-field" placeholder="Package name" />
        <select name="publishingMode" className="input-field">
          <option value="admin_review">Admin review</option>
          <option value="self_publish">Self-publish</option>
        </select>
        <button className="btn-primary" type="submit">
          Add
        </button>
      </form>
      <ul className="mt-8 space-y-2">
        {[...store.packages.values()].map((row) => (
          <li key={row.id}>
            {row.name} — {row.publishingMode}
          </li>
        ))}
      </ul>
    </main>
  );
}
