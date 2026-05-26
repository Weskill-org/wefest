// ─── Student Preference Constants & Matching Utilities ───────────────────────

export interface PreferenceCategory {
  id: string;
  label: string;
  icon: string; // emoji for simple display
  /** Maps to event.category values */
  eventCategory: string;
  interests: string[];
}

export const PREFERENCE_CATEGORIES: PreferenceCategory[] = [
  {
    id: "technical",
    label: "Technical",
    icon: "💻",
    eventCategory: "Tech",
    interests: [
      "Hackathons",
      "Coding Competitions",
      "Data Science",
      "Machine Learning",
      "AI",
      "Software Development",
      "Web Development",
      "Robotics",
      "Cybersecurity",
      "IT Workshops",
    ],
  },
  {
    id: "cultural",
    label: "Cultural",
    icon: "🎭",
    eventCategory: "Cultural",
    interests: [
      "Music",
      "Dance",
      "Drama",
      "Art",
      "Fashion Shows",
      "Photography",
      "Debates",
      "College Cultural Fests",
    ],
  },
  {
    id: "sports",
    label: "Sports",
    icon: "🏆",
    eventCategory: "Sports",
    interests: [
      "Cricket",
      "Football",
      "Basketball",
      "Athletics",
      "Badminton",
      "Volleyball",
      "Esports",
      "Other Sports Events",
    ],
  },
];

/** Flat array of every selectable interest tag. */
export const ALL_INTERESTS: string[] = PREFERENCE_CATEGORIES.flatMap(
  (c) => c.interests,
);

/**
 * Determines which parent category IDs are implied by a set of selected interests.
 * e.g. selecting "Hackathons" implies the "technical" category.
 */
export function getImpliedCategories(selectedInterests: string[]): string[] {
  const lower = new Set(selectedInterests.map((s) => s.toLowerCase()));
  return PREFERENCE_CATEGORIES.filter((cat) =>
    cat.interests.some((interest) => lower.has(interest.toLowerCase())),
  ).map((cat) => cat.eventCategory);
}

/**
 * Check whether an event matches a student's selected preference interests.
 *
 * Matching rules:
 * 1. If the event's category maps to a parent group that the student selected
 *    any sub-interest from → match.
 * 2. If any of the event's tags (case-insensitive) match any of the student's
 *    selected interests → match.
 */
export function eventMatchesPreferences(
  event: { category?: string | null; tags?: string[] | null },
  preferences: string[],
): boolean {
  if (!preferences || preferences.length === 0) return false;

  const prefLower = new Set(preferences.map((p) => p.toLowerCase()));

  // Direct tag match
  if (event.tags && event.tags.length > 0) {
    for (const tag of event.tags) {
      if (prefLower.has(tag.toLowerCase())) return true;
    }
  }

  // Category match via implied categories
  if (event.category) {
    const impliedCats = getImpliedCategories(preferences);
    if (impliedCats.some((c) => c.toLowerCase() === event.category!.toLowerCase())) {
      return true;
    }
  }

  return false;
}

/**
 * Extract all unique tags from a set of events for use in filter chips.
 */
export function extractUniqueTags(
  events: Array<{ tags?: string[] | null }>,
): string[] {
  const tagSet = new Set<string>();
  for (const event of events) {
    if (event.tags) {
      for (const tag of event.tags) {
        tagSet.add(tag);
      }
    }
  }
  return Array.from(tagSet).sort();
}
