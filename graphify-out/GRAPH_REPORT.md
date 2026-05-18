# Graph Report - wefest  (2026-05-17)

## Corpus Check
<<<<<<< Updated upstream
- 239 files · ~159,673 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1100 nodes · 3056 edges · 82 communities (63 shown, 19 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0f1b8aed`
=======
- 197 files · ~111,103 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 972 nodes · 2518 edges · 73 communities (54 shown, 19 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `de618a09`
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
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
- `QuickActionBtn()` --calls--> `cn()`  [INFERRED]
  src/routes/organizer.index.tsx → src/lib/utils.ts
- `FullEventDetail()` --calls--> `useRegion()`  [EXTRACTED]
  src/routes/fest.$slug.tsx → src/contexts/RegionContext.tsx
- `PublicEventCard()` --calls--> `useRegion()`  [EXTRACTED]
  src/routes/events.tsx → src/contexts/RegionContext.tsx
- `TeamMemberField()` --calls--> `cn()`  [EXTRACTED]
  src/routes/organizer.team.tsx → src/lib/utils.ts
- `RoleBadge()` --calls--> `cn()`  [EXTRACTED]
  src/routes/organizer.team.tsx → src/lib/utils.ts

## Communities (82 total, 19 thin omitted)

### Community 0 - "Routing & Navigation"
Cohesion: 0.02
Nodes (154): Route, Route, Route, Route, Route, Route, Route, Route (+146 more)

### Community 1 - "Forms & User Interface"
Cohesion: 0.07
Nodes (41): QRScanner(), QRScannerProps, ShareEventDialogProps, loadRazorpayScript(), OpenCheckoutOptions, openRazorpayCheckout(), Window, sponsorshipTiers (+33 more)

### Community 2 - "Event & College Cards"
Cohesion: 0.05
Nodes (52): useWallet(), useWalletTransactions(), createWalletTopupOrder, getRazorpayKeyId, topupInput, verifyInput, verifyTopupAndCredit, applyReferralCode (+44 more)

### Community 3 - "Supabase & Auth"
Cohesion: 0.07
Nodes (42): LoadingScreen(), FooterCol(), marketingNav, organizerNav, SiteFooter(), SiteHeader(), sponsorNav, studentNav (+34 more)

### Community 4 - "Sidebar & Layout"
Cohesion: 0.05
Nodes (33): acceptCollegeJoinRequest(), CollegeJoinRequest, declineCollegeJoinRequest(), fetchCollegeJoinRequests(), fetchStudentJoinRequests(), StudentJoinRequest, submitCollegeJoinRequest(), ADJECTIVES (+25 more)

### Community 5 - "Admin Management"
Cohesion: 0.09
Nodes (38): useIsMobile(), Separator, SheetContent, SheetContentProps, SheetDescription, SheetFooter(), SheetHeader(), SheetOverlay (+30 more)

### Community 6 - "Region & Global State"
Cohesion: 0.09
Nodes (19): cn(), DashboardStatTile(), DashboardStatTileProps, CompanyProposals(), PublicFestPage(), Signup(), CommitteesPage(), ProfessionalExplorePage() (+11 more)

### Community 7 - "Organizer Dashboard"
Cohesion: 0.14
Nodes (21): Currency, RegionContext, RegionContextType, useRegion(), ShareEventDialog(), parseSlug(), AdminDashboard(), Proposal (+13 more)

### Community 8 - "Stat Tiles & Pagination"
Cohesion: 0.13
Nodes (9): AdminAdmins(), Rank, RANKS, AdminCompanies(), categories, Badge(), BadgeProps, badgeVariants (+1 more)

### Community 9 - "UI Primitives"
Cohesion: 0.1
Nodes (9): StudentAppLayout(), StudentAppLayoutProps, College, CATEGORIES, FullEventDetail(), LoginSearch, CollegeRow, attachSupabaseAuth (+1 more)

### Community 10 - "Menubar & Toolbars"
Cohesion: 0.1
Nodes (13): CategoryFilter(), CategoryFilterProps, EmptyState(), EmptyStateProps, EventsHero(), EventsHeroProps, categories, cats (+5 more)

### Community 11 - "Carousel Components"
Cohesion: 0.16
Nodes (21): a, admin, amountInr, balance, Body, coins, corsHeaders, inrToCoins() (+13 more)

### Community 12 - "Form Controls"
Cohesion: 0.19
Nodes (13): OrganizerHeaderProps, BoothVisit, COLORS, CompanyDashboard(), KpiCard(), Proposal, Route, OrganizerLayout() (+5 more)

### Community 13 - "Charting & Data Viz"
Cohesion: 0.16
Nodes (20): admin, corsHeaders, currentPeriodEnd, eventId, expected, inrToCoins(), json(), notes (+12 more)

### Community 14 - "Command Palette"
Cohesion: 0.1
Nodes (19): code:bash (git clone https://github.com/Weskill-org/wefest.git), code:bash (bun install), code:env (VITE_SUPABASE_URL=your_supabase_url), code:bash (bun run dev), code:text (src/), 🛡️ For Admins, 🏢 For Organizers, 🤝 For Sponsors (+11 more)

### Community 15 - "Context Menus"
Cohesion: 0.21
Nodes (16): Menubar, MenubarCheckboxItem, MenubarContent, MenubarGroup(), MenubarItem, MenubarLabel, MenubarMenu(), MenubarPortal() (+8 more)

### Community 16 - "Alert Dialogs"
Cohesion: 0.24
Nodes (12): ButtonProps, buttonVariants, Calendar(), CalendarDayButton(), Pagination(), PaginationContent, PaginationEllipsis(), PaginationItem (+4 more)

### Community 17 - "Table Components"
Cohesion: 0.18
Nodes (8): ActivityFeedPopover(), ActivityFeedPopoverProps, Activity, iconMap, RecentActivity(), Route, Route, PopoverContent

### Community 18 - "Blog & Content"
Cohesion: 0.22
Nodes (10): AdBanner(), AdBannerProps, Event, EventCard(), Feature(), Home(), Stat(), SafetyPoint() (+2 more)

### Community 19 - "Student Dashboard"
Cohesion: 0.25
Nodes (13): Carousel, CarouselApi, CarouselContent, CarouselContext, CarouselContextProps, CarouselItem, CarouselNext, CarouselOptions (+5 more)

### Community 20 - "Drawer Components"
Cohesion: 0.28
Nodes (11): FormControl, FormDescription, FormField(), FormFieldContext, FormFieldContextValue, FormItem, FormItemContext, FormItemContextValue (+3 more)

### Community 21 - "Breadcrumbs"
Cohesion: 0.15
Nodes (12): 1. SEO & Trust Infrastructure (Immediate Priority), 2. Content & Authority Strategy, 3. Growth Channels, 4. Email & Lifecycle Marketing, 5. Analytics & Performance Tracking, Campus Ambassador Program (CAP), Legal Pages Implementation, SEO Optimization (+4 more)

### Community 22 - "Navigation Menus"
Cohesion: 0.26
Nodes (4): OrganizerEmptyState(), OrganizerEventCard(), OrganizerEventCardProps, QuickActionBtn()

### Community 23 - "Toggles & Buttons"
Cohesion: 0.18
Nodes (3): CertificateProps, CertificateTemplate(), Route

### Community 24 - "Card Layouts"
Cohesion: 0.3
Nodes (10): ChartConfig, ChartContainer, ChartContext, ChartContextProps, ChartLegendContent, ChartStyle(), ChartTooltipContent, getPayloadConfigFromPayload() (+2 more)

### Community 25 - "Quick Actions"
Cohesion: 0.33
Nodes (9): Command, CommandDialog(), CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator (+1 more)

### Community 26 - "Alert Components"
Cohesion: 0.33
Nodes (9): ContextMenuCheckboxItem, ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuRadioItem, ContextMenuSeparator, ContextMenuShortcut(), ContextMenuSubContent (+1 more)

### Community 27 - "OTP Input"
Cohesion: 0.33
Nodes (9): DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut(), DropdownMenuSubContent (+1 more)
=======
- [[_COMMUNITY_Community 69|Community 69]]
- [[_COMMUNITY_Community 70|Community 70]]
- [[_COMMUNITY_Community 71|Community 71]]
- [[_COMMUNITY_Community 72|Community 72]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 153 edges
2. `supabase` - 87 edges
3. `Button` - 86 edges
4. `Input` - 53 edges
5. `Badge()` - 30 edges
6. `Label` - 28 edges
7. `useRegion()` - 22 edges
8. `DialogContent` - 20 edges
9. `DialogHeader()` - 18 edges
10. `DialogTitle` - 17 edges

## Surprising Connections (you probably didn't know these)
- `OrganizerLayout()` --calls--> `cn()`  [EXTRACTED]
  src/routes/organizer.tsx → C:/Users/sharm/OneDrive/Documents/GitHub/wefest/src/lib/utils.ts
- `DashboardSection()` --calls--> `cn()`  [EXTRACTED]
  src/routes/_student.dashboard.tsx → C:/Users/sharm/OneDrive/Documents/GitHub/wefest/src/lib/utils.ts
- `StatCard()` --calls--> `cn()`  [EXTRACTED]
  src/routes/_student.dashboard.tsx → C:/Users/sharm/OneDrive/Documents/GitHub/wefest/src/lib/utils.ts
- `StudentLayout()` --calls--> `cn()`  [EXTRACTED]
  src/routes/_student.tsx → C:/Users/sharm/OneDrive/Documents/GitHub/wefest/src/lib/utils.ts
- `EventCard()` --calls--> `useRegion()`  [EXTRACTED]
  C:/Users/sharm/OneDrive/Documents/GitHub/wefest/src/components/event-card.tsx → src/contexts/RegionContext.tsx

## Communities (73 total, 19 thin omitted)

### Community 0 - "Routing & Navigation"
Cohesion: 0.05
Nodes (58): EventsHeroProps, AdminAdmins(), Rank, RANKS, Route, College, AdminCompanies(), Route (+50 more)

### Community 1 - "Forms & User Interface"
Cohesion: 0.02
Nodes (117): Route, Route, Route, Route, Route, Route, Route, Route (+109 more)

### Community 2 - "Event & College Cards"
Cohesion: 0.05
Nodes (53): useWallet(), useWalletTransactions(), createWalletTopupOrder, getRazorpayKeyId, topupInput, verifyInput, verifyTopupAndCredit, coinsToInr() (+45 more)

### Community 3 - "Supabase & Auth"
Cohesion: 0.06
Nodes (45): useIsMobile(), OrganizerEmptyState(), OrganizerEventCard(), Activity, iconMap, RecentActivity(), Route, Route (+37 more)

### Community 4 - "Sidebar & Layout"
Cohesion: 0.08
Nodes (35): LoadingScreen(), FooterCol(), marketingNav, organizerNav, SiteFooter(), SiteHeader(), sponsorNav, studentNav (+27 more)

### Community 5 - "Admin Management"
Cohesion: 0.09
Nodes (29): CertificateProps, CertificateTemplate(), Product, ProductCard(), Currency, RegionContext, RegionContextType, useRegion() (+21 more)

### Community 6 - "Region & Global State"
Cohesion: 0.08
Nodes (22): AdBanner(), AdBannerProps, Event, EventCard(), CategoryFilter(), CategoryFilterProps, EmptyState(), EmptyStateProps (+14 more)

### Community 7 - "Organizer Dashboard"
Cohesion: 0.1
Nodes (17): cn(), DashboardStatTile(), DashboardStatTileProps, CompanyProposals(), RoleBadge(), RoleDetail(), Checkbox, HoverCardContent (+9 more)

### Community 8 - "Stat Tiles & Pagination"
Cohesion: 0.17
Nodes (14): OrganizerHeaderProps, BoothVisit, COLORS, CompanyDashboard(), KpiCard(), Proposal, Route, OrganizerLayout() (+6 more)

### Community 9 - "UI Primitives"
Cohesion: 0.16
Nodes (21): a, admin, amountInr, balance, Body, coins, corsHeaders, inrToCoins() (+13 more)

### Community 10 - "Menubar & Toolbars"
Cohesion: 0.1
Nodes (19): code:bash (git clone https://github.com/Weskill-org/wefest.git), code:bash (bun install), code:env (VITE_SUPABASE_URL=your_supabase_url), code:bash (bun run dev), code:text (src/), 🛡️ For Admins, 🏢 For Organizers, 🤝 For Sponsors (+11 more)

### Community 11 - "Carousel Components"
Cohesion: 0.19
Nodes (18): admin, corsHeaders, eventId, expected, inrToCoins(), json(), notes, organizerId (+10 more)

### Community 12 - "Form Controls"
Cohesion: 0.21
Nodes (16): Menubar, MenubarCheckboxItem, MenubarContent, MenubarGroup(), MenubarItem, MenubarLabel, MenubarMenu(), MenubarPortal() (+8 more)

### Community 13 - "Charting & Data Viz"
Cohesion: 0.24
Nodes (12): ButtonProps, buttonVariants, Calendar(), CalendarDayButton(), Pagination(), PaginationContent, PaginationEllipsis(), PaginationItem (+4 more)

### Community 14 - "Command Palette"
Cohesion: 0.25
Nodes (13): Carousel, CarouselApi, CarouselContent, CarouselContext, CarouselContextProps, CarouselItem, CarouselNext, CarouselOptions (+5 more)

### Community 15 - "Context Menus"
Cohesion: 0.28
Nodes (11): FormControl, FormDescription, FormField(), FormFieldContext, FormFieldContextValue, FormItem, FormItemContext, FormItemContextValue (+3 more)

### Community 16 - "Alert Dialogs"
Cohesion: 0.29
Nodes (10): OrganizerEventCardProps, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut() (+2 more)

### Community 17 - "Table Components"
Cohesion: 0.15
Nodes (12): 1. SEO & Trust Infrastructure (Immediate Priority), 2. Content & Authority Strategy, 3. Growth Channels, 4. Email & Lifecycle Marketing, 5. Analytics & Performance Tracking, Campus Ambassador Program (CAP), Legal Pages Implementation, SEO Optimization (+4 more)

### Community 18 - "Blog & Content"
Cohesion: 0.3
Nodes (10): ChartConfig, ChartContainer, ChartContext, ChartContextProps, ChartLegendContent, ChartStyle(), ChartTooltipContent, getPayloadConfigFromPayload() (+2 more)

### Community 19 - "Student Dashboard"
Cohesion: 0.33
Nodes (9): ContextMenuCheckboxItem, ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuRadioItem, ContextMenuSeparator, ContextMenuShortcut(), ContextMenuSubContent (+1 more)

### Community 20 - "Drawer Components"
Cohesion: 0.33
Nodes (9): Command, CommandDialog(), CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator (+1 more)

### Community 21 - "Breadcrumbs"
Cohesion: 0.27
Nodes (4): BLOG_POSTS, Route, Route, Route

### Community 22 - "Navigation Menus"
Cohesion: 0.36
Nodes (8): AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter(), AlertDialogHeader(), AlertDialogOverlay, AlertDialogTitle
>>>>>>> Stashed changes

### Community 23 - "Toggles & Buttons"
Cohesion: 0.36
Nodes (8): AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter(), AlertDialogHeader(), AlertDialogOverlay, AlertDialogTitle

<<<<<<< Updated upstream
### Community 29 - "Student Layout"
Cohesion: 0.36
Nodes (8): Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow
=======
### Community 24 - "Card Layouts"
Cohesion: 0.39
Nodes (7): NavigationMenu, NavigationMenuContent, NavigationMenuIndicator, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle, NavigationMenuViewport
>>>>>>> Stashed changes

### Community 25 - "Quick Actions"
Cohesion: 0.39
Nodes (7): Drawer(), DrawerContent, DrawerDescription, DrawerFooter(), DrawerHeader(), DrawerOverlay, DrawerTitle

<<<<<<< Updated upstream
### Community 31 - "Refund Policy"
Cohesion: 0.39
Nodes (7): Breadcrumb, BreadcrumbEllipsis(), BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator()

### Community 32 - "College Directory"
=======
### Community 26 - "Alert Components"
>>>>>>> Stashed changes
Cohesion: 0.39
Nodes (5): ToggleGroup, ToggleGroupContext, ToggleGroupItem, Toggle, toggleVariants

### Community 27 - "OTP Input"
Cohesion: 0.39
<<<<<<< Updated upstream
Nodes (7): NavigationMenu, NavigationMenuContent, NavigationMenuIndicator, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle, NavigationMenuViewport

### Community 34 - "Privacy Policy"
Cohesion: 0.43
Nodes (6): Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle

### Community 35 - "Terms & Conditions"
Cohesion: 0.43
Nodes (6): AdminAnalytics(), Badge(), forecastData, MetricCard(), RegionStat(), revenueData

### Community 36 - "Performance Snapshot"
Cohesion: 0.32
Nodes (3): BLOG_POSTS, Route, Route

### Community 37 - "Student Events"
Cohesion: 0.33
Nodes (4): DashboardSection(), getGreeting(), StatCard(), StudentDashboard()
=======
Nodes (5): ToggleGroup, ToggleGroupContext, ToggleGroupItem, Toggle, toggleVariants

### Community 28 - "Admin Layout"
Cohesion: 0.43
Nodes (6): Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle

### Community 29 - "Student Layout"
Cohesion: 0.29
Nodes (5): DashboardSection(), getGreeting(), Route, StatCard(), StudentDashboard()

### Community 30 - "Scripts & Utilities"
Cohesion: 0.4
Nodes (4): CollegeProfilePage(), gradientPalette, hashGradient(), Route
>>>>>>> Stashed changes

### Community 31 - "Refund Policy"
Cohesion: 0.53
Nodes (4): InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot

<<<<<<< Updated upstream
### Community 39 - "WeFest Vision & Model"
Cohesion: 0.53
Nodes (4): Alert, AlertDescription, AlertTitle, alertVariants

### Community 41 - "Vite Config"
Cohesion: 0.4
Nodes (3): actions, QuickAction, QuickActionsProps

### Community 42 - "Aspect Ratio UI"
Cohesion: 0.6
Nodes (3): AccordionContent, AccordionItem, AccordionTrigger

### Community 43 - "Collapsible UI"
Cohesion: 0.5
Nodes (3): CollegeProfilePage(), gradientPalette, hashGradient()

## Knowledge Gaps
- **112 isolated node(s):** `supabase`, `FestRoute`, `FestIndexRoute`, `OrganizerActivityRoute`, `FestSlugRoute` (+107 more)
=======
### Community 32 - "College Directory"
Cohesion: 0.53
Nodes (4): Alert, AlertDescription, AlertTitle, alertVariants

### Community 33 - "Cookie Policy"
Cohesion: 0.6
Nodes (4): loadRazorpayScript(), OpenCheckoutOptions, openRazorpayCheckout(), Window

### Community 34 - "Privacy Policy"
Cohesion: 0.6
Nodes (3): AccordionContent, AccordionItem, AccordionTrigger

### Community 35 - "Terms & Conditions"
Cohesion: 0.4
Nodes (3): actions, QuickAction, QuickActionsProps

## Knowledge Gaps
- **179 isolated node(s):** `supabase`, `TermsRoute`, `TalentRoute`, `SponsorsRoute`, `SitemapDotxmlRoute` (+174 more)
>>>>>>> Stashed changes
  These have ≤1 connection - possible missing edges or undocumented components.
- **19 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

<<<<<<< Updated upstream
- **Why does `cn()` connect `Region & Global State` to `Forms & User Interface`, `Event & College Cards`, `Supabase & Auth`, `Sidebar & Layout`, `Admin Management`, `Organizer Dashboard`, `Stat Tiles & Pagination`, `UI Primitives`, `Menubar & Toolbars`, `Form Controls`, `Context Menus`, `Alert Dialogs`, `Table Components`, `Student Dashboard`, `Drawer Components`, `Navigation Menus`, `Toggles & Buttons`, `Card Layouts`, `Quick Actions`, `Alert Components`, `OTP Input`, `Admin Layout`, `Student Layout`, `Scripts & Utilities`, `Refund Policy`, `College Directory`, `Cookie Policy`, `Privacy Policy`, `Student Events`, `Blog System`, `WeFest Vision & Model`, `Vite Config`, `Aspect Ratio UI`?**
  _High betweenness centrality (0.255) - this node is a cross-community bridge._
- **Why does `supabase` connect `UI Primitives` to `Forms & User Interface`, `Event & College Cards`, `Supabase & Auth`, `Sidebar & Layout`, `Terms & Conditions`, `Student Events`, `Organizer Dashboard`, `Stat Tiles & Pagination`, `ESLint Config`, `Menubar & Toolbars`, `Collapsible UI`, `Event Lifecycle`, `Form Controls`, `Table Components`, `Blog & Content`, `Navigation Menus`, `Toggles & Buttons`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Why does `Button` connect `Blog & Content` to `Forms & User Interface`, `Event & College Cards`, `Supabase & Auth`, `Sidebar & Layout`, `Admin Management`, `Organizer Dashboard`, `Stat Tiles & Pagination`, `UI Primitives`, `Menubar & Toolbars`, `Form Controls`, `Alert Dialogs`, `Table Components`, `Student Dashboard`, `Navigation Menus`, `Toggles & Buttons`, `Terms & Conditions`, `Performance Snapshot`, `Student Events`, `ESLint Config`, `Collapsible UI`, `QR Ticketing`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **What connects `supabase`, `FestRoute`, `FestIndexRoute` to the rest of the system?**
  _112 weakly-connected nodes found - possible documentation gaps or missing edges._
=======
- **Why does `cn()` connect `Organizer Dashboard` to `Routing & Navigation`, `Event & College Cards`, `Supabase & Auth`, `Sidebar & Layout`, `Admin Management`, `Region & Global State`, `Stat Tiles & Pagination`, `Form Controls`, `Charting & Data Viz`, `Command Palette`, `Context Menus`, `Alert Dialogs`, `Blog & Content`, `Student Dashboard`, `Drawer Components`, `Navigation Menus`, `Toggles & Buttons`, `Card Layouts`, `Quick Actions`, `Alert Components`, `OTP Input`, `Admin Layout`, `Student Layout`, `Refund Policy`, `College Directory`, `Privacy Policy`, `Terms & Conditions`?**
  _High betweenness centrality (0.261) - this node is a cross-community bridge._
- **Why does `Button` connect `Routing & Navigation` to `Event & College Cards`, `Supabase & Auth`, `Sidebar & Layout`, `Admin Management`, `Region & Global State`, `Performance Snapshot`, `Stat Tiles & Pagination`, `Charting & Data Viz`, `Command Palette`, `Alert Dialogs`, `Breadcrumbs`, `Student Layout`, `Scripts & Utilities`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Why does `supabase` connect `Routing & Navigation` to `Event & College Cards`, `Supabase & Auth`, `Sidebar & Layout`, `Student Events`, `Admin Management`, `Region & Global State`, `Stat Tiles & Pagination`, `ESLint Config`, `Alert Dialogs`, `Breadcrumbs`, `Student Layout`, `Scripts & Utilities`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **What connects `supabase`, `TermsRoute`, `TalentRoute` to the rest of the system?**
  _179 weakly-connected nodes found - possible documentation gaps or missing edges._
>>>>>>> Stashed changes
- **Should `Routing & Navigation` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `Forms & User Interface` be split into smaller, more focused modules?**
  _Cohesion score 0.02 - nodes in this community are weakly interconnected._
- **Should `Event & College Cards` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._