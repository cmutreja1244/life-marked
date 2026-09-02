import type { MemorialStatus } from "./enums";

const TRANSITIONS: Record<MemorialStatus, MemorialStatus[]> = {
  draft: ["owner_invited", "archived"],
  owner_invited: ["in_progress", "archived"],
  in_progress: ["in_review", "published", "archived"],
  in_review: ["changes_requested", "published", "archived"],
  changes_requested: ["in_progress", "archived"],
  published: ["in_review", "archived", "disabled"],
  archived: ["published"],
  disabled: ["published"],
};

export function canTransitionStatus(from: MemorialStatus, to: MemorialStatus) {
  return TRANSITIONS[from].includes(to);
}

export function familyStatusLabel(status: MemorialStatus): string {
  switch (status) {
    case "draft":
    case "owner_invited":
      return "Invited";
    case "in_progress":
    case "changes_requested":
      return "In progress";
    case "in_review":
      return "With LifeMarked for review";
    case "published":
      return "Live";
    case "archived":
    case "disabled":
      return "Unavailable";
  }
}

export function submitForReview(status: MemorialStatus, publishingMode: "admin_review" | "self_publish") {
  if (publishingMode === "self_publish") return "published" as const;
  if (status === "in_progress" || status === "published") return "in_review" as const;
  throw new Error("This memorial cannot be submitted for review yet.");
}
