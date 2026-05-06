export type Event = {
  id: string;
  title: string;
  college: string;
  collegeId: string;
  date: string;
  city: string;
  category: "Cultural" | "Tech" | "Sports" | "Business" | "Arts";
  cover: string;
  attendees: number;
  priceFrom: number;
  description: string;
  organizer: string;
};

export const colleges = [
  { id: "iitb", name: "IIT Bombay", domain: "iitb.ac.in", city: "Mumbai", fests: 4 },
  { id: "iitd", name: "IIT Delhi", domain: "iitd.ac.in", city: "Delhi", fests: 3 },
  { id: "bits", name: "BITS Pilani", domain: "pilani.bits-pilani.ac.in", city: "Pilani", fests: 5 },
  { id: "nitt", name: "NIT Trichy", domain: "nitt.edu", city: "Trichy", fests: 3 },
  { id: "vit", name: "VIT Vellore", domain: "vit.ac.in", city: "Vellore", fests: 4 },
  { id: "du", name: "Delhi University", domain: "du.ac.in", city: "Delhi", fests: 6 },
  { id: "srcc", name: "SRCC", domain: "srcc.du.ac.in", city: "Delhi", fests: 2 },
  { id: "manipal", name: "Manipal Institute", domain: "manipal.edu", city: "Manipal", fests: 4 },
];

export const events: Event[] = [
  {
    id: "mood-indigo-26",
    title: "Mood Indigo 2026",
    college: "IIT Bombay",
    collegeId: "iitb",
    date: "2026-12-22",
    city: "Mumbai",
    category: "Cultural",
    cover: "from-fuchsia-500 via-purple-600 to-indigo-700",
    attendees: 80000,
    priceFrom: 499,
    description: "Asia's largest college cultural festival — 4 nights, 200+ events, headline concerts.",
    organizer: "Mood Indigo Council",
  },
  {
    id: "techfest-26",
    title: "Techfest 2026",
    college: "IIT Bombay",
    collegeId: "iitb",
    date: "2026-12-26",
    city: "Mumbai",
    category: "Tech",
    cover: "from-cyan-400 via-sky-500 to-blue-700",
    attendees: 65000,
    priceFrom: 299,
    description: "India's largest science & tech festival. Robowars, hackathons, lectures by Nobel laureates.",
    organizer: "Techfest Team",
  },
  {
    id: "rendezvous-26",
    title: "Rendezvous 2026",
    college: "IIT Delhi",
    collegeId: "iitd",
    date: "2026-10-15",
    city: "Delhi",
    category: "Cultural",
    cover: "from-rose-500 via-orange-500 to-amber-500",
    attendees: 70000,
    priceFrom: 599,
    description: "Annual cultural extravaganza with international artists and 150+ competitions.",
    organizer: "BSA IITD",
  },
  {
    id: "oasis-26",
    title: "Oasis 2026",
    college: "BITS Pilani",
    collegeId: "bits",
    date: "2026-11-04",
    city: "Pilani",
    category: "Cultural",
    cover: "from-emerald-400 via-teal-500 to-cyan-600",
    attendees: 50000,
    priceFrom: 399,
    description: "The ultimate desert fest. Music, dance, drama, and a legendary star night.",
    organizer: "Department of Oasis",
  },
  {
    id: "apogee-26",
    title: "APOGEE 2026",
    college: "BITS Pilani",
    collegeId: "bits",
    date: "2026-03-28",
    city: "Pilani",
    category: "Tech",
    cover: "from-indigo-500 via-violet-600 to-purple-700",
    attendees: 30000,
    priceFrom: 249,
    description: "India's first-ever student-run technical fest. Workshops, competitions, exhibitions.",
    organizer: "APOGEE COSAA",
  },
  {
    id: "festember-26",
    title: "Festember 2026",
    college: "NIT Trichy",
    collegeId: "nitt",
    date: "2026-09-25",
    city: "Trichy",
    category: "Cultural",
    cover: "from-pink-500 via-red-500 to-orange-500",
    attendees: 45000,
    priceFrom: 349,
    description: "Inter-collegiate cultural fest with pro shows, lit events and a buzzing energy.",
    organizer: "Festember Core",
  },
  {
    id: "riviera-26",
    title: "Riviera 2026",
    college: "VIT Vellore",
    collegeId: "vit",
    date: "2026-02-20",
    city: "Vellore",
    category: "Sports",
    cover: "from-blue-500 via-indigo-600 to-violet-700",
    attendees: 60000,
    priceFrom: 449,
    description: "South India's biggest international youth festival. Sports, music, esports.",
    organizer: "Riviera VIT",
  },
  {
    id: "tarang-26",
    title: "Tarang 2026",
    college: "SRCC",
    collegeId: "srcc",
    date: "2026-02-08",
    city: "Delhi",
    category: "Business",
    cover: "from-amber-400 via-orange-500 to-rose-600",
    attendees: 20000,
    priceFrom: 199,
    description: "India's premier B-school style undergrad fest with case comps and finance summits.",
    organizer: "SRCC Cultural Council",
  },
];

export const sponsorshipTiers = [
  { name: "Title", price: 2500000, perks: ["Naming rights", "Stage branding", "Hero placement", "5 keynote slots"] },
  { name: "Platinum", price: 1200000, perks: ["Logo on all assets", "Dedicated booth", "2 keynote slots"] },
  { name: "Gold", price: 600000, perks: ["Logo placement", "Booth", "Social shoutouts"] },
  { name: "Silver", price: 250000, perks: ["Logo placement", "Combined booth"] },
];

export const myTickets = [
  { id: "TKT-8821", event: "Mood Indigo 2026", date: "2026-12-22", tier: "Pro Pass", code: "MI26-8821-AX" },
  { id: "TKT-7102", event: "Oasis 2026", date: "2026-11-04", tier: "Day 1", code: "OAS26-7102-KQ" },
];
