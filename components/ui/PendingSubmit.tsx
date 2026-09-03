"use client";

import { useFormStatus } from "react-dom";

type PendingSubmitProps = {
  children: string;
  pendingLabel?: string;
  className?: string;
};

export function PendingSubmit({
  children,
  pendingLabel = "Sending...",
  className = "btn-primary",
}: PendingSubmitProps) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={className} disabled={pending} aria-busy={pending}>
      {pending ? pendingLabel : children}
    </button>
  );
}
