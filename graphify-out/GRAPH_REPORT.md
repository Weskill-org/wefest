# Graph Report - wefest  (2026-05-13)

## Corpus Check
- 175 files · ~94,381 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 770 nodes · 1549 edges · 63 communities (45 shown, 18 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `03ecebcc`
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
- [[_COMMUNITY_Community 59|Community 59]]
- [[_COMMUNITY_Community 60|Community 60]]
- [[_COMMUNITY_Community 61|Community 61]]
- [[_COMMUNITY_Community 62|Community 62]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 99 edges
2. `Button` - 61 edges
3. `supabase` - 58 edges
4. `Input` - 37 edges
5. `Badge()` - 20 edges
6. `useRegion()` - 17 edges
7. `Label` - 15 edges
8. `DialogContent` - 9 edges
9. `DialogHeader()` - 8 edges
10. `SelectTrigger` - 8 edges

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

## Communities (63 total, 18 thin omitted)

### Community 0 - "Routing & Navigation"
Cohesion: 0.05
Nodes (46): EventsHeroProps, Rank, RANKS, Route, College, Route, Route, Route (+38 more)

### Community 1 - "Forms & User Interface"
Cohesion: 0.02
Nodes (108): Route, Route, Route, Route, Route, Route, Route, Route (+100 more)

### Community 2 - "Event & College Cards"
Cohesion: 0.05
Nodes (38): CertificateProps, CertificateTemplate(), marketingNav, organizerNav, SiteFooter(), SiteHeader(), sponsorNav, studentNav (+30 more)

### Community 3 - "Supabase & Auth"
Cohesion: 0.06
Nodes (40): Product, ProductCard(), useWallet(), useWalletTransactions(), createWalletTopupOrder, getRazorpayKeyId, topupInput, verifyInput (+32 more)

### Community 4 - "Sidebar & Layout"
Cohesion: 0.05
Nodes (37): useIsMobile(), Separator, SheetContent, SheetContentProps, SheetDescription, SheetFooter(), SheetHeader(), SheetOverlay (+29 more)

### Community 5 - "Admin Management"
Cohesion: 0.08
Nodes (18): AdBanner(), AdBannerProps, Event, EventCard(), CategoryFilter(), CategoryFilterProps, EmptyState(), EmptyStateProps (+10 more)

### Community 6 - "Region & Global State"
Cohesion: 0.13
Nodes (20): cn(), DashboardStatTile(), DashboardStatTileProps, EditEvent(), normalizeMembers(), NewEvent(), ButtonProps, buttonVariants (+12 more)

### Community 7 - "Organizer Dashboard"
Cohesion: 0.09
Nodes (13): Checkbox, HoverCardContent, PopoverContent, Progress, RadioGroup, RadioGroupItem, Slider, Switch (+5 more)

### Community 8 - "Stat Tiles & Pagination"
Cohesion: 0.16
Nodes (8): OrganizerEmptyState(), OrganizerEventCard(), Activity, iconMap, RecentActivity(), Route, Route, Skeleton()

### Community 9 - "UI Primitives"
Cohesion: 0.12
Nodes (11): Menubar, MenubarCheckboxItem, MenubarContent, MenubarItem, MenubarLabel, MenubarRadioItem, MenubarSeparator, MenubarShortcut() (+3 more)

### Community 10 - "Menubar & Toolbars"
Cohesion: 0.14
Nodes (12): Carousel, CarouselApi, CarouselContent, CarouselContext, CarouselContextProps, CarouselItem, CarouselNext, CarouselOptions (+4 more)

### Community 11 - "Carousel Components"
Cohesion: 0.15
Nodes (12): 1. SEO & Trust Infrastructure (Immediate Priority), 2. Content & Authority Strategy, 3. Growth Channels, 4. Email & Lifecycle Marketing, 5. Analytics & Performance Tracking, Campus Ambassador Program (CAP), Legal Pages Implementation, SEO Optimization (+4 more)

### Community 12 - "Form Controls"
Cohesion: 0.17
Nodes (9): FormControl, FormDescription, FormFieldContext, FormFieldContextValue, FormItem, FormItemContext, FormItemContextValue, FormLabel (+1 more)

### Community 13 - "Charting & Data Viz"
Cohesion: 0.21
Nodes (10): OrganizerEventCardProps, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut() (+2 more)

### Community 14 - "Command Palette"
Cohesion: 0.27
Nodes (7): OrganizerHeaderProps, OrganizerLayout(), Route, sidebarLinks, Avatar, AvatarFallback, AvatarImage

### Community 15 - "Context Menus"
Cohesion: 0.18
Nodes (7): ChartConfig, ChartContainer, ChartContext, ChartContextProps, ChartLegendContent, ChartTooltipContent, THEMES

### Community 16 - "Alert Dialogs"
Cohesion: 0.2
Nodes (8): Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut()

### Community 17 - "Table Components"
Cohesion: 0.2
Nodes (9): ContextMenuCheckboxItem, ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuRadioItem, ContextMenuSeparator, ContextMenuShortcut(), ContextMenuSubContent (+1 more)

### Community 18 - "Blog & Content"
Cohesion: 0.22
Nodes (8): AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter(), AlertDialogHeader(), AlertDialogOverlay, AlertDialogTitle

### Community 19 - "Student Dashboard"
Cohesion: 0.19
Nodes (7): bottomLinks, CompanyLayout(), Route, sidebarLinks, navLinks, Route, StudentLayout()

### Community 20 - "Drawer Components"
Cohesion: 0.22
Nodes (8): Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow

### Community 21 - "Breadcrumbs"
Cohesion: 0.25
Nodes (7): NavigationMenu, NavigationMenuContent, NavigationMenuIndicator, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle, NavigationMenuViewport

### Community 22 - "Navigation Menus"
Cohesion: 0.25
Nodes (7): Breadcrumb, BreadcrumbEllipsis(), BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator()

### Community 23 - "Toggles & Buttons"
Cohesion: 0.25
Nodes (6): DrawerContent, DrawerDescription, DrawerFooter(), DrawerHeader(), DrawerOverlay, DrawerTitle

### Community 24 - "Card Layouts"
Cohesion: 0.29
Nodes (5): DashboardSection(), getGreeting(), Route, StatCard(), StudentDashboard()

### Community 25 - "Quick Actions"
Cohesion: 0.25
Nodes (3): forecastData, revenueData, Route

### Community 26 - "Alert Components"
Cohesion: 0.32
Nodes (3): BLOG_POSTS, Route, Route

### Community 27 - "OTP Input"
Cohesion: 0.29
Nodes (6): Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle

### Community 28 - "Admin Layout"
Cohesion: 0.4
Nodes (4): CollegeProfilePage(), gradientPalette, hashGradient(), Route

### Community 29 - "Student Layout"
Cohesion: 0.4
Nodes (4): InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot

### Community 30 - "Scripts & Utilities"
Cohesion: 0.4
Nodes (3): actions, QuickAction, QuickActionsProps

### Community 31 - "Refund Policy"
Cohesion: 0.4
Nodes (4): Alert, AlertDescription, AlertTitle, alertVariants

### Community 32 - "College Directory"
Cohesion: 0.5
Nodes (4): loadRazorpayScript(), OpenCheckoutOptions, openRazorpayCheckout(), Window

### Community 33 - "Cookie Policy"
Cohesion: 0.5
Nodes (3): AccordionContent, AccordionItem, AccordionTrigger

## Knowledge Gaps
- **334 isolated node(s):** `supabase`, `Register`, `TermsRoute`, `TalentRoute`, `SponsorsRoute` (+329 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **18 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Region & Global State` to `Routing & Navigation`, `Event & College Cards`, `Supabase & Auth`, `Sidebar & Layout`, `Admin Management`, `Organizer Dashboard`, `Stat Tiles & Pagination`, `UI Primitives`, `Menubar & Toolbars`, `Form Controls`, `Charting & Data Viz`, `Command Palette`, `Context Menus`, `Alert Dialogs`, `Table Components`, `Blog & Content`, `Student Dashboard`, `Drawer Components`, `Breadcrumbs`, `Navigation Menus`, `Toggles & Buttons`, `Card Layouts`, `OTP Input`, `Student Layout`, `Scripts & Utilities`, `Refund Policy`, `Cookie Policy`, `Blog System`?**
  _High betweenness centrality (0.239) - this node is a cross-community bridge._
- **Why does `Button` connect `Routing & Navigation` to `Event & College Cards`, `Supabase & Auth`, `Sidebar & Layout`, `Admin Management`, `Region & Global State`, `Terms & Conditions`, `Stat Tiles & Pagination`, `Menubar & Toolbars`, `Charting & Data Viz`, `Command Palette`, `Card Layouts`, `Quick Actions`, `Alert Components`, `Admin Layout`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **Why does `supabase` connect `Routing & Navigation` to `Event & College Cards`, `Supabase & Auth`, `Privacy Policy`, `Admin Management`, `Stat Tiles & Pagination`, `Aspect Ratio UI`, `Charting & Data Viz`, `Command Palette`, `Student Dashboard`, `Card Layouts`, `Quick Actions`, `Admin Layout`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **What connects `supabase`, `Register`, `TermsRoute` to the rest of the system?**
  _334 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Routing & Navigation` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `Forms & User Interface` be split into smaller, more focused modules?**
  _Cohesion score 0.02 - nodes in this community are weakly interconnected._
- **Should `Event & College Cards` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._