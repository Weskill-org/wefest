import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const BLOG_FILE = join(process.cwd(), "src", "lib", "blog-data.ts");

const blogs = [
  [
    "college-fest-hackathon-judging-rubric",
    "College Fest Hackathon Judging Rubric: Ensure Fair Evaluations | WeFest",
    "Standardize hackathon grading with clear judging rubrics, team scoring sheets, sponsor tracks, and live leaderboard displays.",
    "Hackathons using standardized rubrics reduce scoring disputes by 90% and deliver results 3x faster.",
    "Competitions",
    "bg-teal-500/20",
    "hackathon grading framework",
    "Designing Airtight Hackathon Rubrics",
    "Managing Live Scoring and Leaderboards",
    "Leveraging Digital Platforms for Hackathons"
  ],
  [
    "college-fest-stage-lighting-cue-sheet",
    "College Fest Stage Lighting Cue Sheet: Run Flawless Productions | WeFest",
    "Coordinate concert stage lighting with professional cue sheets, volunteer operator training, setup timelines, and safety checks.",
    "Stage lighting cue sheets prevent over 85% of live timing mistakes compared to ad-hoc operator signaling.",
    "Production",
    "bg-indigo-500/20",
    "concert stage lighting workflow",
    "Building Professional Lighting Cue Sheets",
    "Managing Lighting Tech Rehearsals",
    "Safety Standards for Stage Lighting Crews"
  ],
  [
    "college-fest-gaming-tournament-brackets",
    "College Fest Gaming Tournament Brackets: Manage Live Esport Matches | WeFest",
    "Run smooth esports events with bracket setups, rule sheets, system checks, and real-time result logs.",
    "Automated esports bracket tracking reduces matches delay by 60% and maintains high player engagement.",
    "Competitions",
    "bg-purple-500/20",
    "esports tournament bracket management",
    "Choosing the Right Esports Bracket Types",
    "Managing Live Match Schedules and Disconnects",
    "Esports Tournament Production Rules"
  ],
  [
    "college-fest-sound-system-specifications",
    "College Fest Sound System Specifications: Run High-Quality Concerts | WeFest",
    "Optimize fest audio quality with proper sound system specs, stage layout diagrams, mixer controls, and soundcheck rules.",
    "Fests specifying professional sound requirements see a 50% decrease in stage feedback incidents during live performances.",
    "Production",
    "bg-blue-500/20",
    "concert audio mixer settings",
    "Specifying Sound Equipment for Large Crowds",
    "Concert Stage Audio Layouts and Placements",
    "Advanced Live Sound Mixing Strategies"
  ],
  [
    "college-fest-accommodation-room-allotment",
    "College Fest Accommodation Room Allotment: Host Outstation Teams | WeFest",
    "Manage outstation student stays with room allotment sheets, check-in schedules, security guidelines, and volunteer rosters.",
    "Digital room allotment portals decrease check-in queues by 80% and prevent double-booking issues entirely.",
    "Operations",
    "bg-emerald-500/20",
    "outstation student host workflow",
    "Designing Room Allotment Systems",
    "Managing Guest Pickups and Drop-offs",
    "Security Protocols for Student Guest Hostels"
  ],
  [
    "college-fest-celebrity-security-protocol",
    "College Fest Celebrity Security Protocol: Safe Concert Backstages | WeFest",
    "Plan celebrity safety with detailed security paths, VIP tags, backstage barricades, and emergency extraction plans.",
    "Documented celebrity safety paths reduce backstage crowding issues by 90% and protect artists.",
    "Safety",
    "bg-red-500/20",
    "celebrity security backup plan",
    "Securing Stage and Backstage Enclaves",
    "Managing Artist Conveyance and Transit Security",
    "Crisis Extraction and Evacuation Frameworks"
  ],
  [
    "college-fest-sports-tournament-rules",
    "College Fest Sports Tournament Rules: Run Fair Athletics | WeFest",
    "Draft sports event guidelines with fixture schedules, referee rosters, equipment checks, and protest resolution procedures.",
    "Clear sport tournament guidelines reduce on-field protests by 70% and speed up match transitions.",
    "Competitions",
    "bg-amber-500/20",
    "sports event referee roster",
    "Drafting Fair Play Rules and Formats",
    "Scheduling Multi-Ground Fixtures and Referees",
    "Protest Resolution and Appeal Boards"
  ],
  [
    "college-fest-art-marathon-supplies",
    "College Fest Art Marathon Supplies: Plan Fine Arts Events | WeFest",
    "Organize canvas painting contests with supply sheets, desk layouts, prompt timings, and judging parameters.",
    "Pre-packaged art supply kits reduce workshop setup times by 45% and ensure fair resource distribution.",
    "Competitions",
    "bg-pink-500/20",
    "art competition theme prompt",
    "Sourcing and Packaging Art Contest Materials",
    "Managing Venue Desk Layouts and Spot Lightings",
    "Fair Judging Processes in Fine Arts"
  ],
  [
    "college-fest-workshop-speaker-briefing",
    "College Fest Workshop Speaker Briefing: Deliver High Value | WeFest",
    "Prepare expert speaker briefings with schedule logs, mic setups, slide checks, and audience QA processes.",
    "Briefed speakers report a 95% satisfaction score and keep workshop segments on schedule.",
    "Experience",
    "bg-orange-500/20",
    "workshop seminar slide check",
    "Writing Compelling Speaker Briefing Documents",
    "Technical Stage Requirements for Guest Speakers",
    "Audience QA Coordination and Micing"
  ],
  [
    "college-fest-press-media-credential",
    "College Fest Press Media Credential: Streamline Campus Coverage | WeFest",
    "Issue media credentials with reporter passes, camera zones, press kit downloads, and interview schedules.",
    "Structured press passes boost local media coverage by 3x and ensure campus security rules are followed.",
    "Marketing",
    "bg-sky-500/20",
    "campus festival media passes",
    "Designing Press Access Badges and Tiers",
    "Setting Up Press Rooms and Interview Enclaves",
    "Fulfilling Media Kit Downloads and Photo Sharing"
  ],
  [
    "college-fest-first-aid-camp-setup",
    "College Fest First Aid Camp Setup: Secure Medical Care | WeFest",
    "Set up festival first aid zones with doctor lists, equipment checklists, ambulance maps, and volunteer training.",
    "Quick first-aid camps resolve 95% of minor heat and stress cases directly without off-campus hospital transfers.",
    "Safety",
    "bg-red-500/20",
    "festival first aid equipment",
    "Mapping Medical Tents and Ambulance Access Paths",
    "Stocking Crucial First Aid Supplies and Lifeline Gear",
    "Volunteer Training for Medical Support Teams"
  ],
  [
    "college-fest-debate-competition-judging",
    "College Fest Debate Competition Judging: Run Quality Mock Parliaments | WeFest",
    "Manage debate tournaments with speaker timings, score sheets, topic lists, and judge feedback templates.",
    "Debate events using standardized scoring rubrics reduce judging time by 50% between rounds.",
    "Competitions",
    "bg-yellow-500/20",
    "debate contest scoring sheet",
    "Selecting Relevant Debate Topics and Formats",
    "Managing Speaker Timers and Rebuttals",
    "Standardizing Debate Scoring Rubrics"
  ],
  [
    "college-fest-fashion-show-backstage",
    "College Fest Fashion Show Backstage: Manage Greenroom Chaos | WeFest",
    "Coordinate fashion shows with designer slots, changing room maps, lineup sheets, and makeup schedules.",
    "Fashion show cue sheets and greenroom managers eliminate 90% of model lineup delays.",
    "Production",
    "bg-fuchsia-500/20",
    "fashion show model lineup",
    "Designing Backstage Changing Room Layouts",
    "Managing model lineups and sequence cues",
    "Coordination between designers, stylists, and show directors"
  ],
  [
    "college-fest-coupon-reconciliation",
    "College Fest Coupon Reconciliation: Track Vendor Sales | WeFest",
    "Reconcile food stall coupons with payment lists, serial number trackers, commission cuts, and bank transfers.",
    "Digital coupon tracking saves up to 40 hours of manual cash counting and stops billing leakage.",
    "Compliance",
    "bg-emerald-500/20",
    "food stall coupon settlement",
    "Sourcing and Serializing Food Stall Coupons",
    "Live Cashiering and Token Exchange Checks",
    "Settlement calculations and commission cuts"
  ],
  [
    "college-fest-photography-team-brief",
    "College Fest Photography Team Brief: Capture Every Moment | WeFest",
    "Manage volunteer photographers with shot checklists, camera gear checks, folder uploads, and hourly assignments.",
    "Fests with structured photo assignments secure 4x more usable promotional photos for next year.",
    "Operations",
    "bg-cyan-500/20",
    "event photography shot list",
    "Creating Essential Shot Checklists for Festivals",
    "Managing Photographer Slots across Multiple Stages",
    "Cloud Upload Rules and Photo Quality Checks"
  ],
  [
    "college-fest-stage-anchor-script",
    "College Fest Stage Anchor Script: Keep Audiences Hooked | WeFest",
    "Write winning anchor scripts with crowd interactions, sponsor thank-yous, backup filler talks, and guest intros.",
    "Anchor scripts with built-in backup talks prevent crowd loss during stage setup delays.",
    "Experience",
    "bg-violet-500/20",
    "festival anchor script draft",
    "Writing Engaging Intro Hooks for Fest Anchors",
    "Integrating Sponsor Mentions and VIP Welcomes",
    "Filler Dialogues for Technical Sound Delays"
  ],
  [
    "college-fest-live-stream-setup",
    "College Fest Live Stream Setup: Expand Virtual Audiences | WeFest",
    "Stream college concert events with camera connections, bandwidth checks, streaming platforms, and overlays.",
    "Live streaming fest concerts doubles total audience reach and adds extra value for sponsors.",
    "Technology",
    "bg-sky-500/20",
    "concert live streaming gear",
    "Choosing Cameras and Capture Cards for Live Streams",
    "Optimizing Campus Bandwidth and Bitrates",
    "Adding Custom Brand Overlays and Sponsor Banners"
  ],
  [
    "college-fest-lost-found-desk",
    "College Fest Lost and Found Desk: Handle Student Assets | WeFest",
    "Set up lost and found desks with asset intake logs, security tags, owner verification rules, and pickup times.",
    "Lost and found desks return over 75% of missing student wallets and phones on event week.",
    "Operations",
    "bg-slate-500/20",
    "campus festival lost asset log",
    "Setting Up Safe Intake and Storage Cabinets",
    "Owner Verification and Verification Checks",
    "Broadcasting Lost Asset Alerts on Student Portals"
  ],
  [
    "college-fest-exhibition-stall-layout",
    "College Fest Exhibition Stall Layout: Maximize Foot Traffic | WeFest",
    "Design exhibition layouts with stall spacing, electric plugs, volunteer paths, and sponsor maps.",
    "Exhibition layout planning increases stall foot traffic by 40% and boosts partner sales.",
    "Sponsorship",
    "bg-amber-500/20",
    "exhibition stall layout diagram",
    "Mapping Stall Spacing and Electrical Connections",
    "Designing Traffic Flow for High-Density Stalls",
    "Sponsor Stall Positions and Premium Placements"
  ],
  [
    "college-fest-vip-hospitality-menu",
    "College Fest VIP Hospitality Menu: Cater for Chief Guests | WeFest",
    "Plan VIP dining services with food menu plans, server rosters, lounge designs, and feedback cards.",
    "Premium VIP catering leads to better faculty and chief guest ratings for institutional events.",
    "Experience",
    "bg-yellow-500/20",
    "vip guest catering menu",
    "Designing the VIP Lounge Layout and Service Style",
    "Curating Menu Plans for Diverse Chief Guests",
    "Catering Staff Briefing and Service Quality Checks"
  ]
];

function toBlog(row, index) {
  const [slug, title, excerpt, stat, category, cover, secondaryKeyword, deepDiveOne, deepDiveTwo, deepDiveThree] = row;
  const authors = ["Aarohi Shah", "Vivaan Iyer", "Rudra Nair", "Mira Kapoor", "Neil Dutta", "Sana Rao", "Kabir Sethi", "Anaya Bose"];
  const primaryKeyword = slug.replace(/-/g, " ");
  return {
    slug,
    title,
    excerpt,
    author: authors[index % authors.length],
    date: `May ${String(20 + index).padStart(2, "0")}, 2027`,
    readTime: "12 min read",
    category,
    cover,
    primaryKeyword,
    secondaryKeyword,
    deepDiveOne,
    deepDiveTwo,
    deepDiveThree,
    stat,
  };
}

function imagePlan(primaryKeyword) {
  const safe = primaryKeyword.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `### SEO Image Plan
- Featured image: wefest-${safe}-hero-01.webp - Ultra-modern glassmorphic WeFest dashboard for ${primaryKeyword}, transparent panels, QR tickets, sponsor badges, analytics cards, and electric purple-blue-pink-orange gradient.
- Section image: wefest-${safe}-workflow-02.webp - Frosted workflow interface showing owners, approvals, student records, payments, sponsor proof, alerts, and reports.
- Infographic: wefest-${safe}-guide-03.webp - Five-step glassmorphic implementation guide with numbered panels, clean typography, and youthful festival styling.

Alt text example: Glassmorphic WeFest dashboard showing ${primaryKeyword} workflow for smoother college fest management and measurable outcomes.`;
}

function generateContent(blog) {
  const { primaryKeyword, secondaryKeyword, deepDiveOne, deepDiveTwo, deepDiveThree, stat } = blog;

  return `College festivals succeed when student energy is backed by operational clarity. Behind every great stage moment, sponsor activation, ticket scan, volunteer handoff, and post-event report is a workflow that someone planned before the pressure arrived. \${primaryKeyword} gives your committee a focused way to manage one of those critical workflows with confidence.

WeFest gives college organizers one platform for registrations, QR ticketing, sponsorship management, payments, volunteer coordination, team communication, digital certificates, mobile dashboards, and analytics. This guide shows how to build \${primaryKeyword} with practical SEO structure, clear ownership, sponsor-ready reporting, and repeatable event operations.

## Why \${primaryKeyword} Matters More Than Ever
Modern college fests must satisfy students, sponsors, faculty, vendors, artists, volunteers, alumni, and safety teams at the same time. \${stat} Without a structured workflow, organizers waste hours chasing updates, rebuilding lists, and explaining decisions after the fact.

WeFest helps committees turn \${primaryKeyword} into a connected system. Instead of relying on scattered spreadsheets and chat screenshots, your team can connect tickets, payments, sponsor deliverables, forms, tasks, certificates, and analytics in one dashboard.

### Comprehensive Overview for College Fests
\${primaryKeyword} is the process of defining owners, data fields, approval checkpoints, communication timing, risk controls, success metrics, and reporting outputs. A strong workflow is simple enough for volunteers and reliable enough for sponsor conversations.

### Why It Matters for Organizers
College fest committees change every year, so repeatability matters. \${secondaryKeyword} helps each new team inherit a working process instead of rebuilding from memory during crunch time.

### Internal Linking Context
Use this article with WeFest guides on sponsorship proposals, event ticketing, QR check-in, volunteer scheduling, vendor coordination, faculty approvals, student support, digital certificates, and post-event analytics.

## H2: \${deepDiveOne}
\${deepDiveOne} gives \${primaryKeyword} a strategic foundation. Before public launch, define what must happen, who owns each step, which approvals are required, and how the committee will measure success.

### Component Analysis
Break the workflow into planning, setup, validation, communication, execution, monitoring, reporting, and handover. Each component needs one owner and one measurable output. WeFest supports this through event forms, ticket tiers, sponsor records, payment visibility, QR scans, role-based access, task boards, certificates, and dashboards.

### Implementation Strategies
Start with the riskiest point. If the workflow affects money, safety, access, sponsor value, faculty approval, student data, stage timing, or certificates, test it early. Use WeFest to document the process and keep the final version accessible to the full team.

### WeFest Platform Features
WeFest can support \${primaryKeyword} through custom fields, automated confirmations, ticket settings, QR validation, sponsor deliverable tracking, payment records, volunteer roles, mobile dashboards, certificate delivery, and analytics exports.

### Real-World Applications
For large inter-college fests, \${primaryKeyword} can reduce queues, protect sponsor trust, speed faculty reviews, and improve student experience. For smaller campus events, it helps a lean team operate professionally without adding more tools.

## H2: \${deepDiveTwo}
\${deepDiveTwo} turns strategy into repeatable execution. This is where committees avoid duplicate lists, vague owners, missing proof, late approvals, and weak handover notes.

### Common Challenges
Common problems include scattered records, unclear owners, untested QR flows, payment mismatches, missing sponsor assets, delayed faculty approvals, repeated student questions, and manual reports built after the event.

### Proven Solutions
Use this operating rhythm:

1. Assign the workflow owner and backup owner.
2. Define the audience, fields, approval path, timeline, and report output.
3. Configure forms, ticket rules, sponsor records, tasks, or payments in WeFest.
4. Test the full journey with committee members.
5. Launch with short mobile-friendly instructions.
6. Monitor progress, risks, and exceptions.
7. Export proof, reports, and handover notes after the event.

### Technology Integration
Connect \${secondaryKeyword} with registrations, ticketing, payments, sponsor records, volunteer coordination, certificates, mobile alerts, and analytics. WeFest keeps every important action tied to the event record.

### Best Practices
Keep rules simple, make owners visible, review dashboards on schedule, and capture proof during live execution. Strong committees design every workflow for busy students and volunteers using phones.

## H2: \${deepDiveThree}
\${deepDiveThree} helps committees improve year after year. A strong workflow should create useful data, not just complete tasks.

### Advanced Techniques
Segment records by college, source, ticket tier, sponsor package, volunteer role, event track, venue, time slot, or issue type. Segmentation reveals patterns that broad totals hide.

### Innovation Opportunities
Add QR validation, automated reminders, sponsor proof capture, digital forms, live dashboards, mobile alerts, post-event surveys, and certificate automation. WeFest keeps these improvements connected to one source of truth.

### Platform Capabilities
WeFest can track registrations, payments, check-ins, attendance, sponsor deliverables, coupon redemptions, booth activity, volunteer completion, issue resolution, certificate distribution, feedback, and exported reports.

### Success Metrics
Measure completion rate, response time, conversion rate, revenue impact, sponsor satisfaction, approval speed, volunteer performance, attendee feedback, issue volume, and report delivery.

## H2: Step-by-Step Implementation Guide
Use this framework to launch \${primaryKeyword} without last-minute chaos.

### Planning Phase
Define the objective, audience, owner, backup owner, timeline, approval path, risk level, budget impact, data fields, and reporting format. Configure WeFest before public promotion starts.

### Execution Phase
Launch the workflow, send segmented reminders, monitor dashboards, and solve issues quickly. WeFest helps organizers see status without repeatedly chasing every sub-team.

### Monitoring and Optimization
Review performance before launch, during promotion, on event day, and after the festival. Watch for drop-offs, duplicate entries, missing proof, unpaid records, unresolved tasks, and repeated questions.

## H2: Essential Tools and Resources
Use a tool stack that reduces confusion. WeFest should be the source of truth, while design, messaging, storage, and livestream tools support specific jobs.

### Required Software and Platforms
Use WeFest for registrations, QR ticketing, sponsorship, payments, certificates, analytics, and team coordination. Use official college channels for trusted announcements and design tools for campaign assets.

### WeFest Feature Suite
Key WeFest features include custom event forms, ticket tiers, QR scanning, sponsor dashboards, payment records, team roles, task boards, automated confirmations, digital certificates, mobile dashboards, and analytics exports.

### Complementary Solutions
Email, WhatsApp, social schedulers, design tools, photo storage, and helpdesk systems can support the workflow. Keep WeFest as the operating record so data survives committee handover.

### Free Resources
Create reusable templates for sponsor updates, risk logs, faculty approvals, judge rubrics, vendor checklists, event-day briefings, finance summaries, support scripts, and post-event reports.

## H2: 7 Mistakes to Avoid
Avoid these mistakes when building \${primaryKeyword}.

### Critical Errors
- Starting without a named owner.
- Keeping separate lists for the same audience.
- Collecting student data without a clear purpose.
- Forgetting mobile-first instructions.
- Testing QR, payment, or approval flows too late.
- Missing sponsor proof during live execution.
- Ending without reports and handover notes.

### Prevention Strategies
Build the workflow in WeFest, test early, assign owners, automate confirmations, capture proof live, and review dashboards before small gaps become public problems.

### WeFest Safeguards
WeFest reduces risk through connected records, role-based access, QR validation, payment visibility, sponsor tracking, volunteer coordination, certificate delivery, mobile dashboards, and post-event analytics.

\${imagePlan(primaryKeyword)}

## H2: Frequently Asked Questions

**What is \${primaryKeyword} for college fests?**
\${primaryKeyword} is a structured workflow for managing a specific part of a college festival. It defines ownership, data, approvals, communication, execution, measurement, and handover.

**Why does \${primaryKeyword} matter for event organizers?**
It matters because college fests involve many stakeholders and fast decisions. WeFest keeps records, roles, tickets, payments, sponsor proof, and reports connected.

**How does \${secondaryKeyword} work?**
\${secondaryKeyword} works by mapping the journey from setup to final report. The committee defines fields, owners, approvals, reminders, exceptions, and success metrics.

**What steps are needed to implement \${primaryKeyword}?**
Define the audience, owner, data fields, approval path, timeline, risk points, and reporting output. Then configure the workflow in WeFest, test it, launch it, monitor it, and export results.

**How long does setup take?**
Simple workflows can be launched quickly, but workflows involving money, sponsors, access, safety, judging, or certificates should be planned and tested several weeks before event day.

**What budget is required for \${primaryKeyword}?**
Budget depends on event scale, staff, tools, print needs, and sponsor expectations. WeFest reduces hidden costs by lowering manual work, errors, and repeated coordination.

**Do I need technical skills for WeFest?**
No. WeFest is designed for student organizers and faculty teams. Most setup happens through forms, dashboard settings, ticket rules, sponsor records, and team permissions.

**Is \${primaryKeyword} mobile-friendly?**
Yes. Mobile access is essential because attendees, volunteers, and organizers often act from phones during promotion and live operations. WeFest supports mobile-ready workflows.

**How does WeFest integrate with other tools?**
WeFest can remain the source of truth while teams use email, WhatsApp, design tools, social platforms, storage folders, and livestream tools for supporting work.

**How does WeFest compare with manual spreadsheets?**
Spreadsheets store rows, but they do not connect QR scans, payments, tickets, sponsor deliverables, reminders, certificates, and analytics. WeFest connects the workflow end to end.

**Can sponsors benefit from \${primaryKeyword}?**
Yes. Sponsors benefit when committees can prove attendance, visibility, engagement, leads, redemptions, booth activity, content delivery, or student response with reliable records.

**What should we measure after the event?**
Measure completion rate, response time, attendance, revenue effect, sponsor outcomes, volunteer performance, issue resolution, feedback, and report delivery.

**How does this help future committees?**
It creates reusable templates, benchmarks, proof, and handover notes. Future organizers can begin from a tested workflow instead of rebuilding from memory.

**What is the biggest mistake to avoid?**
The biggest mistake is unclear ownership. Every workflow needs one accountable owner, one backup owner, and one simple escalation path.

**How do we get started with WeFest?**
Create your event, configure forms or ticket settings, assign roles, test the journey, and monitor progress through the WeFest dashboard.

## H2: Conclusion
\${primaryKeyword} helps college fest committees replace last-minute scrambling with a workflow that is visible, testable, and measurable. When the process runs through WeFest, teams coordinate faster, sponsors receive stronger proof, faculty get clearer oversight, and students enjoy a smoother festival.

**Key Takeaways:**
- Treat \${primaryKeyword} as a planned workflow.
- Assign owners before launch.
- Use WeFest to connect registrations, tickets, payments, sponsors, volunteers, certificates, and analytics.
- Keep instructions short and mobile-friendly.
- Capture reports and handover notes for the next committee.

WeFest gives college organizers the infrastructure to plan professionally, execute confidently, and prove the value of every major festival decision.

**Ready to make your next fest easier to run?**
Use WeFest to centralize your workflow, reduce manual pressure, and create a campus event that students remember and sponsors respect. [Get Started Free] | [Schedule Personal Demo] | [Contact Our Team]`;
}

const fileContent = readFileSync(BLOG_FILE, "utf8");
const existingSlugs = new Set([...fileContent.matchAll(/slug:\s*"([^"]+)"/g)].map((match) => match[1]));
const newBlogs = blogs.map(toBlog).filter((blog) => !existingSlugs.has(blog.slug));

if (newBlogs.length === 0) {
  console.log("No new blogs to add. All batch 21 slugs already exist.");
  process.exit(0);
}

const closingIndex = fileContent.lastIndexOf("];");
if (closingIndex === -1) {
  throw new Error("Could not find BLOG_POSTS closing array marker.");
}

const existingContent = fileContent.substring(0, closingIndex).trimEnd();

let newEntries = "";
for (const blog of newBlogs) {
  const content = generateContent(blog);
  const escaped = content.replace(/`/g, "\\`").replace(/\${/g, "\\${");
  newEntries += `
  ,{
    slug: ${JSON.stringify(blog.slug)},
    title: ${JSON.stringify(blog.title)},
    excerpt: ${JSON.stringify(blog.excerpt)},
    author: ${JSON.stringify(blog.author)},
    date: ${JSON.stringify(blog.date)},
    readTime: ${JSON.stringify(blog.readTime)},
    category: ${JSON.stringify(blog.category)},
    cover: ${JSON.stringify(blog.cover)},
    content: \`${escaped}\`
  }`;
}

writeFileSync(BLOG_FILE, `${existingContent}${newEntries}\n];\n`, "utf8");
console.log(`Added ${newBlogs.length} new SEO blogs to blog-data.ts`);
