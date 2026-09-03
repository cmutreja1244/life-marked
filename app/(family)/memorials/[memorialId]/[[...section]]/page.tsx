import { notFound, redirect } from "next/navigation";
import {
  createContributionLinkAction,
  inviteCollaboratorAction,
  requestExport,
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
  submitMemorial,
} from "@/lib/family/actions";
import { requireMemorialAccess } from "@/lib/auth/session";
import { store } from "@/lib/platform/store";
import { familyStatusLabel } from "@/lib/platform/lifecycle";
import { SECTION_KEYS, SECTION_LABELS } from "@/lib/platform/enums";
import { StoryEditor } from "@/components/family/StoryEditor";
import { AutosaveForm } from "@/components/family/AutosaveForm";
import { MediaUploader } from "@/components/family/MediaUploader";
import { VoiceRecorder } from "@/components/family/VoiceRecorder";
import { FavouritesEditor, MemoriesEditor, PlacesEditor, TimelineEditor } from "@/components/family/RepeatableEditors";
import { ConfirmSubmit } from "@/components/admin/ConfirmSubmit";

type PageProps = {
  params: Promise<{ memorialId: string; section?: string[] }>;
};

export default async function MemorialSectionPage({ params }: PageProps) {
  const { memorialId, section } = await params;
  const { role, session } = await requireMemorialAccess(memorialId, "view");
  const memorial = store.getMemorial(memorialId);
  const content = store.content.get(memorialId);
  if (!memorial || !content) notFound();
  const slug = section?.[0] ?? "overview";
  const canEdit = role === "owner" || role === "editor" || session.user.isAdmin;

  if (slug === "sections" || slug === "family" || slug === "publish") {
    redirect(`/memorials/${memorialId}/overview`);
  }

  if (slug === "overview") {
    const links = store.contributionLinks.filter((link) => link.memorialId === memorialId);
    const publishAction =
      memorial.publishingMode === "self_publish"
        ? selfPublish.bind(null, memorialId)
        : submitMemorial.bind(null, memorialId);
    const publishLabel =
      memorial.publishingMode === "self_publish" ? "Update the live memorial" : "Send to LifeMarked for review";
    return (
      <section className="space-y-10">
        <div>
          <h1 className="font-serif text-3xl">Overview</h1>
          <p className="mt-3 text-warm-grey">{familyStatusLabel(memorial.status)}.</p>
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
          <h2 className="font-serif text-2xl">Make it live</h2>
          <p className="mt-2 text-warm-grey">
            {memorial.publishingMode === "self_publish"
              ? "When you are ready, this copies the current draft onto the public page. Preview first if you want to check it."
              : "When you are ready, send the draft to LifeMarked. The public page will not change until we make a version live."}
          </p>
          {canEdit ? (
            <form action={publishAction} className="mt-6">
              <ConfirmSubmit message="This will update the memorial for visitors if it is already live, or send it for review. Continue?">
                {publishLabel}
              </ConfirmSubmit>
            </form>
          ) : null}
        </div>

        <div id="sections" className="rounded-lg border border-border-warm bg-ivory p-6">
          <h2 className="font-serif text-2xl">What appears on the page</h2>
          <p className="mt-2 text-sm text-warm-grey">
            Turn chapters on or off. Empty chapters never make a memorial look unfinished — they simply stay hidden.
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
            <h2 className="font-serif text-2xl">Family and privacy</h2>
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
          {role === "owner" || session.user.isAdmin ? (
            <>
              <form action={inviteCollaboratorAction.bind(null, memorialId)} className="space-y-3">
                <h3 className="font-serif text-xl">Invite family</h3>
                <p className="text-sm text-warm-grey">We’ll email them a private link to help write or preview this memorial.</p>
                <input name="email" type="email" required className="input-field" placeholder="Email" />
                <select name="role" className="input-field">
                  <option value="editor">Can edit</option>
                  <option value="viewer">Can preview</option>
                </select>
                <button className="btn-primary" type="submit">
                  Send invitation
                </button>
              </form>
              <form action={createContributionLinkAction.bind(null, memorialId)} className="space-y-3">
                <h3 className="font-serif text-xl">Ask for a memory</h3>
                <input name="kinds" defaultValue="memory,photo" className="input-field" />
                <button className="btn-primary" type="submit">
                  Create contribution link
                </button>
              </form>
              <ul className="text-sm text-warm-grey">
                {links.map((link) => (
                  <li key={link.id}>
                    /c/{link.rawToken} — {link.submissionCount}/{link.maxSubmissions}
                  </li>
                ))}
              </ul>
              <form
                action={async () => {
                  "use server";
                  await requestExport(memorialId);
                }}
              >
                <button className="btn-secondary" type="submit">
                  Request a copy of the originals
                </button>
              </form>
              <form action={scheduleMemorialDelete.bind(null, memorialId)}>
                <button className="text-link" type="submit">
                  Close this memorial (30-day grace)
                </button>
              </form>
            </>
          ) : null}
        </div>
      </section>
    );
  }

  if (slug === "about") {
    return (
      <AutosaveForm action={saveAbout.bind(null, memorialId)} disabled={!canEdit}>
        <h1 className="font-serif text-3xl">About them</h1>
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
        <h1 className="font-serif text-3xl">Their story</h1>
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
        <h1 className="font-serif text-3xl">Life moments</h1>
        <p className="mt-2 text-sm text-warm-grey">Add the years and moments that shaped their life. You can reorder them at any time.</p>
        <TimelineEditor name="timeline" initial={content.timeline} />
      </AutosaveForm>
    );
  }

  if (slug === "gallery") {
    return (
      <section>
        <h1 className="font-serif text-3xl">Photographs</h1>
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
        <h1 className="font-serif text-3xl">Favourites</h1>
        <p className="mt-2 text-sm text-warm-grey">The small things that made them themselves. Add one at a time.</p>
        <FavouritesEditor name="favourites" initial={content.favouriteThings} />
      </AutosaveForm>
    );
  }

  if (slug === "memories") {
    return (
      <AutosaveForm action={saveMemories.bind(null, memorialId)} disabled={!canEdit}>
        <h1 className="font-serif text-3xl">Memories</h1>
        <p className="mt-2 text-sm text-warm-grey">Collect what people remember. Add the words, then who said them.</p>
        <MemoriesEditor
          name="memories"
          initial={content.memories.map((memory) => ({ quote: memory.quote, author: memory.author }))}
        />
      </AutosaveForm>
    );
  }

  if (slug === "voice") {
    return (
      <section>
        <h1 className="font-serif text-3xl">Voice</h1>
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
        <h1 className="font-serif text-3xl">Video</h1>
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
        <h1 className="font-serif text-3xl">Places</h1>
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
