"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export function AutosaveForm({
  action,
  children,
  disabled,
}: {
  action: (formData: FormData) => Promise<void>;
  children: ReactNode;
  disabled?: boolean;
}) {
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const formRef = useRef<HTMLFormElement>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const form = formRef.current;
    if (!form || disabled) return;
    const onChange = () => {
      setStatus("saving");
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => {
        void action(new FormData(form))
          .then(() => setStatus("saved"))
          .catch(() => setStatus("error"));
      }, 600);
    };
    form.addEventListener("input", onChange);
    form.addEventListener("change", onChange);
    return () => {
      form.removeEventListener("input", onChange);
      form.removeEventListener("change", onChange);
      window.clearTimeout(timer.current);
    };
  }, [action, disabled]);

  return (
    <form ref={formRef} action={action}>
      <p className="text-sm text-warm-grey" aria-live="polite">
        {status === "saving" ? "Saving" : status === "saved" ? "Saved" : status === "error" ? "Couldn’t save — try again" : " "}
      </p>
      <fieldset disabled={disabled} className="min-w-0">
        {children}
      </fieldset>
      {!disabled ? (
        <button type="submit" className="btn-primary mt-6">
          Save
        </button>
      ) : null}
    </form>
  );
}
