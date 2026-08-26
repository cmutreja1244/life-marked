"use client";

import { FormEvent, useEffect, useState } from "react";
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics";
import { captureUtmFromUrl, getStoredUtm } from "@/lib/utm";

type FormState = "idle" | "loading" | "success" | "error";

export function ContactForm() {
  const [state, setState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    captureUtmFromUrl();
  }, []);

  const handleFocus = () => {
    if (!started) {
      setStarted(true);
      trackEvent(ANALYTICS_EVENTS.contactFormStarted);
    }
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading");
    setErrorMessage("");

    const form = e.currentTarget;
    const data = new FormData(form);
    const utm = getStoredUtm();

    const payload = {
      name: String(data.get("name") ?? ""),
      business: String(data.get("business") ?? ""),
      email: String(data.get("email") ?? ""),
      website: String(data.get("website") ?? "") || undefined,
      message: String(data.get("message") ?? "") || undefined,
      referrer: typeof document !== "undefined" ? document.referrer || undefined : undefined,
      ...utm,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = (await res.json()) as { error?: string };

      if (!res.ok) {
        setState("error");
        setErrorMessage(json.error ?? "Something went wrong. Please try again.");
        return;
      }

      setState("success");
      trackEvent(ANALYTICS_EVENTS.contactFormSubmitted);
      form.reset();
      setStarted(false);
    } catch {
      setState("error");
      setErrorMessage("Unable to send your message. Please try again.");
    }
  }

  if (state === "success") {
    return (
      <div className="editorial-border bg-[#faf8f4] p-8 md:p-10">
        <p className="font-serif text-2xl text-charcoal">
          Thank you. We&apos;ll be in touch shortly.
        </p>
        <button
          type="button"
          className="text-link mt-6"
          onClick={() => setState("idle")}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="editorial-border bg-[#faf8f4] p-8 md:p-10"
      noValidate
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm text-warm-grey">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            onFocus={handleFocus}
            className="mt-2 w-full border-b border-border-warm bg-transparent py-2 text-charcoal outline-none focus:border-charcoal"
          />
        </div>
        <div>
          <label htmlFor="business" className="block text-sm text-warm-grey">
            Business name
          </label>
          <input
            id="business"
            name="business"
            type="text"
            required
            onFocus={handleFocus}
            className="mt-2 w-full border-b border-border-warm bg-transparent py-2 text-charcoal outline-none focus:border-charcoal"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm text-warm-grey">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            onFocus={handleFocus}
            className="mt-2 w-full border-b border-border-warm bg-transparent py-2 text-charcoal outline-none focus:border-charcoal"
          />
        </div>
        <div>
          <label htmlFor="website" className="block text-sm text-warm-grey">
            Website <span className="text-warm-grey/70">(optional)</span>
          </label>
          <input
            id="website"
            name="website"
            type="url"
            onFocus={handleFocus}
            className="mt-2 w-full border-b border-border-warm bg-transparent py-2 text-charcoal outline-none focus:border-charcoal"
          />
        </div>
      </div>

      <div className="mt-6">
        <label htmlFor="message" className="block text-sm text-warm-grey">
          Message <span className="text-warm-grey/70">(optional)</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          onFocus={handleFocus}
          className="mt-2 w-full resize-y border-b border-border-warm bg-transparent py-2 text-charcoal outline-none focus:border-charcoal"
        />
      </div>

      {state === "error" && (
        <p className="mt-4 text-sm text-red-800" role="alert">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={state === "loading"}
        className="btn-primary mt-8 disabled:opacity-60"
      >
        {state === "loading" ? "Sending…" : "I'm interested"}
      </button>
    </form>
  );
}
