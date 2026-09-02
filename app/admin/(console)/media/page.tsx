import { store } from "@/lib/platform/store";
import { adminRetryMedia } from "@/lib/admin/actions";

export default function AdminMediaPage() {
  const assets = [...store.media.values()].filter((asset) =>
    ["scanning", "quarantined", "failed"].includes(asset.status),
  );
  return (
    <main>
      <h1 className="font-serif text-3xl">Media</h1>
      <table className="mt-8 w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border-warm text-warm-grey">
            <th className="py-2">Asset</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset) => (
            <tr key={asset.id} className="border-b border-border-warm">
              <td className="py-3 font-mono">{asset.id.slice(0, 8)}</td>
              <td>{asset.status}</td>
              <td>
                <form action={adminRetryMedia.bind(null, asset.id)}>
                  <button className="text-link" type="submit">
                    Retry
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
