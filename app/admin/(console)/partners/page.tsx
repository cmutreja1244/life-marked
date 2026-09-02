import { store } from "@/lib/platform/store";
import { adminCreatePartner } from "@/lib/admin/actions";

export default function PartnersPage() {
  return (
    <main>
      <h1 className="font-serif text-3xl">Partners</h1>
      <form action={adminCreatePartner} className="mt-6 flex max-w-xl gap-3">
        <input name="name" required className="input-field" placeholder="Partner name" />
        <button className="btn-primary" type="submit">
          Add
        </button>
      </form>
      <ul className="mt-8 space-y-2">
        {[...store.partners.values()].map((partner) => (
          <li key={partner.id}>{partner.name}</li>
        ))}
      </ul>
    </main>
  );
}
