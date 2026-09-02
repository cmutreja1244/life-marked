import { getSession } from "@/lib/auth/session";
import { createServiceClient } from "@/lib/supabase/service";
import { store, type PublicLookup } from "@/lib/platform/store";

export async function lookupPublishedMemorial(opts: {
  slug?: string;
  token?: string;
}): Promise<PublicLookup> {
  const session = await getSession();
  const userId = session?.user.id ?? null;

  const supabase = createServiceClient();
  if (supabase) {
    const { data, error } = await supabase.rpc("get_published_snapshot", {
      p_slug: opts.slug ?? null,
      p_token: opts.token ?? null,
    });
    if (!error && data) {
      const payload = data as {
        unavailable?: boolean;
        snapshot?: PublicLookup extends { outcome: "ok" } ? never : unknown;
        is_demo?: boolean;
        visibility?: "unlisted" | "public" | "private";
        indexable?: boolean;
        canonical_slug?: string;
        public_token?: string;
      };
      if (payload.unavailable) return { outcome: "unavailable", memorialId: "remote" };
      if (payload.snapshot && payload.canonical_slug && payload.public_token) {
        return {
          outcome: "ok",
          snapshot: payload.snapshot as import("@/lib/platform/snapshot").PublishedSnapshot,
          canonicalSlug: payload.canonical_slug,
          requestedSlug: opts.slug ?? null,
          publicToken: payload.public_token,
          isDemo: Boolean(payload.is_demo),
          visibility: payload.visibility ?? "unlisted",
          indexable: Boolean(payload.indexable),
        };
      }
    }
  }

  return store.lookupPublic({ ...opts, userId });
}
