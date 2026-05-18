/** Sentinel stored in `events.attendees` when capacity is unlimited. */
export const UNLIMITED_EVENT_CAPACITY = -1;

export function isUnlimitedEventCapacity(attendees: number | null | undefined): boolean {
  return attendees === UNLIMITED_EVENT_CAPACITY;
}

export function formatEventCapacity(attendees: number | null | undefined): string {
  if (attendees == null || isUnlimitedEventCapacity(attendees)) return "Unlimited";
  if (attendees <= 0) return "Not set";
  return attendees.toLocaleString("en-IN");
}

export function capacityFromDb(attendees: number | null | undefined): {
  unlimited: boolean;
  value: string;
} {
  if (isUnlimitedEventCapacity(attendees)) {
    return { unlimited: true, value: "" };
  }
  return {
    unlimited: false,
    value: attendees && attendees > 0 ? String(attendees) : "",
  };
}

export function capacityToDb(unlimited: boolean, value: string): number {
  if (unlimited) return UNLIMITED_EVENT_CAPACITY;
  const n = parseInt(value, 10);
  return Number.isFinite(n) && n > 0 ? n : 0;
}
