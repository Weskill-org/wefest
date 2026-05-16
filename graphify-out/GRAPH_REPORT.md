# Graph Report - wefest  (2026-05-16)

## Corpus Check
- 239 files · ~158,346 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1100 nodes · 3052 edges · 82 communities (66 shown, 16 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `762197fb`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Routing & Navigation|Routing & Navigation]]
- [[_COMMUNITY_Forms & User Interface|Forms & User Interface]]
- [[_COMMUNITY_Event & College Cards|Event & College Cards]]
- [[_COMMUNITY_Supabase & Auth|Supabase & Auth]]
- [[_COMMUNITY_Sidebar & Layout|Sidebar & Layout]]
- [[_COMMUNITY_Admin Management|Admin Management]]
- [[_COMMUNITY_Region & Global State|Region & Global State]]
- [[_COMMUNITY_Organizer Dashboard|Organizer Dashboard]]
- [[_COMMUNITY_Stat Tiles & Pagination|Stat Tiles & Pagination]]
- [[_COMMUNITY_UI Primitives|UI Primitives]]
- [[_COMMUNITY_Menubar & Toolbars|Menubar & Toolbars]]
- [[_COMMUNITY_Carousel Components|Carousel Components]]
- [[_COMMUNITY_Form Controls|Form Controls]]
- [[_COMMUNITY_Charting & Data Viz|Charting & Data Viz]]
- [[_COMMUNITY_Command Palette|Command Palette]]
- [[_COMMUNITY_Context Menus|Context Menus]]
- [[_COMMUNITY_Alert Dialogs|Alert Dialogs]]
- [[_COMMUNITY_Table Components|Table Components]]
- [[_COMMUNITY_Blog & Content|Blog & Content]]
- [[_COMMUNITY_Student Dashboard|Student Dashboard]]
- [[_COMMUNITY_Drawer Components|Drawer Components]]
- [[_COMMUNITY_Breadcrumbs|Breadcrumbs]]
- [[_COMMUNITY_Navigation Menus|Navigation Menus]]
- [[_COMMUNITY_Toggles & Buttons|Toggles & Buttons]]
- [[_COMMUNITY_Card Layouts|Card Layouts]]
- [[_COMMUNITY_Quick Actions|Quick Actions]]
- [[_COMMUNITY_Alert Components|Alert Components]]
- [[_COMMUNITY_OTP Input|OTP Input]]
- [[_COMMUNITY_Admin Layout|Admin Layout]]
- [[_COMMUNITY_Student Layout|Student Layout]]
- [[_COMMUNITY_Scripts & Utilities|Scripts & Utilities]]
- [[_COMMUNITY_Refund Policy|Refund Policy]]
- [[_COMMUNITY_College Directory|College Directory]]
- [[_COMMUNITY_Cookie Policy|Cookie Policy]]
- [[_COMMUNITY_Privacy Policy|Privacy Policy]]
- [[_COMMUNITY_Terms & Conditions|Terms & Conditions]]
- [[_COMMUNITY_Performance Snapshot|Performance Snapshot]]
- [[_COMMUNITY_Student Events|Student Events]]
- [[_COMMUNITY_Blog System|Blog System]]
- [[_COMMUNITY_WeFest Vision & Model|WeFest Vision & Model]]
- [[_COMMUNITY_ESLint Config|ESLint Config]]
- [[_COMMUNITY_Vite Config|Vite Config]]
- [[_COMMUNITY_Aspect Ratio UI|Aspect Ratio UI]]
- [[_COMMUNITY_Collapsible UI|Collapsible UI]]
- [[_COMMUNITY_Event Lifecycle|Event Lifecycle]]
- [[_COMMUNITY_Pass System|Pass System]]
- [[_COMMUNITY_QR Ticketing|QR Ticketing]]
- [[_COMMUNITY_Sponsor Matching|Sponsor Matching]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 56|Community 56]]
- [[_COMMUNITY_Community 57|Community 57]]
- [[_COMMUNITY_Community 78|Community 78]]
- [[_COMMUNITY_Community 79|Community 79]]
- [[_COMMUNITY_Community 80|Community 80]]
- [[_COMMUNITY_Community 81|Community 81]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 180 edges
2. `supabase` - 100 edges
3. `Button` - 96 edges
4. `Input` - 55 edges
5. `Badge()` - 31 edges
6. `Label` - 29 edges
7. `DialogContent` - 27 edges
8. `useRegion()` - 27 edges
9. `DialogHeader()` - 21 edges
10. `DialogTitle` - 20 edges

## Surprising Connections (you probably didn't know these)
- `PublicEventCard()` --calls--> `useRegion()`  [EXTRACTED]
  src/routes/events.tsx → src/contexts/RegionContext.tsx
- `CompanyProposals()` --calls--> `cn()`  [EXTRACTED]
  src/routes/company.proposals.tsx → src/lib/utils.ts
- `QuickActionBtn()` --calls--> `cn()`  [INFERRED]
  src/routes/organizer.index.tsx → src/lib/utils.ts
- `TeamMemberField()` --calls--> `cn()`  [EXTRACTED]
  src/routes/organizer.team.tsx → src/lib/utils.ts
- `RoleBadge()` --calls--> `cn()`  [EXTRACTED]
  src/routes/organizer.team.tsx → src/lib/utils.ts

## Communities (82 total, 16 thin omitted)

### Community 0 - "Routing & Navigation"
Cohesion: 0.02
Nodes (152): Route, Route, Route, Route, Route, Route, Route, Route (+144 more)

### Community 1 - "Forms & User Interface"
Cohesion: 0.07
Nodes (45): QRScanner(), QRScannerProps, ShareEventDialogProps, loadRazorpayScript(), OpenCheckoutOptions, openRazorpayCheckout(), Window, sponsorshipTiers (+37 more)

### Community 2 - "Event & College Cards"
Cohesion: 0.05
Nodes (51): useWallet(), useWalletTransactions(), createWalletTopupOrder, getRazorpayKeyId, topupInput, verifyInput, verifyTopupAndCredit, applyReferralCode (+43 more)

### Community 3 - "Supabase & Auth"
Cohesion: 0.09
Nodes (38): useIsMobile(), Separator, SheetContent, SheetContentProps, SheetDescription, SheetFooter(), SheetHeader(), SheetOverlay (+30 more)

### Community 4 - "Sidebar & Layout"
Cohesion: 0.09
Nodes (31): LoadingScreen(), FooterCol(), marketingNav, organizerNav, SiteFooter(), SiteHeader(), sponsorNav, studentNav (+23 more)

### Community 5 - "Admin Management"
Cohesion: 0.08
Nodes (23): acceptCollegeJoinRequest(), CollegeJoinRequest, declineCollegeJoinRequest(), fetchCollegeJoinRequests(), fetchStudentJoinRequests(), StudentJoinRequest, submitCollegeJoinRequest(), AcceptTeamInvitationResult (+15 more)

### Community 6 - "Region & Global State"
Cohesion: 0.09
Nodes (18): cn(), DashboardStatTile(), DashboardStatTileProps, PublicFestPage(), QuickActionBtn(), CommitteesPage(), ProfessionalExplorePage(), MemoriesPage() (+10 more)

### Community 7 - "Organizer Dashboard"
Cohesion: 0.09
Nodes (10): StudentAppLayout(), StudentAppLayoutProps, College, CATEGORIES, LoginSearch, CollegeRow, SafetyPoint(), TalentMarketplace() (+2 more)

### Community 8 - "Stat Tiles & Pagination"
Cohesion: 0.14
Nodes (8): AdminAdmins(), Rank, RANKS, AdminCompanies(), Badge(), BadgeProps, badgeVariants, Input

### Community 9 - "UI Primitives"
Cohesion: 0.13
Nodes (19): Product, ProductCard(), Currency, RegionContext, RegionContextType, RegionProvider(), useRegion(), ShareEventDialog() (+11 more)

### Community 10 - "Menubar & Toolbars"
Cohesion: 0.12
Nodes (13): ActivityFeedPopover(), ActivityFeedPopoverProps, actions, QuickAction, QuickActionsProps, Activity, iconMap, RecentActivity() (+5 more)

### Community 11 - "Carousel Components"
Cohesion: 0.16
Nodes (21): a, admin, amountInr, balance, Body, coins, corsHeaders, inrToCoins() (+13 more)

### Community 12 - "Form Controls"
Cohesion: 0.19
Nodes (11): AdminDashboard(), CompanyProposals(), Proposal, Role, roles, Signup(), SignupSearch, Route (+3 more)

### Community 13 - "Charting & Data Viz"
Cohesion: 0.16
Nodes (20): admin, corsHeaders, currentPeriodEnd, eventId, expected, inrToCoins(), json(), notes (+12 more)

### Community 14 - "Command Palette"
Cohesion: 0.1
Nodes (19): code:bash (git clone https://github.com/Weskill-org/wefest.git), code:bash (bun install), code:env (VITE_SUPABASE_URL=your_supabase_url), code:bash (bun run dev), code:text (src/), 🛡️ For Admins, 🏢 For Organizers, 🤝 For Sponsors (+11 more)

### Community 15 - "Context Menus"
Cohesion: 0.12
Nodes (11): CategoryFilter(), CategoryFilterProps, EmptyState(), EmptyStateProps, EventsHero(), EventsHeroProps, categories, cats (+3 more)

### Community 16 - "Alert Dialogs"
Cohesion: 0.18
Nodes (11): AdBanner(), AdBannerProps, Event, EventCard(), categories, Feature(), Home(), Stat() (+3 more)

### Community 17 - "Table Components"
Cohesion: 0.22
Nodes (11): OrganizerHeaderProps, BoothVisit, COLORS, CompanyDashboard(), KpiCard(), Proposal, Route, Avatar (+3 more)

### Community 18 - "Blog & Content"
Cohesion: 0.21
Nodes (16): Menubar, MenubarCheckboxItem, MenubarContent, MenubarGroup(), MenubarItem, MenubarLabel, MenubarMenu(), MenubarPortal() (+8 more)

### Community 19 - "Student Dashboard"
Cohesion: 0.24
Nodes (12): ButtonProps, buttonVariants, Calendar(), CalendarDayButton(), Pagination(), PaginationContent, PaginationEllipsis(), PaginationItem (+4 more)

### Community 20 - "Drawer Components"
Cohesion: 0.25
Nodes (13): Carousel, CarouselApi, CarouselContent, CarouselContext, CarouselContextProps, CarouselItem, CarouselNext, CarouselOptions (+5 more)

### Community 21 - "Breadcrumbs"
Cohesion: 0.16
Nodes (7): ADJECTIVES, formatSlug(), generateEventSlug(), NOUNS, ALL_TAGS, EditEvent(), normalizeMembers()

### Community 22 - "Navigation Menus"
Cohesion: 0.28
Nodes (11): FormControl, FormDescription, FormField(), FormFieldContext, FormFieldContextValue, FormItem, FormItemContext, FormItemContextValue (+3 more)

### Community 23 - "Toggles & Buttons"
Cohesion: 0.15
Nodes (12): 1. SEO & Trust Infrastructure (Immediate Priority), 2. Content & Authority Strategy, 3. Growth Channels, 4. Email & Lifecycle Marketing, 5. Analytics & Performance Tracking, Campus Ambassador Program (CAP), Legal Pages Implementation, SEO Optimization (+4 more)

### Community 24 - "Card Layouts"
Cohesion: 0.3
Nodes (10): ChartConfig, ChartContainer, ChartContext, ChartContextProps, ChartLegendContent, ChartStyle(), ChartTooltipContent, getPayloadConfigFromPayload() (+2 more)

### Community 25 - "Quick Actions"
Cohesion: 0.18
Nodes (3): CertificateProps, CertificateTemplate(), Route

### Community 26 - "Alert Components"
Cohesion: 0.29
Nodes (3): OrganizerEmptyState(), OrganizerEventCard(), OrganizerEventCardProps

### Community 27 - "OTP Input"
Cohesion: 0.33
Nodes (9): Command, CommandDialog(), CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator (+1 more)

### Community 28 - "Admin Layout"
Cohesion: 0.33
Nodes (9): DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut(), DropdownMenuSubContent (+1 more)

### Community 29 - "Student Layout"
Cohesion: 0.33
Nodes (9): ContextMenuCheckboxItem, ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuRadioItem, ContextMenuSeparator, ContextMenuShortcut(), ContextMenuSubContent (+1 more)

### Community 30 - "Scripts & Utilities"
Cohesion: 0.35
Nodes (9): ensureStudentProfileRow(), getReferralCodeFromUser(), markReferralProcessed(), processReferralAfterLogin(), processReferralIfPending(), ProcessReferralResult, wasReferralProcessedThisSession(), navLinks (+1 more)

### Community 31 - "Refund Policy"
Cohesion: 0.36
Nodes (8): AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter(), AlertDialogHeader(), AlertDialogOverlay, AlertDialogTitle

### Community 32 - "College Directory"
Cohesion: 0.36
Nodes (8): Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow

### Community 33 - "Cookie Policy"
Cohesion: 0.39
Nodes (7): Drawer(), DrawerContent, DrawerDescription, DrawerFooter(), DrawerHeader(), DrawerOverlay, DrawerTitle

### Community 34 - "Privacy Policy"
Cohesion: 0.39
Nodes (7): NavigationMenu, NavigationMenuContent, NavigationMenuIndicator, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle, NavigationMenuViewport

### Community 35 - "Terms & Conditions"
Cohesion: 0.39
Nodes (5): ToggleGroup, ToggleGroupContext, ToggleGroupItem, Toggle, toggleVariants

### Community 36 - "Performance Snapshot"
Cohesion: 0.39
Nodes (7): Breadcrumb, BreadcrumbEllipsis(), BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator()

### Community 37 - "Student Events"
Cohesion: 0.43
Nodes (6): Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle

### Community 38 - "Blog System"
Cohesion: 0.43
Nodes (6): AdminAnalytics(), Badge(), forecastData, MetricCard(), RegionStat(), revenueData

### Community 39 - "WeFest Vision & Model"
Cohesion: 0.32
Nodes (3): BLOG_POSTS, Route, Route

### Community 40 - "ESLint Config"
Cohesion: 0.33
Nodes (4): DashboardSection(), getGreeting(), StatCard(), StudentDashboard()

### Community 41 - "Vite Config"
Cohesion: 0.53
Nodes (4): Alert, AlertDescription, AlertTitle, alertVariants

### Community 42 - "Aspect Ratio UI"
Cohesion: 0.53
Nodes (4): InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot

### Community 43 - "Collapsible UI"
Cohesion: 0.2
Nodes (3): Route, Route, startInstance

### Community 44 - "Event Lifecycle"
Cohesion: 0.6
Nodes (3): AccordionContent, AccordionItem, AccordionTrigger

### Community 45 - "Pass System"
Cohesion: 0.5
Nodes (3): CollegeProfilePage(), gradientPalette, hashGradient()

## Knowledge Gaps
- **112 isolated node(s):** `supabase`, `FestRoute`, `FestIndexRoute`, `OrganizerActivityRoute`, `FestSlugRoute` (+107 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **16 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Region & Global State` to `Forms & User Interface`, `Event & College Cards`, `Supabase & Auth`, `Sidebar & Layout`, `Admin Management`, `Organizer Dashboard`, `Stat Tiles & Pagination`, `UI Primitives`, `Menubar & Toolbars`, `Form Controls`, `Alert Dialogs`, `Table Components`, `Blog & Content`, `Student Dashboard`, `Drawer Components`, `Breadcrumbs`, `Navigation Menus`, `Card Layouts`, `Quick Actions`, `Alert Components`, `OTP Input`, `Admin Layout`, `Student Layout`, `Scripts & Utilities`, `Refund Policy`, `College Directory`, `Cookie Policy`, `Privacy Policy`, `Terms & Conditions`, `Performance Snapshot`, `Student Events`, `ESLint Config`, `Vite Config`, `Aspect Ratio UI`, `Event Lifecycle`?**
  _High betweenness centrality (0.262) - this node is a cross-community bridge._
- **Why does `supabase` connect `Organizer Dashboard` to `Forms & User Interface`, `Event & College Cards`, `Sidebar & Layout`, `Admin Management`, `Stat Tiles & Pagination`, `UI Primitives`, `Menubar & Toolbars`, `Form Controls`, `Context Menus`, `Alert Dialogs`, `Table Components`, `Breadcrumbs`, `Quick Actions`, `Alert Components`, `Scripts & Utilities`, `Blog System`, `ESLint Config`, `Pass System`, `QR Ticketing`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **Why does `Button` connect `Alert Dialogs` to `Forms & User Interface`, `Event & College Cards`, `Supabase & Auth`, `Sidebar & Layout`, `Admin Management`, `Organizer Dashboard`, `Stat Tiles & Pagination`, `UI Primitives`, `Menubar & Toolbars`, `Form Controls`, `Context Menus`, `Table Components`, `Student Dashboard`, `Drawer Components`, `Breadcrumbs`, `Quick Actions`, `Alert Components`, `Blog System`, `WeFest Vision & Model`, `ESLint Config`, `Pass System`, `Sponsor Matching`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **What connects `supabase`, `FestRoute`, `FestIndexRoute` to the rest of the system?**
  _112 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Routing & Navigation` be split into smaller, more focused modules?**
  _Cohesion score 0.02 - nodes in this community are weakly interconnected._
- **Should `Forms & User Interface` be split into smaller, more focused modules?**
  _Cohesion score 0.07 - nodes in this community are weakly interconnected._
- **Should `Event & College Cards` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._