import type { MemberRole } from "./enums";

export type Membership = {
  memorialId: string;
  userId: string;
  role: MemberRole;
};

export function denormalisedOwnerId(members: Membership[]): string | null {
  const owners = members.filter((member) => member.role === "owner");
  if (owners.length > 1) {
    throw new Error("A memorial can have only one owner.");
  }
  return owners[0]?.userId ?? null;
}

export function assertSingleOwnerAfterAccept(members: Membership[], status: string) {
  const progressed = !["draft", "owner_invited"].includes(status);
  if (!progressed) return;
  const owner = denormalisedOwnerId(members);
  if (!owner) {
    throw new Error("An accepted memorial must have exactly one owner.");
  }
}

export function canEditMemorial(role: MemberRole | null, isAdmin: boolean) {
  if (isAdmin) return true;
  return role === "owner" || role === "editor";
}

export function canManageAccess(role: MemberRole | null, isAdmin: boolean) {
  if (isAdmin) return true;
  return role === "owner";
}
