# Graph Report - wefest  (2026-05-15)

## Corpus Check
- 208 files · ~134,969 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 990 nodes · 2766 edges · 77 communities (57 shown, 20 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2ceddbb9`
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
- [[_COMMUNITY_Community 73|Community 73]]
- [[_COMMUNITY_Community 74|Community 74]]
- [[_COMMUNITY_Community 75|Community 75]]
- [[_COMMUNITY_Community 76|Community 76]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 163 edges
2. `supabase` - 88 edges
3. `Button` - 87 edges
4. `Input` - 53 edges
5. `Badge()` - 31 edges
6. `Label` - 29 edges
7. `DialogContent` - 24 edges
8. `useRegion()` - 22 edges
9. `DialogHeader()` - 19 edges
10. `DialogTitle` - 18 edges

## Surprising Connections (you probably didn't know these)
- `PaymentDialog()` --calls--> `useWallet()`  [EXTRACTED]
  C:/Users/ppdub/Documents/Official Work/Weskill/WeFest/git/wefest/src/components/wallet/payment-dialog.tsx → src/hooks/use-wallet.ts
- `PaymentDialog()` --calls--> `cn()`  [EXTRACTED]
  C:/Users/ppdub/Documents/Official Work/Weskill/WeFest/git/wefest/src/components/wallet/payment-dialog.tsx → src/lib/utils.ts
- `QuickActionBtn()` --calls--> `cn()`  [INFERRED]
  src/routes/organizer.index.tsx → src/lib/utils.ts
- `WalletPanel()` --calls--> `coinsToInr()`  [EXTRACTED]
  src/components/wallet/wallet-panel.tsx → C:/Users/ppdub/Documents/Official Work/Weskill/WeFest/git/wefest/src/lib/wallet.functions.ts
- `PublicEventCard()` --calls--> `useRegion()`  [EXTRACTED]
  src/routes/events.tsx → src/contexts/RegionContext.tsx

## Communities (77 total, 20 thin omitted)

### Community 0 - "Routing & Navigation"
Cohesion: 0.03
Nodes (138): Route, Route, Route, Route, Route, Route, Route, Route (+130 more)

### Community 1 - "Forms & User Interface"
Cohesion: 0.05
Nodes (54): useWallet(), useWalletTransactions(), createWalletTopupOrder, getRazorpayKeyId, topupInput, verifyInput, verifyTopupAndCredit, coinsToInr() (+46 more)

### Community 2 - "Event & College Cards"
Cohesion: 0.09
Nodes (38): useIsMobile(), Separator, SheetContent, SheetContentProps, SheetDescription, SheetFooter(), SheetHeader(), SheetOverlay (+30 more)

### Community 3 - "Supabase & Auth"
Cohesion: 0.09
Nodes (32): LoadingScreen(), FooterCol(), marketingNav, organizerNav, SiteFooter(), SiteHeader(), sponsorNav, studentNav (+24 more)

### Community 4 - "Sidebar & Layout"
Cohesion: 0.09
Nodes (21): ActivityFeedPopover(), ActivityFeedPopoverProps, cn(), DashboardStatTile(), DashboardStatTileProps, CompanyProposals(), RoleBadge(), RoleDetail() (+13 more)

### Community 5 - "Admin Management"
Cohesion: 0.1
Nodes (12): AdminAdmins(), Rank, RANKS, AdminCompanies(), CollegeProfilePage(), gradientPalette, hashGradient(), categories (+4 more)

### Community 6 - "Region & Global State"
Cohesion: 0.12
Nodes (19): CertificateProps, CertificateTemplate(), Product, ProductCard(), Currency, RegionContext, RegionContextType, useRegion() (+11 more)

### Community 7 - "Organizer Dashboard"
Cohesion: 0.08
Nodes (20): AdBanner(), AdBannerProps, Event, EventCard(), CategoryFilter(), CategoryFilterProps, EmptyState(), EmptyStateProps (+12 more)

### Community 8 - "Stat Tiles & Pagination"
Cohesion: 0.17
Nodes (18): loadRazorpayScript(), OpenCheckoutOptions, openRazorpayCheckout(), Window, Proposal, SponsorDashboard(), DialogContent, DialogDescription (+10 more)

### Community 9 - "UI Primitives"
Cohesion: 0.13
Nodes (14): QRScanner(), QRScannerProps, OrganizerEventDashboard(), LogEntry, Role, roles, SignupSearch, SelectContent (+6 more)

### Community 10 - "Menubar & Toolbars"
Cohesion: 0.13
Nodes (13): sponsorshipTiers, ALL_TAGS, EditEvent(), normalizeMembers(), ALL_TAGS, Field(), NewEvent(), Kpi() (+5 more)

### Community 11 - "Carousel Components"
Cohesion: 0.11
Nodes (17): OrganizerEventCard(), OrganizerEventCardProps, Activity, iconMap, RecentActivity(), Route, QuickActionBtn(), Route (+9 more)

### Community 12 - "Form Controls"
Cohesion: 0.14
Nodes (8): EventsHeroProps, OrganizerEmptyState(), College, LoginSearch, SafetyPoint(), TalentMarketplace(), Button, Input

### Community 13 - "Charting & Data Viz"
Cohesion: 0.16
Nodes (21): a, admin, amountInr, balance, Body, coins, corsHeaders, inrToCoins() (+13 more)

### Community 14 - "Command Palette"
Cohesion: 0.16
Nodes (20): admin, corsHeaders, currentPeriodEnd, eventId, expected, inrToCoins(), json(), notes (+12 more)

### Community 15 - "Context Menus"
Cohesion: 0.1
Nodes (19): code:bash (git clone https://github.com/Weskill-org/wefest.git), code:bash (bun install), code:env (VITE_SUPABASE_URL=your_supabase_url), code:bash (bun run dev), code:text (src/), 🛡️ For Admins, 🏢 For Organizers, 🤝 For Sponsors (+11 more)

### Community 16 - "Alert Dialogs"
Cohesion: 0.22
Nodes (12): OrganizerHeaderProps, BoothVisit, COLORS, CompanyDashboard(), KpiCard(), Proposal, Route, OrganizerLayout() (+4 more)

### Community 17 - "Table Components"
Cohesion: 0.23
Nodes (12): ButtonProps, buttonVariants, Calendar(), CalendarDayButton(), Pagination(), PaginationContent, PaginationEllipsis(), PaginationItem (+4 more)

### Community 18 - "Blog & Content"
Cohesion: 0.21
Nodes (16): Menubar, MenubarCheckboxItem, MenubarContent, MenubarGroup(), MenubarItem, MenubarLabel, MenubarMenu(), MenubarPortal() (+8 more)

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
Cohesion: 0.3
Nodes (10): ChartConfig, ChartContainer, ChartContext, ChartContextProps, ChartLegendContent, ChartStyle(), ChartTooltipContent, getPayloadConfigFromPayload() (+2 more)

### Community 23 - "Toggles & Buttons"
Cohesion: 0.33
Nodes (9): ContextMenuCheckboxItem, ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuRadioItem, ContextMenuSeparator, ContextMenuShortcut(), ContextMenuSubContent (+1 more)

### Community 24 - "Card Layouts"
Cohesion: 0.33
Nodes (9): Command, CommandDialog(), CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator (+1 more)

### Community 25 - "Quick Actions"
Cohesion: 0.36
Nodes (8): AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter(), AlertDialogHeader(), AlertDialogOverlay, AlertDialogTitle

### Community 26 - "Alert Components"
Cohesion: 0.36
Nodes (8): Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow

### Community 27 - "OTP Input"
Cohesion: 0.39
Nodes (7): Drawer(), DrawerContent, DrawerDescription, DrawerFooter(), DrawerHeader(), DrawerOverlay, DrawerTitle

### Community 28 - "Admin Layout"
Cohesion: 0.39
Nodes (7): Breadcrumb, BreadcrumbEllipsis(), BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator()

### Community 29 - "Student Layout"
Cohesion: 0.39
Nodes (5): ToggleGroup, ToggleGroupContext, ToggleGroupItem, Toggle, toggleVariants

### Community 30 - "Scripts & Utilities"
Cohesion: 0.39
Nodes (7): NavigationMenu, NavigationMenuContent, NavigationMenuIndicator, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle, NavigationMenuViewport

### Community 31 - "Refund Policy"
Cohesion: 0.32
Nodes (3): BLOG_POSTS, Route, Route

### Community 32 - "College Directory"
Cohesion: 0.43
Nodes (6): Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle

### Community 33 - "Cookie Policy"
Cohesion: 0.53
Nodes (4): Alert, AlertDescription, AlertTitle, alertVariants

### Community 34 - "Privacy Policy"
Cohesion: 0.53
Nodes (4): InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot

### Community 35 - "Terms & Conditions"
Cohesion: 0.4
Nodes (3): actions, QuickAction, QuickActionsProps

### Community 36 - "Performance Snapshot"
Cohesion: 0.6
Nodes (3): AccordionContent, AccordionItem, AccordionTrigger

## Knowledge Gaps
- **85 isolated node(s):** `supabase`, `OrganizerActivityRoute`, `StudentActivityRoute`, `ActivityFeedPopoverProps`, `AdBannerProps` (+80 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **20 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Sidebar & Layout` to `Forms & User Interface`, `Event & College Cards`, `Supabase & Auth`, `Admin Management`, `Region & Global State`, `Organizer Dashboard`, `Stat Tiles & Pagination`, `UI Primitives`, `Menubar & Toolbars`, `Carousel Components`, `Form Controls`, `Alert Dialogs`, `Table Components`, `Blog & Content`, `Student Dashboard`, `Drawer Components`, `Navigation Menus`, `Toggles & Buttons`, `Card Layouts`, `Quick Actions`, `Alert Components`, `OTP Input`, `Admin Layout`, `Student Layout`, `Scripts & Utilities`, `College Directory`, `Cookie Policy`, `Privacy Policy`, `Terms & Conditions`, `Performance Snapshot`, `Student Events`, `Blog System`, `WeFest Vision & Model`?**
  _High betweenness centrality (0.265) - this node is a cross-community bridge._
- **Why does `Button` connect `Form Controls` to `Forms & User Interface`, `Event & College Cards`, `Supabase & Auth`, `Admin Management`, `Region & Global State`, `Organizer Dashboard`, `Stat Tiles & Pagination`, `UI Primitives`, `Menubar & Toolbars`, `Carousel Components`, `Collapsible UI`, `Aspect Ratio UI`, `Student Events`, `Alert Dialogs`, `Table Components`, `Student Dashboard`, `Refund Policy`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Why does `supabase` connect `Admin Management` to `Forms & User Interface`, `Supabase & Auth`, `Sidebar & Layout`, `Student Events`, `Region & Global State`, `Organizer Dashboard`, `Stat Tiles & Pagination`, `Vite Config`, `UI Primitives`, `Carousel Components`, `Form Controls`, `Menubar & Toolbars`, `Collapsible UI`, `Alert Dialogs`, `Community 48`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **What connects `supabase`, `OrganizerActivityRoute`, `StudentActivityRoute` to the rest of the system?**
  _85 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Routing & Navigation` be split into smaller, more focused modules?**
  _Cohesion score 0.03 - nodes in this community are weakly interconnected._
- **Should `Forms & User Interface` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `Event & College Cards` be split into smaller, more focused modules?**
  _Cohesion score 0.09 - nodes in this community are weakly interconnected._