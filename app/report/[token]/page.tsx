import { store } from "@/lib/platform/store";
import { rateLimit } from "@/lib/rate-limit";
import { redirect } from "next/navigation";

export default async function ReportPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return (
    <main className="mx-auto max-w-lg px-5 py-16">
      <h1 className="font-serif text-4xl">Report a concern</h1>
      <p className="mt-4 text-warm-grey">Tell us if this memorial should not be shown.</p>
      <form
        className="mt-8 space-y-4"
        action={async (formData) => {
          "use server";
          const limited = await rateLimit("report", "global", 20, 10 * 60 * 1000);
          if (!limited.success) return;
          store.createReport(String(formData.get("body") ?? ""), token, String(formData.get("email") ?? "") || null);
          redirect("/report/thanks");
        }}
      >
        <textarea name="body" required className="input-field h-40" />
        <input name="email" type="email" className="input-field" placeholder="Email (optional)" />
        <button className="btn-primary" type="submit">
          Send
        </button>
      </form>
    </main>
  );
}
