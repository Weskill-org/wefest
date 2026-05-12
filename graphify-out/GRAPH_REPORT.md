# Graph Report - wefest  (2026-05-12)

## Corpus Check
- 158 files · ~82,291 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 690 nodes · 1322 edges · 64 communities (47 shown, 17 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b6d322e2`
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
- [[_COMMUNITY_Community 60|Community 60]]
- [[_COMMUNITY_Community 61|Community 61]]
- [[_COMMUNITY_Community 62|Community 62]]
- [[_COMMUNITY_Community 63|Community 63]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 93 edges
2. `Button` - 53 edges
3. `supabase` - 50 edges
4. `Input` - 33 edges
5. `useRegion()` - 17 edges
6. `Badge()` - 16 edges
7. `Label` - 11 edges
8. `EventCard()` - 7 edges
9. `TabsList` - 7 edges
10. `TabsTrigger` - 7 edges

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

## Communities (64 total, 17 thin omitted)

### Community 0 - "Routing & Navigation"
Cohesion: 0.06
Nodes (38): CertificateProps, CertificateTemplate(), EventsHeroProps, Rank, RANKS, College, Route, Route (+30 more)

### Community 1 - "Forms & User Interface"
Cohesion: 0.02
Nodes (86): Route, Route, Route, Route, Route, Route, Route, Route (+78 more)

### Community 2 - "Event & College Cards"
Cohesion: 0.06
Nodes (33): Route, ALL_TAGS, EditEvent(), normalizeMembers(), Route, Route, Route, sponsorshipTiers (+25 more)

### Community 3 - "Supabase & Auth"
Cohesion: 0.05
Nodes (37): useIsMobile(), Separator, SheetContent, SheetContentProps, SheetDescription, SheetFooter(), SheetHeader(), SheetOverlay (+29 more)

### Community 4 - "Sidebar & Layout"
Cohesion: 0.09
Nodes (18): OrganizerEmptyState(), OrganizerEventCard(), OrganizerEventCardProps, Activity, iconMap, RecentActivity(), Route, Route (+10 more)

### Community 5 - "Admin Management"
Cohesion: 0.13
Nodes (13): Route, LogEntry, Route, Route, Route, SelectContent, SelectItem, SelectLabel (+5 more)

### Community 6 - "Region & Global State"
Cohesion: 0.16
Nodes (17): cn(), DashboardStatTile(), DashboardStatTileProps, ButtonProps, buttonVariants, Calendar(), CalendarDayButton(), Pagination() (+9 more)

### Community 7 - "Organizer Dashboard"
Cohesion: 0.15
Nodes (9): Event, EventCard(), EmptyState(), EmptyStateProps, categories, cats, Route, cats (+1 more)

### Community 8 - "Stat Tiles & Pagination"
Cohesion: 0.14
Nodes (9): marketingNav, organizerNav, SiteFooter(), SiteHeader(), sponsorNav, studentNav, Route, Toaster() (+1 more)

### Community 9 - "UI Primitives"
Cohesion: 0.12
Nodes (11): Menubar, MenubarCheckboxItem, MenubarContent, MenubarItem, MenubarLabel, MenubarRadioItem, MenubarSeparator, MenubarShortcut() (+3 more)

### Community 10 - "Menubar & Toolbars"
Cohesion: 0.12
Nodes (9): Checkbox, HoverCardContent, PopoverContent, Progress, RadioGroup, RadioGroupItem, ScrollArea, ScrollBar (+1 more)

### Community 11 - "Carousel Components"
Cohesion: 0.16
Nodes (13): Product, ProductCard(), Currency, RegionContext, RegionContextType, RegionProvider(), useRegion(), AdminDashboard() (+5 more)

### Community 12 - "Form Controls"
Cohesion: 0.14
Nodes (12): requireSupabaseAuth, supabaseAdmin, CompositeTypes, Constants, Database, DatabaseWithoutInternals, DefaultSchema, Enums (+4 more)

### Community 13 - "Charting & Data Viz"
Cohesion: 0.14
Nodes (12): Carousel, CarouselApi, CarouselContent, CarouselContext, CarouselContextProps, CarouselItem, CarouselNext, CarouselOptions (+4 more)

### Community 14 - "Command Palette"
Cohesion: 0.15
Nodes (12): 1. SEO & Trust Infrastructure (Immediate Priority), 2. Content & Authority Strategy, 3. Growth Channels, 4. Email & Lifecycle Marketing, 5. Analytics & Performance Tracking, Campus Ambassador Program (CAP), Legal Pages Implementation, SEO Optimization (+4 more)

### Community 15 - "Context Menus"
Cohesion: 0.27
Nodes (7): OrganizerHeaderProps, OrganizerLayout(), Route, sidebarLinks, Avatar, AvatarFallback, AvatarImage

### Community 16 - "Alert Dialogs"
Cohesion: 0.18
Nodes (7): ChartConfig, ChartContainer, ChartContext, ChartContextProps, ChartLegendContent, ChartTooltipContent, THEMES

### Community 17 - "Table Components"
Cohesion: 0.2
Nodes (9): ContextMenuCheckboxItem, ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuRadioItem, ContextMenuSeparator, ContextMenuShortcut(), ContextMenuSubContent (+1 more)

### Community 18 - "Blog & Content"
Cohesion: 0.22
Nodes (8): AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter(), AlertDialogHeader(), AlertDialogOverlay, AlertDialogTitle

### Community 19 - "Student Dashboard"
Cohesion: 0.22
Nodes (8): Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow

### Community 20 - "Drawer Components"
Cohesion: 0.32
Nodes (3): BLOG_POSTS, Route, Route

### Community 21 - "Breadcrumbs"
Cohesion: 0.29
Nodes (3): AdBanner(), AdBannerProps, Route

### Community 22 - "Navigation Menus"
Cohesion: 0.29
Nodes (5): CategoryFilter(), CategoryFilterProps, EventsHero(), cats, Route

### Community 23 - "Toggles & Buttons"
Cohesion: 0.25
Nodes (7): NavigationMenu, NavigationMenuContent, NavigationMenuIndicator, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle, NavigationMenuViewport

### Community 24 - "Card Layouts"
Cohesion: 0.25
Nodes (6): DrawerContent, DrawerDescription, DrawerFooter(), DrawerHeader(), DrawerOverlay, DrawerTitle

### Community 25 - "Quick Actions"
Cohesion: 0.25
Nodes (7): Breadcrumb, BreadcrumbEllipsis(), BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator()

### Community 26 - "Alert Components"
Cohesion: 0.29
Nodes (5): DashboardSection(), getGreeting(), Route, StatCard(), StudentDashboard()

### Community 27 - "OTP Input"
Cohesion: 0.25
Nodes (3): forecastData, revenueData, Route

### Community 28 - "Admin Layout"
Cohesion: 0.29
Nodes (6): Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle

### Community 29 - "Student Layout"
Cohesion: 0.33
Nodes (4): ALL_TAGS, NewEvent(), Route, Textarea

### Community 30 - "Scripts & Utilities"
Cohesion: 0.33
Nodes (5): ToggleGroup, ToggleGroupContext, ToggleGroupItem, Toggle, toggleVariants

### Community 31 - "Refund Policy"
Cohesion: 0.33
Nodes (4): getRouter(), queryClient, Register, routeTree

### Community 32 - "College Directory"
Cohesion: 0.4
Nodes (3): actions, QuickAction, QuickActionsProps

### Community 33 - "Cookie Policy"
Cohesion: 0.4
Nodes (4): InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot

### Community 34 - "Privacy Policy"
Cohesion: 0.4
Nodes (4): Alert, AlertDescription, AlertTitle, alertVariants

### Community 37 - "Student Events"
Cohesion: 0.5
Nodes (3): navLinks, Route, StudentLayout()

### Community 38 - "Blog System"
Cohesion: 0.5
Nodes (3): AccordionContent, AccordionItem, AccordionTrigger

## Knowledge Gaps
- **307 isolated node(s):** `supabase`, `Register`, `TermsRoute`, `TalentRoute`, `SponsorsRoute` (+302 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Region & Global State` to `Routing & Navigation`, `Event & College Cards`, `Supabase & Auth`, `Sidebar & Layout`, `Admin Management`, `UI Primitives`, `Menubar & Toolbars`, `Charting & Data Viz`, `Context Menus`, `Alert Dialogs`, `Table Components`, `Blog & Content`, `Student Dashboard`, `Toggles & Buttons`, `Card Layouts`, `Quick Actions`, `Alert Components`, `Admin Layout`, `Student Layout`, `Scripts & Utilities`, `College Directory`, `Cookie Policy`, `Privacy Policy`, `Student Events`, `Blog System`?**
  _High betweenness centrality (0.255) - this node is a cross-community bridge._
- **Why does `Button` connect `Routing & Navigation` to `Event & College Cards`, `Supabase & Auth`, `Sidebar & Layout`, `Admin Management`, `Region & Global State`, `Organizer Dashboard`, `Stat Tiles & Pagination`, `Performance Snapshot`, `Carousel Components`, `Charting & Data Viz`, `Context Menus`, `Drawer Components`, `Breadcrumbs`, `Alert Components`, `OTP Input`, `Student Layout`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Why does `supabase` connect `Routing & Navigation` to `Event & College Cards`, `Terms & Conditions`, `Sidebar & Layout`, `Admin Management`, `Student Events`, `Organizer Dashboard`, `Stat Tiles & Pagination`, `Carousel Components`, `Collapsible UI`, `Context Menus`, `Breadcrumbs`, `Navigation Menus`, `Alert Components`, `OTP Input`, `Student Layout`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **What connects `supabase`, `Register`, `TermsRoute` to the rest of the system?**
  _307 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Routing & Navigation` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._
- **Should `Forms & User Interface` be split into smaller, more focused modules?**
  _Cohesion score 0.02 - nodes in this community are weakly interconnected._
- **Should `Event & College Cards` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._