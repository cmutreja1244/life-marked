export type MemorialRoute = {
  slug: string;
  memorialId: string;
  isCanonical: boolean;
};

export function registerSlug(
  routes: MemorialRoute[],
  slug: string,
  memorialId: string,
): MemorialRoute[] {
  const existing = routes.find((route) => route.slug === slug);
  if (existing && existing.memorialId !== memorialId) {
    throw new Error("This web address is permanently reserved for another memorial.");
  }
  if (existing && existing.memorialId === memorialId) {
    return routes.map((route) => ({
      ...route,
      isCanonical: route.memorialId === memorialId && route.slug === slug,
    }));
  }

  return [
    ...routes.map((route) =>
      route.memorialId === memorialId ? { ...route, isCanonical: false } : route,
    ),
    { slug, memorialId, isCanonical: true },
  ];
}

export function canonicalSlug(routes: MemorialRoute[], memorialId: string): string | null {
  return routes.find((route) => route.memorialId === memorialId && route.isCanonical)?.slug ?? null;
}

export function resolveRoute(routes: MemorialRoute[], slug: string): MemorialRoute | undefined {
  return routes.find((route) => route.slug === slug);
}
