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
      <div>
        <p className="font-serif text-2xl text-charcoal">
          Thank you. We&apos;ll be in touch shortly.
        </p>
        <button type="button" className="text-link mt-4" onClick={() => setState("idle")}>
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="name" className="section-label mb-2 block">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            onFocus={handleFocus}
            className="input-field"
          />
        </div>
        <div>
          <label htmlFor="business" className="section-label mb-2 block">
            Business name
          </label>
          <input
            id="business"
            name="business"
            type="text"
            required
            onFocus={handleFocus}
            className="input-field"
          />
        </div>
        <div>
          <label htmlFor="email" className="section-label mb-2 block">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            onFocus={handleFocus}
            className="input-field"
          />
        </div>
        <div>
          <label htmlFor="website" className="section-label mb-2 block">
            Website
          </label>
          <input
            id="website"
            name="website"
            type="url"
            placeholder="Optional"
            onFocus={handleFocus}
            className="input-field"
          />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="message" className="section-label mb-2 block">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          placeholder="Optional"
          onFocus={handleFocus}
          className="input-field"
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
        className="btn-primary mt-6 disabled:opacity-60"
      >
        {state === "loading" ? "Sending…" : "Send enquiry"}
      </button>
    </form>
  );
}
