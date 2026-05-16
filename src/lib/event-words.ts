/**
 * Two-Word Event Slug Generator (what2words)
 *
 * Generates memorable, festival-themed two-word codes for events.
 * Format: adjective.noun  (e.g. "cosmic.summit", "neon.rhythm")
 *
 * Inspired by what3words.com — but with 2 words for event discovery.
 */

// ── Adjectives (~160 curated, festival-friendly) ──────────────────────────────
const ADJECTIVES = [
  "vibrant", "cosmic", "golden", "electric", "midnight", "neon", "blazing",
  "crystal", "stellar", "infinite", "phantom", "radiant", "sonic", "lunar",
  "solar", "atomic", "velvet", "crimson", "sapphire", "emerald", "amber",
  "silver", "azure", "scarlet", "ivory", "obsidian", "jade", "ruby",
  "coral", "indigo", "violet", "turquoise", "magenta", "copper", "bronze",
  "arctic", "tropical", "thunder", "mystic", "primal", "wild", "savage",
  "fierce", "bold", "swift", "rapid", "brave", "noble", "grand", "royal",
  "epic", "supreme", "prime", "ultra", "mega", "hyper", "super", "mighty",
  "vivid", "bright", "dazzle", "glow", "flash", "spark", "flame", "blaze",
  "storm", "frost", "ocean", "desert", "forest", "urban", "metro", "retro",
  "future", "ancient", "modern", "classic", "digital", "analog", "cyber",
  "quantum", "astral", "zenith", "summit", "peak", "apex", "vertex",
  "chrome", "pixel", "prism", "spectrum", "aurora", "nebula", "comet",
  "orbital", "gravity", "magnetic", "dynamic", "kinetic", "static",
  "harmonic", "melodic", "rhythmic", "acoustic", "amplified", "resonant",
  "lucid", "serene", "tranquil", "chaotic", "frenzy", "rogue", "rebel",
  "shadow", "stealth", "silent", "roaring", "booming", "soaring", "rising",
  "rolling", "drifting", "floating", "spinning", "twisting", "pulsing",
  "glowing", "shining", "burning", "frozen", "molten", "liquid", "solid",
  "hollow", "dense", "heavy", "light", "deep", "vast", "wide", "high",
  "free", "open", "true", "pure", "rare", "raw", "real", "live", "fresh",
  "sharp", "keen", "crisp", "clear", "loud", "fast", "cool", "warm",
  "dark", "pale", "rich", "calm", "lush", "bold", "teal", "aqua",
];

// ── Nouns (~160 curated, event/festival themed) ──────────────────────────────
const NOUNS = [
  "summit", "aurora", "festival", "horizon", "thunder", "phoenix", "rhythm",
  "spark", "echo", "wave", "pulse", "vortex", "cascade", "nexus", "ember",
  "zenith", "orbit", "prism", "atlas", "titan", "forge", "reign", "realm",
  "arena", "stage", "encore", "anthem", "chorus", "verse", "melody",
  "harmony", "tempo", "beat", "groove", "flow", "drift", "rush", "surge",
  "blast", "boom", "roar", "flash", "flame", "glow", "shine", "glare",
  "storm", "frost", "blaze", "comet", "meteor", "nebula", "galaxy",
  "cosmos", "eclipse", "solstice", "equinox", "dawn", "dusk", "twilight",
  "midnight", "moonrise", "sunrise", "sunset", "daybreak", "nightfall",
  "thunder", "lightning", "tornado", "typhoon", "monsoon", "tempest",
  "voyage", "quest", "odyssey", "journey", "safari", "venture", "trail",
  "rally", "parade", "march", "sprint", "marathon", "relay", "race",
  "arena", "coliseum", "stadium", "amphitheater", "plaza", "bazaar",
  "carnival", "circus", "fiesta", "gala", "jubilee", "bash", "rave",
  "concert", "recital", "showcase", "spectacle", "extravaganza", "bonanza",
  "legend", "saga", "chronicle", "fable", "epic", "ballad", "opus",
  "canvas", "mosaic", "tapestry", "mural", "collage", "fresco", "sketch",
  "crown", "throne", "scepter", "shield", "banner", "crest", "sigil",
  "falcon", "hawk", "eagle", "raven", "wolf", "lion", "tiger", "panther",
  "dragon", "serpent", "griffin", "kraken", "hydra", "sphinx", "minotaur",
  "citadel", "bastion", "fortress", "tower", "bridge", "gateway", "portal",
  "lantern", "beacon", "torch", "candle", "flare", "signal", "compass",
  "anchor", "helm", "rudder", "keel", "mast", "sail", "oar", "paddle",
  "crystal", "diamond", "pearl", "opal", "onyx", "topaz", "quartz",
  "cobalt", "mercury", "platinum", "titanium", "carbon", "silicon", "neon",
];

/**
 * Generate a random two-word slug: adjective.noun
 */
export function generateEventSlug(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  return `${adj}.${noun}`;
}

/**
 * Validate that a slug follows the word1.word2 format (lowercase alpha only)
 */
export function isValidSlug(slug: string): boolean {
  return /^[a-z]{2,}\.[a-z]{2,}$/.test(slug);
}

/**
 * Validate slug format with a more lenient check (for the input fields)
 */
export function isValidSlugFormat(slug: string): boolean {
  return /^[a-z]+\.[a-z]+$/.test(slug);
}

/**
 * Parse a slug into its two component words
 */
export function parseSlug(slug: string): { word1: string; word2: string } {
  const parts = slug.split(".");
  return { word1: parts[0] || "", word2: parts[1] || "" };
}

/**
 * Join two words into a slug
 */
export function formatSlug(word1: string, word2: string): string {
  return `${word1.toLowerCase().replace(/[^a-z]/g, "")}.${word2.toLowerCase().replace(/[^a-z]/g, "")}`;
}

/**
 * Get the total number of possible unique combinations
 */
export function getTotalCombinations(): number {
  return ADJECTIVES.length * NOUNS.length;
}

/**
 * Get the list of available adjectives (for autocomplete / suggestions)
 */
export function getAdjectives(): readonly string[] {
  return ADJECTIVES;
}

/**
 * Get the list of available nouns (for autocomplete / suggestions)
 */
export function getNouns(): readonly string[] {
  return NOUNS;
}
