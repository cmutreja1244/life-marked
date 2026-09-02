export type ContributionLink = {
  tokenHash: string;
  expiresAt: string;
  revokedAt: string | null;
  reusable: boolean;
  maxSubmissions: number;
  submissionCount: number;
  allowedKinds: Array<"memory" | "photo" | "audio" | "video">;
};

export function assertContributionAllowed(
  link: ContributionLink,
  kind: ContributionLink["allowedKinds"][number],
  now = new Date(),
) {
  if (link.revokedAt) {
    throw new Error("This invitation is no longer active.");
  }
  if (new Date(link.expiresAt).getTime() <= now.getTime()) {
    throw new Error("This invitation has expired.");
  }
  if (link.submissionCount >= link.maxSubmissions) {
    throw new Error("This invitation has already been used.");
  }
  if (!link.allowedKinds.includes(kind)) {
    throw new Error("This kind of contribution is not invited here.");
  }
}

export function incrementSubmissions(link: ContributionLink): ContributionLink {
  assertContributionAllowed(link, link.allowedKinds[0]!);
  return { ...link, submissionCount: link.submissionCount + 1 };
}
