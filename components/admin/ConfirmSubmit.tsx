"use client";

import { useFormStatus } from "react-dom";

type ConfirmSubmitProps = {
  message: string;
  children: string;
  className?: string;
  pendingLabel?: string;
};

export function ConfirmSubmit({
  message,
  children,
  className = "btn-primary",
  pendingLabel = "Working...",
}: ConfirmSubmitProps) {
  const { pending } = useFormStatus();
  return (
    <button
      className={className}
      type="submit"
      disabled={pending}
      aria-busy={pending}
      onClick={(event) => {
        if (pending) return;
        if (!window.confirm(message)) event.preventDefault();
      }}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
