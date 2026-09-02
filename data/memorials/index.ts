import { margaretCampbell } from "./margaret-campbell";
import type { Memorial } from "./types";

const memorials: Memorial[] = [margaretCampbell];

export function getMemorial(slug: string): Memorial | undefined {
  return memorials.find((memorial) => memorial.slug === slug);
}

export function getMemorialSlugs(): string[] {
  return memorials.map((memorial) => memorial.slug);
}

export type { Memorial } from "./types";
