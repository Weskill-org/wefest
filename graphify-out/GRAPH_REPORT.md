# Graph Report - wefest  (2026-05-18)

## Corpus Check
- 244 files · ~161,294 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 967 nodes · 2022 edges · 77 communities (63 shown, 14 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `cea044e5`
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
- [[_COMMUNITY_Community 58|Community 58]]
- [[_COMMUNITY_Community 59|Community 59]]
- [[_COMMUNITY_Community 60|Community 60]]
- [[_COMMUNITY_Community 61|Community 61]]
- [[_COMMUNITY_Community 62|Community 62]]
- [[_COMMUNITY_Community 63|Community 63]]
- [[_COMMUNITY_Community 64|Community 64]]
- [[_COMMUNITY_Community 65|Community 65]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 129 edges
2. `supabase` - 71 edges
3. `Button` - 68 edges
4. `Input` - 39 edges
5. `Badge()` - 24 edges
6. `Label` - 22 edges
7. `DialogContent` - 20 edges
8. `DialogHeader()` - 15 edges
9. `DialogTitle` - 14 edges
10. `useRegion()` - 13 edges

## Surprising Connections (you probably didn't know these)
- `AlertDialogHeader()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/alert-dialog.tsx → src/lib/utils.ts
- `AlertDialogFooter()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/alert-dialog.tsx → src/lib/utils.ts
- `BreadcrumbSeparator()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/breadcrumb.tsx → src/lib/utils.ts
- `BreadcrumbEllipsis()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/breadcrumb.tsx → src/lib/utils.ts
- `CommandShortcut()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/command.tsx → src/lib/utils.ts

## Communities (77 total, 14 thin omitted)

### Community 0 - "Routing & Navigation"
Cohesion: 0.02
Nodes (115): Route, Route, Route, Route, Route, Route, Route, Route (+107 more)

### Community 1 - "Forms & User Interface"
Cohesion: 0.06
Nodes (27): acceptCollegeJoinRequest(), CollegeJoinRequest, declineCollegeJoinRequest(), fetchCollegeJoinRequests(), fetchStudentJoinRequests(), StudentJoinRequest, submitCollegeJoinRequest(), AcceptTeamInvitationResult (+19 more)

### Community 2 - "Event & College Cards"
Cohesion: 0.06
Nodes (36): useIsMobile(), Separator, SheetContent, SheetContentProps, SheetDescription, SheetFooter(), SheetHeader(), SheetOverlay (+28 more)

### Community 3 - "Supabase & Auth"
Cohesion: 0.16
Nodes (16): ShareEventDialogProps, sponsorshipTiers, sponsorshipTiers, DialogContent, DialogDescription, DialogFooter(), DialogHeader(), DialogOverlay (+8 more)

### Community 4 - "Sidebar & Layout"
Cohesion: 0.11
Nodes (9): EventsHeroProps, Route, Route, Route, categories, Route, Route, Button (+1 more)

### Community 5 - "Admin Management"
Cohesion: 0.1
Nodes (18): capacityFromDb(), capacityToDb(), isUnlimitedEventCapacity(), ADJECTIVES, formatSlug(), generateEventSlug(), NOUNS, parseSlug() (+10 more)

### Community 6 - "Region & Global State"
Cohesion: 0.11
Nodes (16): OrganizerEmptyState(), OrganizerEventCard(), OrganizerEventCardProps, Route, QuickActionBtn(), Route, DropdownMenuCheckboxItem, DropdownMenuContent (+8 more)

### Community 7 - "Organizer Dashboard"
Cohesion: 0.12
Nodes (21): cn(), DashboardStatTile(), DashboardStatTileProps, PublicFestPage(), Signup(), MemoriesPage(), Route, ButtonProps (+13 more)

### Community 8 - "Stat Tiles & Pagination"
Cohesion: 0.13
Nodes (11): CertificateProps, CertificateTemplate(), Route, CompanyProposals(), Proposal, Route, Route, Route (+3 more)

### Community 9 - "UI Primitives"
Cohesion: 0.14
Nodes (16): Product, ProductCard(), Currency, RegionContext, RegionContextType, RegionProvider(), useRegion(), ShareEventDialog() (+8 more)

### Community 10 - "Menubar & Toolbars"
Cohesion: 0.1
Nodes (18): admin, corsHeaders, currentPeriodEnd, eventId, expected, notes, organizerId, planType (+10 more)

### Community 11 - "Carousel Components"
Cohesion: 0.15
Nodes (14): OrganizerHeaderProps, BoothVisit, COLORS, CompanyDashboard(), KpiCard(), Proposal, Route, OrganizerLayout() (+6 more)

### Community 12 - "Form Controls"
Cohesion: 0.13
Nodes (8): Rank, RANKS, Route, Route, Route, Badge(), BadgeProps, badgeVariants

### Community 13 - "Charting & Data Viz"
Cohesion: 0.1
Nodes (12): Alert, AlertDescription, AlertTitle, alertVariants, Checkbox, HoverCardContent, Progress, RadioGroup (+4 more)

### Community 14 - "Command Palette"
Cohesion: 0.1
Nodes (17): a, admin, balance, Body, corsHeaders, keyId, keySecret, notes (+9 more)

### Community 15 - "Context Menus"
Cohesion: 0.1
Nodes (19): code:bash (git clone https://github.com/Weskill-org/wefest.git), code:bash (bun install), code:env (VITE_SUPABASE_URL=your_supabase_url), code:bash (bun run dev), code:text (src/), 🛡️ For Admins, 🏢 For Organizers, 🤝 For Sponsors (+11 more)

### Community 16 - "Alert Dialogs"
Cohesion: 0.14
Nodes (8): Route, College, Route, Route, Route, startInstance, attachSupabaseAuth, supabase

### Community 17 - "Table Components"
Cohesion: 0.18
Nodes (12): useWallet(), useWalletTransactions(), coinsToInr(), getMyWallet, getMyWalletTransactions, Route, Route, Route (+4 more)

### Community 18 - "Blog & Content"
Cohesion: 0.11
Nodes (16): applyReferralCode, applyReferralCodeInput, createGiftCardInput, getMyWithdrawals, payForProductInput, payForProductWithWallet, payForTicketInput, payForTicketWithWallet (+8 more)

### Community 19 - "Student Dashboard"
Cohesion: 0.13
Nodes (12): AuthSession, getAuthSession(), getSupabaseAuthHeaders(), UserRole, adminLinks, Route, bottomLinks, CompanyLayout() (+4 more)

### Community 20 - "Drawer Components"
Cohesion: 0.12
Nodes (11): Menubar, MenubarCheckboxItem, MenubarContent, MenubarItem, MenubarLabel, MenubarRadioItem, MenubarSeparator, MenubarShortcut() (+3 more)

### Community 21 - "Breadcrumbs"
Cohesion: 0.15
Nodes (8): LoadingScreen(), marketingNav, SiteFooter(), SiteHeader(), getDashboardRedirect(), Route, Toaster(), ToasterProps

### Community 22 - "Navigation Menus"
Cohesion: 0.17
Nodes (10): loadRazorpayScript(), OpenCheckoutOptions, openRazorpayCheckout(), Window, Route, PaymentDialogProps, PurchaseIntent, Props (+2 more)

### Community 23 - "Toggles & Buttons"
Cohesion: 0.14
Nodes (12): requireSupabaseAuth, supabaseAdmin, CompositeTypes, Constants, Database, DatabaseWithoutInternals, DefaultSchema, Enums (+4 more)

### Community 24 - "Card Layouts"
Cohesion: 0.17
Nodes (8): ActivityFeedPopover(), ActivityFeedPopoverProps, Activity, iconMap, RecentActivity(), Route, Route, PopoverContent

### Community 25 - "Quick Actions"
Cohesion: 0.14
Nodes (12): Carousel, CarouselApi, CarouselContent, CarouselContext, CarouselContextProps, CarouselItem, CarouselNext, CarouselOptions (+4 more)

### Community 26 - "Alert Components"
Cohesion: 0.18
Nodes (8): QRScanner(), QRScannerProps, Route, DashboardSection(), getGreeting(), Route, StatCard(), StudentDashboard()

### Community 27 - "OTP Input"
Cohesion: 0.15
Nodes (12): 1. SEO & Trust Infrastructure (Immediate Priority), 2. Content & Authority Strategy, 3. Growth Channels, 4. Email & Lifecycle Marketing, 5. Analytics & Performance Tracking, Campus Ambassador Program (CAP), Legal Pages Implementation, SEO Optimization (+4 more)

### Community 28 - "Admin Layout"
Cohesion: 0.17
Nodes (8): LogEntry, Role, roles, SignupSearch, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator

### Community 29 - "Student Layout"
Cohesion: 0.17
Nodes (9): FormControl, FormDescription, FormFieldContext, FormFieldContextValue, FormItem, FormItemContext, FormItemContextValue, FormLabel (+1 more)

### Community 30 - "Scripts & Utilities"
Cohesion: 0.3
Nodes (9): ensureStudentProfileRow(), getReferralCodeFromUser(), markReferralProcessed(), processReferralAfterLogin(), processReferralIfPending(), ProcessReferralResult, wasReferralProcessedThisSession(), navLinks (+1 more)

### Community 31 - "Refund Policy"
Cohesion: 0.18
Nodes (7): ChartConfig, ChartContainer, ChartContext, ChartContextProps, ChartLegendContent, ChartTooltipContent, THEMES

### Community 32 - "College Directory"
Cohesion: 0.22
Nodes (5): AdBanner(), AdBannerProps, Event, EventCard(), Route

### Community 33 - "Cookie Policy"
Cohesion: 0.27
Nodes (4): BLOG_POSTS, Route, Route, Route

### Community 34 - "Privacy Policy"
Cohesion: 0.2
Nodes (8): Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut()

### Community 35 - "Terms & Conditions"
Cohesion: 0.2
Nodes (9): ContextMenuCheckboxItem, ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuRadioItem, ContextMenuSeparator, ContextMenuShortcut(), ContextMenuSubContent (+1 more)

### Community 36 - "Performance Snapshot"
Cohesion: 0.22
Nodes (8): Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow

### Community 37 - "Student Events"
Cohesion: 0.22
Nodes (8): AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter(), AlertDialogHeader(), AlertDialogOverlay, AlertDialogTitle

### Community 38 - "Blog System"
Cohesion: 0.28
Nodes (6): EmptyState(), EmptyStateProps, StudentAppLayout(), StudentAppLayoutProps, CATEGORIES, Route

### Community 39 - "WeFest Vision & Model"
Cohesion: 0.25
Nodes (7): Breadcrumb, BreadcrumbEllipsis(), BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator()

### Community 40 - "ESLint Config"
Cohesion: 0.25
Nodes (7): NavigationMenu, NavigationMenuContent, NavigationMenuIndicator, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle, NavigationMenuViewport

### Community 41 - "Vite Config"
Cohesion: 0.25
Nodes (6): DrawerContent, DrawerDescription, DrawerFooter(), DrawerHeader(), DrawerOverlay, DrawerTitle

### Community 42 - "Aspect Ratio UI"
Cohesion: 0.25
Nodes (3): forecastData, revenueData, Route

### Community 43 - "Collapsible UI"
Cohesion: 0.29
Nodes (6): Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle

### Community 44 - "Event Lifecycle"
Cohesion: 0.33
Nodes (5): ToggleGroup, ToggleGroupContext, ToggleGroupItem, Toggle, toggleVariants

### Community 45 - "Pass System"
Cohesion: 0.33
Nodes (4): getRouter(), queryClient, Register, routeTree

### Community 46 - "QR Ticketing"
Cohesion: 0.33
Nodes (3): getMyReferralInfo, Route, STEPS

### Community 47 - "Sponsor Matching"
Cohesion: 0.4
Nodes (4): CollegeProfilePage(), gradientPalette, hashGradient(), Route

### Community 48 - "Community 48"
Cohesion: 0.4
Nodes (3): actions, QuickAction, QuickActionsProps

### Community 49 - "Community 49"
Cohesion: 0.4
Nodes (4): InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot

### Community 50 - "Community 50"
Cohesion: 0.4
Nodes (3): createGiftCard, getAllGiftCards, Route

### Community 52 - "Community 52"
Cohesion: 0.5
Nodes (3): AccordionContent, AccordionItem, AccordionTrigger

## Knowledge Gaps
- **411 isolated node(s):** `supabase`, `Register`, `TermsRoute`, `TalentRoute`, `SponsorsRoute` (+406 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **14 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Organizer Dashboard` to `Forms & User Interface`, `Event & College Cards`, `Supabase & Auth`, `Sidebar & Layout`, `Admin Management`, `Region & Global State`, `Stat Tiles & Pagination`, `UI Primitives`, `Carousel Components`, `Form Controls`, `Charting & Data Viz`, `Alert Dialogs`, `Table Components`, `Student Dashboard`, `Drawer Components`, `Navigation Menus`, `Card Layouts`, `Quick Actions`, `Alert Components`, `Admin Layout`, `Student Layout`, `Scripts & Utilities`, `Refund Policy`, `Privacy Policy`, `Terms & Conditions`, `Performance Snapshot`, `Student Events`, `Blog System`, `WeFest Vision & Model`, `ESLint Config`, `Vite Config`, `Collapsible UI`, `Event Lifecycle`, `QR Ticketing`, `Community 48`, `Community 49`, `Community 50`, `Community 52`?**
  _High betweenness centrality (0.205) - this node is a cross-community bridge._
- **Why does `Button` connect `Sidebar & Layout` to `Forms & User Interface`, `Event & College Cards`, `Supabase & Auth`, `Admin Management`, `Region & Global State`, `Organizer Dashboard`, `Stat Tiles & Pagination`, `UI Primitives`, `Carousel Components`, `Form Controls`, `Alert Dialogs`, `Table Components`, `Student Dashboard`, `Breadcrumbs`, `Navigation Menus`, `Card Layouts`, `Quick Actions`, `Alert Components`, `Admin Layout`, `College Directory`, `Cookie Policy`, `Blog System`, `Aspect Ratio UI`, `QR Ticketing`, `Sponsor Matching`, `Community 50`, `Community 51`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **Why does `supabase` connect `Alert Dialogs` to `Forms & User Interface`, `Supabase & Auth`, `Sidebar & Layout`, `Admin Management`, `Region & Global State`, `Organizer Dashboard`, `Stat Tiles & Pagination`, `UI Primitives`, `Carousel Components`, `Form Controls`, `Table Components`, `Student Dashboard`, `Breadcrumbs`, `Navigation Menus`, `Card Layouts`, `Alert Components`, `Admin Layout`, `Scripts & Utilities`, `College Directory`, `Cookie Policy`, `Blog System`, `Aspect Ratio UI`, `QR Ticketing`, `Sponsor Matching`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **What connects `supabase`, `Register`, `TermsRoute` to the rest of the system?**
  _411 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Routing & Navigation` be split into smaller, more focused modules?**
  _Cohesion score 0.02 - nodes in this community are weakly interconnected._
- **Should `Forms & User Interface` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._
- **Should `Event & College Cards` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._