import { createSupabaseAdminClient } from "@/lib/auth/admin";
import type { Membership } from "@/lib/platform/ownership";
import type { Invitation, MemorialRecord, Profile } from "@/lib/platform/types";

const PILOT_PACKAGE_ID = "00000000-0000-4000-8000-000000000001";

function isUuid(value: string | null | undefined): value is string {
  return Boolean(value && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value));
}

async function persistPackage() {
  const admin = createSupabaseAdminClient();
  if (!admin) return;
  const { error } = await admin.from("packages").upsert(
    { id: PILOT_PACKAGE_ID, name: "Pilot", publishing_mode: "admin_review" },
    { onConflict: "id" },
  );
  if (error) throw error;
}

export async function persistProfile(profile: Profile) {
  const admin = createSupabaseAdminClient();
  if (!admin) return;
  const { error } = await admin.from("profiles").upsert(
    {
      id: profile.id,
      email: profile.email,
      display_name: profile.displayName,
    },
    { onConflict: "id" },
  );
  if (error) throw error;
}

export async function persistMemorial(memorial: MemorialRecord) {
  const admin = createSupabaseAdminClient();
  if (!admin) return;
  await persistPackage();
  const dbStatus =
    !memorial.ownerId && memorial.status !== "draft" && memorial.status !== "owner_invited"
      ? "owner_invited"
      : memorial.status;
  const { error } = await admin.from("memorials").upsert(
    {
      id: memorial.id,
      public_token: memorial.publicToken,
      owner_id: isUuid(memorial.ownerId) ? memorial.ownerId : null,
      partner_id: isUuid(memorial.partnerId) ? memorial.partnerId : null,
      package_id: isUuid(memorial.packageId) ? memorial.packageId : PILOT_PACKAGE_ID,
      first_name: memorial.firstName,
      full_name: memorial.fullName,
      birth: memorial.birth,
      death: memorial.death,
      opening_line: memorial.openingLine,
      intro: memorial.intro,
      closing_heading: memorial.closingHeading,
      closing_text: memorial.closingText,
      pull_quote: memorial.pullQuote,
      hero_asset_id: isUuid(memorial.heroAssetId) ? memorial.heroAssetId : null,
      hero_image_alt: memorial.heroImageAlt,
      hero_focal_y: memorial.heroFocalY,
      status: dbStatus,
      visibility: memorial.visibility,
      publishing_mode: memorial.publishingMode,
      index_opt_in: memorial.indexOptIn,
      is_demo: memorial.isDemo,
      published_at: memorial.publishedAt,
      marker_status: memorial.markerStatus,
    },
    { onConflict: "id" },
  );
  if (error) throw error;
}

export async function persistInvitation(invitation: Invitation, invitedBy?: string | null) {
  const admin = createSupabaseAdminClient();
  if (!admin) return;
  const row: Record<string, unknown> = {
    id: invitation.id,
    memorial_id: invitation.memorialId,
    email: invitation.email,
    kind: invitation.kind,
    collaborator_role: invitation.collaboratorRole,
    token_hash: invitation.tokenHash,
    expires_at: invitation.expiresAt,
    accepted_at: invitation.acceptedAt,
    revoked_at: invitation.revokedAt,
  };
  if (isUuid(invitedBy)) row.invited_by = invitedBy;
  const { error } = await admin.from("memorial_invitations").upsert(row, { onConflict: "id" });
  if (error) throw error;
}

export async function persistMember(member: Membership) {
  const admin = createSupabaseAdminClient();
  if (!admin) return;
  const { error } = await admin.from("memorial_members").upsert(
    {
      memorial_id: member.memorialId,
      user_id: member.userId,
      role: member.role,
    },
    { onConflict: "memorial_id,user_id" },
  );
  if (error) throw error;
}

export async function loadInvitationByHash(tokenHash: string): Promise<Invitation | null> {
  const admin = createSupabaseAdminClient();
  if (!admin) return null;
  const { data, error } = await admin
    .from("memorial_invitations")
    .select(
      "id, memorial_id, email, kind, collaborator_role, token_hash, expires_at, accepted_at, revoked_at",
    )
    .eq("token_hash", tokenHash)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    id: data.id,
    memorialId: data.memorial_id,
    email: data.email,
    kind: data.kind,
    collaboratorRole: data.collaborator_role,
    tokenHash: data.token_hash,
    expiresAt: data.expires_at,
    acceptedAt: data.accepted_at,
    revokedAt: data.revoked_at,
    sentAt: null,
  };
}

export async function listMembersForUser(userId: string): Promise<Membership[]> {
  const admin = createSupabaseAdminClient();
  if (!admin) return [];
  const { data, error } = await admin
    .from("memorial_members")
    .select("memorial_id, user_id, role")
    .eq("user_id", userId);
  if (error) throw error;
  return (data ?? []).map((row) => ({
    memorialId: row.memorial_id,
    userId: row.user_id,
    role: row.role,
  }));
}
