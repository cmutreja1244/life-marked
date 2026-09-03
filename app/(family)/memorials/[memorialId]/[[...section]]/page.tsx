import { notFound, redirect } from "next/navigation";
import {
  approveContributionAction,
  cancelMemorialDelete,
  declineContributionAction,
  ensureMemoryLinkAction,
  inviteCollaboratorAction,
  requestExport,
  resendCollaboratorInviteAction,
  revokeCollaboratorInviteAction,
  saveAbout,
  saveFavourites,
  saveMemories,
  savePlaces,
  saveSections,
  saveTimeline,
  saveVideo,
  saveVoice,
  scheduleMemorialDelete,
  selfPublish,
  sendMemoryRequestEmailAction,
  submitMemorial,
} from "@/lib/family/actions";
import { familyNoticeFromQuery } from "@/lib/family/notices";
import { EDITOR_TIPS } from "@/lib/family/tips";
import { requireMemorialAccess } from "@/lib/auth/session";
import { contributionUrl } from "@/lib/email/invite";
import { store } from "@/lib/platform/store";
import { familyStatusLabel } from "@/lib/platform/lifecycle";
import { SECTION_KEYS, SECTION_LABELS } from "@/lib/platform/enums";
import { StoryEditor } from "@/components/family/StoryEditor";
import { AutosaveForm } from "@/components/family/AutosaveForm";
import { MediaUploader } from "@/components/family/MediaUploader";
import { VoiceRecorder } from "@/components/family/VoiceRecorder";
import { FavouritesEditor, MemoriesEditor, PlacesEditor, TimelineEditor } from "@/components/family/RepeatableEditors";
import { ConfirmSubmit } from "@/components/admin/ConfirmSubmit";
import { CopyLinkButton } from "@/components/ui/CopyLinkButton";
import { HeadingWithTip } from "@/components/ui/HeadingWithTip";
import { PendingSubmit } from "@/components/ui/PendingSubmit";
import Link from "next/link";

type PageProps = {
  params: Promise<{ memorialId: string; section?: string[] }>;
  searchParams: Promise<{ done?: string }>;
};

function formatWhen(iso: string) {
  return new Date(iso).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });
}

function formatDay(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function memberRoleLabel(role: string) {
  if (role === "owner") return "Owner";
  if (role === "viewer") return "Can preview";
  return "Can edit";
}

export default async function MemorialSectionPage({ params, searchParams }: PageProps) {
  const { memorialId, section } = await params;
  const { done } = await searchParams;
  const { role, session } = await requireMemorialAccess(memorialId, "view");
  const memorial = store.getMemorial(memorialId);
  const content = store.content.get(memorialId);
  if (!memorial || !content) notFound();
  const slug = section?.[0] ?? "overview";
  const canEdit = role === "owner" || role === "editor" || session.user.isAdmin;
  const notice = familyNoticeFromQuery(done);

  if (slug === "sections" || slug === "family" || slug === "publish") {
    redirect(`/memorials/${memorialId}/overview`);
  }

  const noticeBanner = notice ? (
    <p className="rounded-lg border border-charcoal/20 bg-ivory px-4 py-3" role="status">
      {notice}
    </p>
  ) : null;

  if (slug === "overview") {
    const memoryLink = store.getActiveMemoryLink(memorialId);
    const memoryHref = memoryLink?.rawToken ? contributionUrl(memoryLink.rawToken) : null;
    const pendingMemories = store.contributions.filter(
      (row) => row.memorialId === memorialId && row.status === "pending" && row.kind === "memory",
    );
    const members = store.members.filter((member) => member.memorialId === memorialId);
    const familyInvites = store.invitations.filter((row) => row.memorialId === memorialId && row.kind === "collaborator");
    const publishAction =
      memorial.publishingMode === "self_publish"
        ? selfPublish.bind(null, memorialId)
        : submitMemorial.bind(null, memorialId);
    const isSelfPublish = memorial.publishingMode === "self_publish";
    const publishLabel = isSelfPublish ? "Update the live memorial" : "Send to LifeMarked for review";
    const publishConfirm = isSelfPublish
      ? "This copies the current draft onto the public page. Visitors and QR scans will see it. Continue?"
      : "This sends the draft to LifeMarked. Visitors will not see it until we make a version live. Continue?";
    const canManage = role === "owner" || session.user.isAdmin;
    return (
      <section className="space-y-10">
        {noticeBanner}
        <div>
          <HeadingWithTip as="h1" className="font-serif text-3xl" tip={EDITOR_TIPS.overview}>
            Overview
          </HeadingWithTip>
          <p className="mt-3 text-warm-grey">{familyStatusLabel(memorial.status)}.</p>
          {pendingMemories.length > 0 ? (
            <p className="mt-3 text-sm">
              <Link href={`/memorials/${memorialId}/memories`} className="text-link">
                {pendingMemories.length === 1
                  ? "1 memory is waiting for you to accept."
                  : `${pendingMemories.length} memories are waiting for you to accept.`}
              </Link>
            </p>
          ) : null}
          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-border-warm bg-ivory p-4">
              <dt className="text-sm text-warm-grey">Name</dt>
              <dd className="mt-1">{memorial.fullName || "Not added yet"}</dd>
            </div>
            <div className="rounded-lg border border-border-warm bg-ivory p-4">
              <dt className="text-sm text-warm-grey">Photographs</dt>
              <dd className="mt-1">{content.gallery.length}</dd>
            </div>
          </dl>
        </div>

        <div id="publish" className="rounded-lg border border-charcoal/20 bg-ivory p-6">
          <HeadingWithTip
            className="font-serif text-2xl"
            tip={isSelfPublish ? EDITOR_TIPS.publishSelf : EDITOR_TIPS.publishReview}
          >
            Make it live
          </HeadingWithTip>
          <p className="mt-2 text-warm-grey">
            {isSelfPublish
              ? "When you are ready, this copies the current draft onto the public page."
              : "When you are ready, send the draft to LifeMarked. The public page will not change until we make a version live."}
          </p>
          {canEdit ? (
            <form action={publishAction} className="mt-6">
              <ConfirmSubmit message={publishConfirm}>{publishLabel}</ConfirmSubmit>
            </form>
          ) : null}
        </div>

        <div id="sections" className="rounded-lg border border-border-warm bg-ivory p-6">
          <HeadingWithTip className="font-serif text-2xl" tip={EDITOR_TIPS.sections}>
            What appears on the page
          </HeadingWithTip>
          <p className="mt-2 text-sm text-warm-grey">
            Turn chapters on or off. Empty chapters stay hidden, so the page never looks unfinished.
          </p>
          <AutosaveForm action={saveSections.bind(null, memorialId)} disabled={!canEdit}>
            <ul className="mt-6 space-y-3">
              {SECTION_KEYS.map((key) => (
                <li key={key}>
                  <label className="flex min-h-12 items-center gap-3">
                    <input
                      type="checkbox"
                      name="section"
                      value={key}
                      defaultChecked={content.sections.find((row) => row.key === key)?.enabled}
                    />
                    {SECTION_LABELS[key]}
                  </label>
                </li>
              ))}
            </ul>
          </AutosaveForm>
        </div>

        <div id="family" className="rounded-lg border border-border-warm bg-ivory p-6 space-y-8">
          <div>
            <HeadingWithTip className="font-serif text-2xl" tip={EDITOR_TIPS.visibility}>
              Family and privacy
            </HeadingWithTip>
            <AutosaveForm action={saveAbout.bind(null, memorialId)} disabled={!canEdit}>
              <input type="hidden" name="firstName" value={memorial.firstName} />
              <input type="hidden" name="fullName" value={memorial.fullName} />
              <label className="mt-6 block text-sm">
                Who can view the live memorial
                <select name="visibility" defaultValue={memorial.visibility} className="input-field mt-2">
                  <option value="unlisted">Anyone with the link or QR code</option>
                  <option value="public">Public</option>
                  <option value="private">Only family</option>
                </select>
              </label>
              <label className="mt-4 flex min-h-12 items-center gap-3 text-sm">
                <input type="checkbox" name="indexOptIn" defaultChecked={memorial.indexOptIn} />
                Allow search engines if this memorial is public
              </label>
            </AutosaveForm>
          </div>
          {canManage ? (
            <>
              <div className="space-y-4">
                <HeadingWithTip as="h3" className="font-serif text-xl" tip={EDITOR_TIPS.inviteFamily}>
                  Invite family
                </HeadingWithTip>
                <p className="text-sm text-warm-grey">
                  Can edit means they can change the draft. Can preview means they can look, but not change anything. We
                  email them a private link.
                </p>
                <form action={inviteCollaboratorAction.bind(null, memorialId)} className="space-y-3">
                  <input name="email" type="email" required className="input-field" placeholder="Email" />
                  <select name="role" className="input-field">
                    <option value="editor">Can edit</option>
                    <option value="viewer">Can preview</option>
                  </select>
                  <PendingSubmit>Send invitation</PendingSubmit>
                </form>
                {members.length ? (
                  <ul className="space-y-2 text-sm">
                    {members.map((member) => {
                      const profile = store.profiles.get(member.userId);
                      return (
                        <li key={`${member.userId}-${member.role}`}>
                          {profile?.email ?? member.userId}{" "}
                          <span className="text-warm-grey">({memberRoleLabel(member.role)})</span>
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
                {familyInvites.length ? (
                  <ul className="space-y-4">
                    {familyInvites.map((invite) => {
                      const expired =
                        !invite.acceptedAt && !invite.revokedAt && new Date(invite.expiresAt).getTime() < Date.now();
                      const state = invite.acceptedAt
                        ? `Joined ${formatWhen(invite.acceptedAt)}`
                        : invite.revokedAt
                          ? "Deleted"
                          : expired
                            ? `Expired ${formatWhen(invite.expiresAt)}`
                            : `Waiting. Expires ${formatWhen(invite.expiresAt)}`;
                      const canResend = !invite.acceptedAt;
                      const canDelete = !invite.acceptedAt && !invite.revokedAt;
                      return (
                        <li key={invite.id} className="rounded-md border border-border-warm p-4">
                          <p>
                            {invite.email}{" "}
                            <span className="text-warm-grey">
                              ({invite.collaboratorRole === "viewer" ? "Can preview" : "Can edit"})
                            </span>
                          </p>
                          <p className="mt-1 text-sm text-warm-grey">{state}</p>
                          <div className="mt-4 flex flex-wrap gap-3">
                            {canResend ? (
                              <form action={resendCollaboratorInviteAction.bind(null, memorialId)}>
                                <input type="hidden" name="inviteId" value={invite.id} />
                                <PendingSubmit className="btn-secondary" pendingLabel="Sending...">
                                  {expired || invite.revokedAt ? "Send a new invite" : "Resend email"}
                                </PendingSubmit>
                              </form>
                            ) : null}
                            {canDelete ? (
                              <form action={revokeCollaboratorInviteAction.bind(null, memorialId)}>
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
                ) : null}
              </div>

              <div className="space-y-4">
                <HeadingWithTip as="h3" className="font-serif text-xl" tip={EDITOR_TIPS.askMemory}>
                  Ask for a memory
                </HeadingWithTip>
                <p className="text-sm text-warm-grey">
                  Share a link, or email it. People can send a memory. It will not appear until you accept it on Memories.
                </p>
                {memoryHref && memoryLink ? (
                  <>
                    <label className="block text-sm text-warm-grey">
                      Shareable link
                      <input readOnly className="input-field mt-2 font-mono text-sm" value={memoryHref} />
                    </label>
                    <p className="text-sm text-warm-grey">
                      {memoryLink.submissionCount}/{memoryLink.maxSubmissions} used. Expires {formatDay(memoryLink.expiresAt)}.
                    </p>
                    <CopyLinkButton value={memoryHref} />
                    <form action={sendMemoryRequestEmailAction.bind(null, memorialId)} className="space-y-3">
                      <label className="block text-sm">
                        Email this link
                        <input name="email" type="email" required className="input-field mt-2" placeholder="friend@example.com" />
                      </label>
                      <PendingSubmit>Send</PendingSubmit>
                    </form>
                  </>
                ) : (
                  <form action={ensureMemoryLinkAction.bind(null, memorialId)}>
                    <PendingSubmit pendingLabel="Working...">Create a shareable link</PendingSubmit>
                  </form>
                )}
              </div>

              <form
                action={async () => {
                  "use server";
                  await requestExport(memorialId);
                }}
              >
                <PendingSubmit className="btn-secondary" pendingLabel="Working...">
                  Request a copy of the originals
                </PendingSubmit>
              </form>

              <div className="space-y-3">
                <HeadingWithTip as="h3" className="font-serif text-xl" tip={EDITOR_TIPS.closeMemorial}>
                  Close this memorial
                </HeadingWithTip>
                {memorial.deletedAt ? (
                  <>
                    <p className="text-sm text-warm-grey">
                      Visitors cannot see this memorial. We keep the files until{" "}
                      {memorial.purgeAfter ? formatDay(memorial.purgeAfter) : "the end of the 30 days"}. You can cancel
                      until then.
                    </p>
                    <form action={cancelMemorialDelete.bind(null, memorialId)}>
                      <ConfirmSubmit
                        className="btn-secondary"
                        message="This will cancel the close. Family can keep working on the memorial. Continue?"
                      >
                        Cancel close
                      </ConfirmSubmit>
                    </form>
                  </>
                ) : (
                  <form action={scheduleMemorialDelete.bind(null, memorialId)}>
                    <ConfirmSubmit
                      className="btn-secondary"
                      message="Visitors will lose access immediately. We keep the files for 30 days, and you can cancel in that time. Continue?"
                    >
                      Close this memorial
                    </ConfirmSubmit>
                  </form>
                )}
              </div>
            </>
          ) : null}
        </div>
      </section>
    );
  }

  if (slug === "about") {
    return (
      <AutosaveForm action={saveAbout.bind(null, memorialId)} disabled={!canEdit}>
        <HeadingWithTip as="h1" className="font-serif text-3xl" tip={EDITOR_TIPS.about}>
          About them
        </HeadingWithTip>
        <label className="mt-8 block text-sm">First name
          <input name="firstName" defaultValue={memorial.firstName} className="input-field mt-2" />
        </label>
        <label className="mt-4 block text-sm">Full name
          <input name="fullName" defaultValue={memorial.fullName} className="input-field mt-2" />
        </label>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="block text-sm">Year of birth
            <input name="birthYear" defaultValue={memorial.birth.year ?? ""} className="input-field mt-2" />
          </label>
          <label className="block text-sm">Year of death
            <input name="deathYear" defaultValue={memorial.death.year ?? ""} className="input-field mt-2" />
          </label>
        </div>
        <label className="mt-4 block text-sm">Opening line
          <input name="openingLine" defaultValue={memorial.openingLine} className="input-field mt-2" />
        </label>
        <label className="mt-4 block text-sm">Introduction
          <textarea name="intro" defaultValue={memorial.intro} className="input-field mt-2 h-32" />
        </label>
        <label className="mt-4 block text-sm">Portrait description
          <input name="heroImageAlt" defaultValue={memorial.heroImageAlt} className="input-field mt-2" />
        </label>
        <label className="mt-4 block text-sm">Closing heading
          <input name="closingHeading" defaultValue={memorial.closingHeading} className="input-field mt-2" />
        </label>
        <label className="mt-4 block text-sm">Closing words
          <textarea name="closingText" defaultValue={memorial.closingText} className="input-field mt-2 h-32" />
        </label>
      </AutosaveForm>
    );
  }

  if (slug === "story") {
    return (
      <section>
        <HeadingWithTip as="h1" className="font-serif text-3xl" tip={EDITOR_TIPS.story}>
          Their story
        </HeadingWithTip>
        <StoryEditor
          memorialId={memorialId}
          initial={content.story}
          pullQuote={memorial.pullQuote}
          disabled={!canEdit}
        />
      </section>
    );
  }

  if (slug === "timeline") {
    return (
      <AutosaveForm action={saveTimeline.bind(null, memorialId)} disabled={!canEdit}>
        <HeadingWithTip as="h1" className="font-serif text-3xl" tip={EDITOR_TIPS.timeline}>
          Life moments
        </HeadingWithTip>
        <p className="mt-2 text-sm text-warm-grey">Add the years and moments that shaped their life. You can reorder them at any time.</p>
        <TimelineEditor name="timeline" initial={content.timeline} />
      </AutosaveForm>
    );
  }

  if (slug === "gallery") {
    return (
      <section>
        <HeadingWithTip as="h1" className="font-serif text-3xl" tip={EDITOR_TIPS.gallery}>
          Photographs
        </HeadingWithTip>
        <p className="mt-3 text-warm-grey">
          iPhone photos (including HEIC) are welcome. Each file is scanned and stored before it can
          appear on the memorial.
        </p>
        {canEdit ? <MediaUploader memorialId={memorialId} kind="image" /> : null}
        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {[...store.media.values()]
            .filter((asset) => asset.memorialId === memorialId && asset.kind === "image")
            .map((asset) => (
              <li key={asset.id} className="rounded-lg border border-border-warm p-3 text-sm">
                <p>{asset.altText || asset.id.slice(0, 8)}</p>
                <p className="text-warm-grey">{asset.status}</p>
              </li>
            ))}
        </ul>
      </section>
    );
  }

  if (slug === "favourites") {
    return (
      <AutosaveForm action={saveFavourites.bind(null, memorialId)} disabled={!canEdit}>
        <HeadingWithTip as="h1" className="font-serif text-3xl" tip={EDITOR_TIPS.favourites}>
          Favourites
        </HeadingWithTip>
        <p className="mt-2 text-sm text-warm-grey">The small things that made them themselves. Add one at a time.</p>
        <FavouritesEditor name="favourites" initial={content.favouriteThings} />
      </AutosaveForm>
    );
  }

  if (slug === "memories") {
    const pendingMemories = store.contributions.filter(
      (row) => row.memorialId === memorialId && row.status === "pending" && row.kind === "memory",
    );
    return (
      <section className="space-y-10">
        {noticeBanner}
        <div>
          <HeadingWithTip as="h1" className="font-serif text-3xl" tip={EDITOR_TIPS.memories}>
            Memories
          </HeadingWithTip>
          <p className="mt-2 text-sm text-warm-grey">Collect what people remember. Add the words, then who said them.</p>
        </div>
        {pendingMemories.length > 0 && canEdit ? (
          <div className="space-y-4">
            <h2 className="font-serif text-xl">Waiting for you</h2>
            <ul className="space-y-4">
              {pendingMemories.map((row) => (
                <li key={row.id} className="rounded-lg border border-border-warm p-4">
                  <p>{String(row.payload.quote ?? "")}</p>
                  <p className="mt-2 text-sm text-warm-grey">{row.submitterName}</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <form action={approveContributionAction.bind(null, memorialId)}>
                      <input type="hidden" name="contributionId" value={row.id} />
                      <PendingSubmit pendingLabel="Working...">Accept</PendingSubmit>
                    </form>
                    <form action={declineContributionAction.bind(null, memorialId)}>
                      <input type="hidden" name="contributionId" value={row.id} />
                      <ConfirmSubmit
                        className="btn-secondary"
                        message="This memory will not be added. Continue?"
                      >
                        Decline
                      </ConfirmSubmit>
                    </form>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <AutosaveForm action={saveMemories.bind(null, memorialId)} disabled={!canEdit}>
          <MemoriesEditor
            name="memories"
            initial={content.memories.map((memory) => ({ quote: memory.quote, author: memory.author }))}
          />
        </AutosaveForm>
      </section>
    );
  }

  if (slug === "voice") {
    return (
      <section>
        <HeadingWithTip as="h1" className="font-serif text-3xl" tip={EDITOR_TIPS.voice}>
          Voice
        </HeadingWithTip>
        <p className="mt-3 text-warm-grey">Record on this phone or upload a file. Playback is prepared after a security scan.</p>
        {canEdit ? (
          <>
            <VoiceRecorder memorialId={memorialId} />
            <AutosaveForm action={saveVoice.bind(null, memorialId)}>
              <label className="mt-6 block text-sm">Title
                <input name="title" defaultValue={content.voice?.title ?? ""} className="input-field mt-2" />
              </label>
              <label className="mt-4 block text-sm">Recorded
                <input name="recorded" defaultValue={content.voice?.recorded ?? ""} className="input-field mt-2" />
              </label>
              <textarea name="supportingText" defaultValue={content.voice?.supportingText ?? ""} className="input-field mt-4 h-32" />
            </AutosaveForm>
          </>
        ) : null}
      </section>
    );
  }

  if (slug === "video") {
    return (
      <section>
        <HeadingWithTip as="h1" className="font-serif text-3xl" tip={EDITOR_TIPS.video}>
          Video
        </HeadingWithTip>
        <p className="mt-3 text-warm-grey">
          The original file is stored with LifeMarked and played from there.
        </p>
        {canEdit ? (
          <>
            <MediaUploader memorialId={memorialId} kind="video" />
            <AutosaveForm action={saveVideo.bind(null, memorialId)}>
              <label className="mt-6 block text-sm">Title
                <input name="title" defaultValue={content.video?.title ?? ""} className="input-field mt-2" />
              </label>
            </AutosaveForm>
          </>
        ) : null}
      </section>
    );
  }

  if (slug === "places") {
    return (
      <AutosaveForm action={savePlaces.bind(null, memorialId)} disabled={!canEdit}>
        <HeadingWithTip as="h1" className="font-serif text-3xl" tip={EDITOR_TIPS.places}>
          Places
        </HeadingWithTip>
        <p className="mt-2 text-sm text-warm-grey">Add the places that mattered. You can include more than one, and reorder them.</p>
        <PlacesEditor
          name="places"
          initial={content.places.map((place) => ({
            heading: place.heading,
            location: place.location,
            text: place.text,
            caption: place.caption,
          }))}
        />
      </AutosaveForm>
    );
  }

  notFound();
}
