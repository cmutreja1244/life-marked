"use client";

import { adminTogglePublished } from "@/lib/admin/actions";

export function PublishedToggle({
  memorialId,
  live,
  name,
}: {
  memorialId: string;
  live: boolean;
  name: string;
}) {
  const label = live ? `Hide ${name} from the public` : `Make ${name} live`;
  const message = live
    ? `Visitors and QR scans will no longer see ${name}. Continue?`
    : `Visitors and QR scans will see ${name}. Continue?`;

  return (
    <form
      action={adminTogglePublished.bind(null, memorialId)}
      onSubmit={(event) => {
        if (!window.confirm(message)) event.preventDefault();
      }}
    >
      <button
        type="submit"
        role="switch"
        aria-checked={live}
        aria-label={label}
        className={`publish-switch ${live ? "is-on" : ""}`}
      >
        <span className="publish-switch-knob" />
      </button>
    </form>
  );
}
