import { notFound } from "next/navigation";
import {
  adminAddNote,
  adminChangeSlug,
  adminDisable,
  adminEnable,
  adminInviteOwner,
  adminPublish,
  adminRequestChanges,
  adminRollback,
} from "@/lib/admin/actions";
import { store } from "@/lib/platform/store";
import { qrUrl } from "@/lib/site";

export default async function AdminMemorialDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const memorial = store.getMemorial(id);
  if (!memorial) notFound();
  const versions = store.versions.filter((version) => version.memorialId === id);
  const notes = store.notes.filter((note) => note.memorialId === id);
  const invites = store.invitations.filter((row) => row.memorialId === id);
  const owner = store.members.find((member) => member.memorialId === id && member.role === "owner");

  return (
    <main className="space-y-10">
      <div>
        <h1 className="font-serif text-3xl">{memorial.fullName || "Untitled"}</h1>
        <p className="mt-2 text-sm text-warm-grey">
          {memorial.status} · token {memorial.publicToken} · owner {owner?.userId ?? "none"}
        </p>
        <p className="mt-1 font-mono text-sm">{qrUrl(memorial.publicToken)}</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <a className="btn-primary" href={`/api/qr/${memorial.id}.svg`}>
          Download SVG
        </a>
        <a className="btn-primary" href={`/api/qr/${memorial.id}.png`}>
          PNG
        </a>
        <a className="btn-primary" href={`/api/qr/${memorial.id}.pdf`}>
          Print PDF
        </a>
      </div>

      <form action={adminInviteOwner.bind(null, id)} className="flex max-w-xl gap-3">
        <input name="email" type="email" required className="input-field" placeholder="Owner email" />
        <button className="btn-primary" type="submit">
          Invite owner
        </button>
      </form>
      <ul className="text-sm text-warm-grey">
        {invites.map((invite) => (
          <li key={invite.id}>
            {invite.kind} {invite.email} — /invite/{invite.rawToken}
          </li>
        ))}
      </ul>

      <form action={adminChangeSlug.bind(null, id)} className="flex max-w-xl gap-3">
        <input name="slug" required className="input-field" placeholder="new-slug" />
        <button className="btn-primary" type="submit">
          Add display slug
        </button>
      </form>

      <form action={adminPublish.bind(null, id)}>
        <button className="btn-primary" type="submit">
          Publish snapshot
        </button>
      </form>
      <form action={adminRequestChanges.bind(null, id)} className="max-w-xl space-y-3">
        <textarea name="note" className="input-field h-24" placeholder="Changes requested" />
        <button className="btn-primary" type="submit">
          Request changes
        </button>
      </form>

      <form action={adminRollback.bind(null, id)} className="max-w-xl space-y-3">
        <select name="versionId" className="input-field">
          {versions.map((version) => (
            <option key={version.id} value={version.id}>
              v{version.versionNumber} {version.trigger}
            </option>
          ))}
        </select>
        <button className="btn-primary" type="submit">
          Roll back
        </button>
      </form>

      <div className="flex gap-3">
        <form action={adminDisable.bind(null, id)}>
          <input type="hidden" name="reason" value="ops" />
          <button className="btn-primary" type="submit">
            Disable QR
          </button>
        </form>
        <form action={adminEnable.bind(null, id)}>
          <button className="text-link" type="submit">
            Re-enable
          </button>
        </form>
      </div>

      <form action={adminAddNote.bind(null, id)} className="max-w-xl space-y-3">
        <h2 className="font-serif text-2xl">Internal notes</h2>
        <textarea name="body" className="input-field h-24" />
        <button className="btn-primary" type="submit">
          Add note
        </button>
      </form>
      <ul className="text-sm text-warm-grey">
        {notes.map((note) => (
          <li key={note.id}>{note.body}</li>
        ))}
      </ul>
    </main>
  );
}
