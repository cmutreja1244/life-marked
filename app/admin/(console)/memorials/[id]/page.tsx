import Link from "next/link";
import {
  adminAddNote,
  adminChangeSlug,
  adminDisable,
  adminEnable,
  adminInviteOwner,
  adminPublish,
  adminRequestChanges,
  adminResendInvite,
  adminRevokeInvite,
  adminRollback,
} from "@/lib/admin/actions";
import { noticeFromQuery } from "@/lib/admin/notices";
import { ConfirmSubmit } from "@/components/admin/ConfirmSubmit";
import { adminStatusLabel, versionReasonLabel } from "@/lib/platform/lifecycle";
import { store } from "@/lib/platform/store";
import { CANONICAL_ORIGIN, memorialUrl, qrUrl } from "@/lib/site";
import { notFound } from "next/navigation";

function formatWhen(iso: string) {
  return new Date(iso).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });
}

export default async function AdminMemorialDetail({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ done?: string }>;
}) {
  const { id } = await params;
  const { done } = await searchParams;
  const memorial = store.getMemorial(id);
  if (!memorial) notFound();

  const versions = store.versions
    .filter((version) => version.memorialId === id)
    .slice()
    .sort((a, b) => b.versionNumber - a.versionNumber);
  const notes = store.notes
    .filter((note) => note.memorialId === id)
    .slice()
    .reverse();
  const invites = store.invitations.filter((row) => row.memorialId === id);
  const owner = store.members.find((member) => member.memorialId === id && member.role === "owner");
  const ownerProfile = owner ? store.profiles.get(owner.userId) : null;
  const routes = store.routes.filter((route) => route.memorialId === id);
  const canonical = routes.find((route) => route.isCanonical);
  const liveVersion = versions.find((version) => version.id === memorial.publishedVersionId) ?? null;
  const publicPath = canonical ? memorialUrl(canonical.slug) : null;
  const editorHref = `/memorials/${memorial.id}/about`;
  const previewHref = `/preview/${memorial.id}`;
  const markerHref = qrUrl(memorial.publicToken);
  const notice = noticeFromQuery(done);
  const isHidden = Boolean(memorial.disabledAt) || memorial.status === "disabled" || memorial.status === "archived";
  const familyCanPublish = memorial.publishingMode === "self_publish";

  const visitorSees = isHidden
    ? "Visitors currently see that this memorial is unavailable."
    : liveVersion
      ? `Visitors currently see version ${liveVersion.versionNumber} (the last one made live). Edits in the draft are not public until you make a new version live.`
      : "There is no live page yet. QR scans will not show a memorial until you make a version live.";

  return (
    <main className="max-w-3xl space-y-8">
      <div>
        <p className="text-sm">
          <Link href="/admin/memorials" className="text-link">
            All memorials
          </Link>
        </p>
        <h1 className="mt-3 font-serif text-4xl">{memorial.fullName || "Untitled memorial"}</h1>
        <p className="mt-3 text-lg">{adminStatusLabel(memorial.status)}</p>
        <p className="mt-2 text-warm-grey">{visitorSees}</p>
        {memorial.isDemo ? (
          <p className="mt-3 rounded-lg border border-border-warm bg-ivory px-4 py-3 text-sm text-warm-grey">
            This is the public demo memorial. There is no family owner on purpose.
          </p>
        ) : null}
      </div>

      {notice ? (
        <p className="rounded-lg border border-charcoal/20 bg-ivory px-4 py-3" role="status">
          {notice}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        {publicPath ? (
          <a className="btn-primary" href={publicPath} target="_blank" rel="noreferrer">
            View live page
          </a>
        ) : null}
        <a className="btn-secondary" href={editorHref}>
          Edit the memorial
        </a>
        <a className="btn-secondary" href={previewHref}>
          Preview unpublished changes
        </a>
      </div>
      <p className="text-sm text-warm-grey">
        The live page is what visitors and QR scans see. Edit and preview work on the draft, which stays private until you
        make a version live.
      </p>

      <section className="rounded-lg border border-border-warm bg-ivory p-6">
        <h2 className="font-serif text-2xl">How this desk works</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-warm-grey">
          <li>The family writes the memorial in the editor — or you can write it for them.</li>
          <li>When it is ready, you make that draft live. That is the only version the public can see.</li>
          <li>If it is not ready, send it back. The live page stays as it is until you make a new version live.</li>
        </ol>
        <p className="mt-4 text-sm text-warm-grey">
          {familyCanPublish
            ? "This memorial is set so the family can also make it live themselves, without waiting for you."
            : "This memorial is set so only LifeMarked staff can make it live."}
        </p>
      </section>

      <section className="rounded-lg border border-border-warm bg-ivory p-6">
        <h2 className="font-serif text-2xl">Addresses and marker</h2>
        <dl className="mt-4 space-y-4 text-sm">
          <div>
            <dt className="text-warm-grey">Public page</dt>
            <dd className="mt-1 break-all">{publicPath ?? "No web address yet."}</dd>
          </div>
          <div>
            <dt className="text-warm-grey">QR marker</dt>
            <dd className="mt-1">
              Code {memorial.publicToken}. Scanning it opens {markerHref}, which then shows the live page.
            </dd>
          </div>
          <div>
            <dt className="text-warm-grey">Family owner</dt>
            <dd className="mt-1">
              {ownerProfile?.email ?? owner?.userId ?? "None yet. Invite them below if this is a real family memorial."}
            </dd>
          </div>
        </dl>
      </section>

      <section className="rounded-lg border border-border-warm bg-ivory p-6">
        <h2 className="font-serif text-2xl">Files for the physical marker</h2>
        <p className="mt-2 text-sm text-warm-grey">
          Download these for engraving or printing. They always point at the QR code above, not at a web address that might
          change later.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a className="btn-secondary" href={`/api/qr/${memorial.id}.svg`}>
            Download SVG
          </a>
          <a className="btn-secondary" href={`/api/qr/${memorial.id}.png`}>
            Download PNG
          </a>
          <a className="btn-secondary" href={`/api/qr/${memorial.id}.pdf`}>
            Download print PDF
          </a>
        </div>
      </section>

      <section className="rounded-lg border border-border-warm bg-ivory p-6">
        <h2 className="font-serif text-2xl">Invite the family</h2>
        <p className="mt-2 text-sm text-warm-grey">
          We email them a private link. They open it, sign in, and can write the memorial. The live page does not change.
          The link lasts 14 days.
        </p>
        <form action={adminInviteOwner.bind(null, id)} className="mt-5 flex flex-col gap-3 sm:flex-row">
          <label className="sr-only" htmlFor="owner-email">
            Family email
          </label>
          <input
            id="owner-email"
            name="email"
            type="email"
            required
            className="input-field"
            placeholder="family@example.com"
          />
          <button className="btn-primary shrink-0" type="submit">
            Send invite
          </button>
        </form>
        {invites.length ? (
          <ul className="mt-6 space-y-4">
            {invites.map((invite) => {
              const expired = !invite.acceptedAt && !invite.revokedAt && new Date(invite.expiresAt).getTime() < Date.now();
              const state = invite.acceptedAt
                ? `Accepted ${formatWhen(invite.acceptedAt)}`
                : invite.revokedAt
                  ? "Deleted"
                  : expired
                    ? `Expired ${formatWhen(invite.expiresAt)}`
                    : `Waiting — expires ${formatWhen(invite.expiresAt)}`;
              const href = invite.rawToken && !invite.acceptedAt && !invite.revokedAt && !expired
                ? `${CANONICAL_ORIGIN}/invite/${invite.rawToken}`
                : null;
              const canResend = !invite.acceptedAt;
              const canDelete = !invite.acceptedAt && !invite.revokedAt;
              return (
                <li key={invite.id} className="rounded-md border border-border-warm p-4">
                  <p>
                    {invite.email}{" "}
                    <span className="text-warm-grey">
                      ({invite.kind === "owner" ? "family owner" : "collaborator"})
                    </span>
                  </p>
                  <p className="mt-1 text-sm text-warm-grey">{state}</p>
                  {invite.sentAt ? (
                    <p className="mt-1 text-sm text-warm-grey">Last emailed {formatWhen(invite.sentAt)}</p>
                  ) : null}
                  {href ? (
                    <label className="mt-3 block text-sm text-warm-grey">
                      Link in the email
                      <input readOnly className="input-field mt-2 font-mono text-sm" value={href} />
                    </label>
                  ) : null}
                  <div className="mt-4 flex flex-wrap gap-3">
                    {canResend ? (
                      <form action={adminResendInvite.bind(null, id)}>
                        <input type="hidden" name="inviteId" value={invite.id} />
                        <button className="btn-secondary" type="submit">
                          {expired || invite.revokedAt ? "Send a new invite" : "Resend email"}
                        </button>
                      </form>
                    ) : null}
                    {canDelete ? (
                      <form action={adminRevokeInvite.bind(null, id)}>
                        <input type="hidden" name="inviteId" value={invite.id} />
                        <ConfirmSubmit
                          className="btn-secondary"
                          message="This invite link will stop working. Continue?"
                        >
                          Delete invite
                        </ConfirmSubmit>
                      </form>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-5 text-sm text-warm-grey">No invites yet.</p>
        )}
      </section>

      <section className="rounded-lg border border-border-warm bg-ivory p-6">
        <h2 className="font-serif text-2xl">Web address</h2>
        <p className="mt-2 text-sm text-warm-grey">
          The public page is at the main address below. If you add another one, that new address becomes the main page. Old
          addresses keep working, so engraved markers and shared links do not break.
        </p>
        <ul className="mt-4 space-y-2 text-sm">
          {routes.map((route) => (
            <li key={route.slug}>
              <a className="text-link break-all" href={memorialUrl(route.slug)} target="_blank" rel="noreferrer">
                {memorialUrl(route.slug)}
              </a>
              {route.isCanonical ? <span className="ml-2 text-warm-grey">main</span> : <span className="ml-2 text-warm-grey">still works</span>}
            </li>
          ))}
        </ul>
        <form action={adminChangeSlug.bind(null, id)} className="mt-5 space-y-3">
          <label className="block text-sm" htmlFor="new-slug">
            New address ending
            <input
              id="new-slug"
              name="slug"
              required
              className="input-field mt-2"
              placeholder="margaret-campbell"
            />
          </label>
          <p className="text-sm text-warm-grey">Use lowercase letters, numbers, and hyphens. Example: margaret-campbell</p>
          <button className="btn-secondary" type="submit">
            Add this address
          </button>
        </form>
      </section>

      <section className="rounded-lg border border-border-warm bg-ivory p-6">
        <h2 className="font-serif text-2xl">Make it live, or send it back</h2>
        <p className="mt-2 text-sm text-warm-grey">
          Making it live copies the current draft onto the public page. QR scans update immediately. The previous live
          version is kept so you can restore it later.
        </p>
        <form action={adminPublish.bind(null, id)} className="mt-5">
          <ConfirmSubmit message="Visitors and anyone who scans the QR code will immediately see the current draft. Continue?">
            Make this version live
          </ConfirmSubmit>
        </form>

        <div className="mt-8 border-t border-border-warm pt-8">
          <h3 className="font-serif text-xl">Send back to the family</h3>
          <p className="mt-2 text-sm text-warm-grey">
            Use this if the draft is not ready. They can keep editing. The public page does not change. Your note is kept
            here for staff — the family does not see this box automatically.
          </p>
          <form action={adminRequestChanges.bind(null, id)} className="mt-5 space-y-3">
            <label className="block text-sm" htmlFor="changes-note">
              Note for staff
              <textarea
                id="changes-note"
                name="note"
                className="input-field mt-2 h-28"
                placeholder="What still needs doing"
              />
            </label>
            <button className="btn-secondary" type="submit">
              Send back to the family
            </button>
          </form>
        </div>
      </section>

      <section className="rounded-lg border border-border-warm bg-ivory p-6">
        <h2 className="font-serif text-2xl">Restore an earlier live version</h2>
        <p className="mt-2 text-sm text-warm-grey">
          If the wrong version went live, pick an earlier one. Visitors immediately see that older page again. The family
          draft is not deleted.
        </p>
        {versions.length ? (
          <form action={adminRollback.bind(null, id)} className="mt-5 space-y-3">
            <label className="block text-sm" htmlFor="version-id">
              Version to show on the public page
              <select id="version-id" name="versionId" className="input-field mt-2">
                {versions.map((version) => (
                  <option key={version.id} value={version.id}>
                    Version {version.versionNumber} — {versionReasonLabel(version.trigger)} — {formatWhen(version.createdAt)}
                    {version.id === memorial.publishedVersionId ? " (currently live)" : ""}
                  </option>
                ))}
              </select>
            </label>
            <ConfirmSubmit
              className="btn-secondary"
              message="The public page will switch to the version you selected. Continue?"
            >
              Restore this version
            </ConfirmSubmit>
          </form>
        ) : (
          <p className="mt-4 text-sm text-warm-grey">No live versions yet.</p>
        )}
      </section>

      <section className="rounded-lg border border-border-warm bg-ivory p-6">
        <h2 className="font-serif text-2xl">Hide from the public</h2>
        <p className="mt-2 text-sm text-warm-grey">
          Emergency take-down. QR scans and the web address will show that this memorial is unavailable. Use this for a
          complaint, a serious mistake, or if the family asks you to take it down. You can bring it back afterwards.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          {isHidden ? (
            <form action={adminEnable.bind(null, id)}>
              <ConfirmSubmit message="Visitors and QR scans will be able to see the live memorial again. Continue?">
                Show it again
              </ConfirmSubmit>
            </form>
          ) : (
            <form action={adminDisable.bind(null, id)}>
              <input type="hidden" name="reason" value="ops" />
              <ConfirmSubmit
                className="btn-secondary"
                message="QR scans and the public page will show that this memorial is unavailable. Continue?"
              >
                Hide this memorial
              </ConfirmSubmit>
            </form>
          )}
        </div>
      </section>

      <section className="rounded-lg border border-border-warm bg-ivory p-6">
        <h2 className="font-serif text-2xl">Staff notes</h2>
        <p className="mt-2 text-sm text-warm-grey">Only LifeMarked staff can see these. Families never see this list.</p>
        <form action={adminAddNote.bind(null, id)} className="mt-5 space-y-3">
          <label className="block text-sm" htmlFor="staff-note">
            Note
            <textarea id="staff-note" name="body" required className="input-field mt-2 h-28" />
          </label>
          <button className="btn-secondary" type="submit">
            Save note
          </button>
        </form>
        {notes.length ? (
          <ul className="mt-6 space-y-3 text-sm">
            {notes.map((note) => (
              <li key={note.id} className="border-t border-border-warm pt-3">
                <p className="text-warm-grey">{formatWhen(note.createdAt)}</p>
                <p className="mt-1">{note.body}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-5 text-sm text-warm-grey">No staff notes yet.</p>
        )}
      </section>
    </main>
  );
}
