import { BLOG_POSTS } from '../src/lib/blog-data.ts';

const proposed = [
  "college-fest-food-vendor-permit",
  "college-fest-celebrity-hospitality-rider",
  "college-fest-pre-event-press-release",
  "college-fest-flash-mob-choreography",
  "college-fest-eco-friendly-waste-management",
  "college-fest-silent-disco-equipment",
  "college-fest-stage-pyrotechnics-safety",
  "college-fest-battle-of-bands-soundcheck",
  "college-fest-photography-exhibition-gallery",
  "college-fest-alumni-vip-reception",
  "college-fest-street-play-performance-zone",
  "college-fest-technical-symposium-paper-submission",
  "college-fest-creative-writing-prompt",
  "college-fest-short-film-screening",
  "college-fest-live-event-subtitles",
  "college-fest-volunteer-training-slides",
  "college-fest-merchandise-pre-orders",
  "college-fest-sponsorship-proposal-pitch-deck",
  "college-fest-ticketing-early-bird-pricing",
  "college-fest-pro-show-crowd-barricade"
];

const existing = new Set(BLOG_POSTS.map(b => b.slug));
const duplicates = proposed.filter(p => existing.has(p));

console.log('Proposed count:', proposed.length);
console.log('Duplicates found:', duplicates.length);
console.log('Duplicate slugs:', duplicates);
