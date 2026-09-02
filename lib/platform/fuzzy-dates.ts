export type FuzzyDate = {
  year?: number | null;
  month?: number | null;
  day?: number | null;
  text?: string | null;
};

export function formatFuzzyDate(date: FuzzyDate | null | undefined): string {
  if (!date) return "";
  if (date.text) return date.text;
  if (date.year && date.month && date.day) {
    return new Date(Date.UTC(date.year, date.month - 1, date.day)).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    });
  }
  if (date.year && date.month) {
    return new Date(Date.UTC(date.year, date.month - 1, 1)).toLocaleDateString("en-GB", {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    });
  }
  if (date.year) return String(date.year);
  return "";
}

export function formatYearSpan(birth: FuzzyDate | null, death: FuzzyDate | null): string {
  const start = birth?.year ? String(birth.year) : "";
  const end = death?.year ? String(death.year) : "";
  if (start && end) return `${start} — ${end}`;
  return start || end;
}
