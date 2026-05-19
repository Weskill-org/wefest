# Graph Report - wefest  (2026-05-19)

## Corpus Check
- 262 files · ~211,012 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1039 nodes · 2252 edges · 80 communities (58 shown, 22 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8f989823`
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
- [[_COMMUNITY_Community 66|Community 66]]
- [[_COMMUNITY_Community 67|Community 67]]
- [[_COMMUNITY_Community 68|Community 68]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 138 edges
2. `supabase` - 80 edges
3. `Button` - 76 edges
4. `Input` - 44 edges
5. `Badge()` - 26 edges
6. `DialogContent` - 24 edges
7. `Label` - 24 edges
8. `DialogHeader()` - 18 edges
9. `DialogTitle` - 17 edges
10. `DialogDescription` - 15 edges

## Surprising Connections (you probably didn't know these)
- `BreadcrumbSeparator()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/breadcrumb.tsx → src/lib/utils.ts
- `BreadcrumbEllipsis()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/breadcrumb.tsx → src/lib/utils.ts
- `CommandShortcut()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/command.tsx → src/lib/utils.ts
- `ContextMenuShortcut()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/context-menu.tsx → src/lib/utils.ts
- `DrawerHeader()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/drawer.tsx → src/lib/utils.ts

## Communities (80 total, 22 thin omitted)

### Community 0 - "Routing & Navigation"
Cohesion: 0.05
Nodes (57): QRScanner(), QRScannerProps, EventsHeroProps, ShareEventDialogProps, Rank, RANKS, College, Route (+49 more)

### Community 1 - "Forms & User Interface"
Cohesion: 0.01
Nodes (135): Route, Route, Route, Route, Route, Route, Route, Route (+127 more)

### Community 2 - "Event & College Cards"
Cohesion: 0.05
Nodes (31): acceptCollegeJoinRequest(), CollegeJoinRequest, declineCollegeJoinRequest(), fetchCollegeJoinRequests(), fetchStudentJoinRequests(), StudentJoinRequest, submitCollegeJoinRequest(), AcceptTeamInvitationResult (+23 more)

### Community 3 - "Supabase & Auth"
Cohesion: 0.06
Nodes (36): useIsMobile(), Separator, SheetContent, SheetContentProps, SheetDescription, SheetFooter(), SheetHeader(), SheetOverlay (+28 more)

### Community 4 - "Sidebar & Layout"
Cohesion: 0.08
Nodes (24): ShareEventDialog(), capacityFromDb(), capacityToDb(), formatEventCapacity(), isUnlimitedEventCapacity(), ADJECTIVES, formatSlug(), generateEventSlug() (+16 more)

### Community 5 - "Admin Management"
Cohesion: 0.08
Nodes (22): OrganizerEmptyState(), OrganizerEventCard(), OrganizerEventCardProps, Activity, iconMap, RecentActivity(), RecentActivityData, Route (+14 more)

### Community 6 - "Region & Global State"
Cohesion: 0.11
Nodes (22): loadRazorpayScript(), OpenCheckoutOptions, openRazorpayCheckout(), Window, Coupon, Route, Route, Card (+14 more)

### Community 7 - "Organizer Dashboard"
Cohesion: 0.11
Nodes (22): cn(), DashboardStatTile(), DashboardStatTileProps, CompanyMessages(), InviteAcceptPage(), InviteSearch, Route, MemoriesPage() (+14 more)

### Community 8 - "Stat Tiles & Pagination"
Cohesion: 0.08
Nodes (22): admin, corsHeaders, currentPeriodEnd, discountAmount, eventId, expected, notes, organizerId (+14 more)

### Community 9 - "UI Primitives"
Cohesion: 0.09
Nodes (19): applyReferralCode, applyReferralCodeInput, createGiftCard, createGiftCardInput, getAllGiftCards, getMyWithdrawals, payForProductInput, payForProductWithWallet (+11 more)

### Community 10 - "Menubar & Toolbars"
Cohesion: 0.09
Nodes (20): a, admin, balance, Body, corsHeaders, currentPeriodEnd, keyId, keySecret (+12 more)

### Community 11 - "Carousel Components"
Cohesion: 0.14
Nodes (15): ActivityFeedPopover(), OrganizerHeaderProps, BoothVisit, COLORS, CompanyDashboard(), KpiCard(), Proposal, Route (+7 more)

### Community 12 - "Form Controls"
Cohesion: 0.12
Nodes (13): AuthSession, canAccessOrganizerPortal(), getAuthSession(), getSupabaseAuthHeaders(), UserRole, adminLinks, Route, bottomLinks (+5 more)

### Community 13 - "Charting & Data Viz"
Cohesion: 0.1
Nodes (19): code:bash (git clone https://github.com/Weskill-org/wefest.git), code:bash (bun install), code:env (VITE_SUPABASE_URL=your_supabase_url), code:bash (bun run dev), code:text (src/), 🛡️ For Admins, 🏢 For Organizers, 🤝 For Sponsors (+11 more)

### Community 14 - "Command Palette"
Cohesion: 0.19
Nodes (14): useWallet(), useWalletTransactions(), coinsToInr(), getMyWallet, getMyWalletTransactions, Route, Route, PaymentDialog() (+6 more)

### Community 15 - "Context Menus"
Cohesion: 0.14
Nodes (8): LoadingScreen(), Route, getRouter(), queryClient, Register, routeTree, Toaster(), ToasterProps

### Community 16 - "Alert Dialogs"
Cohesion: 0.12
Nodes (11): Menubar, MenubarCheckboxItem, MenubarContent, MenubarItem, MenubarLabel, MenubarRadioItem, MenubarSeparator, MenubarShortcut() (+3 more)

### Community 17 - "Table Components"
Cohesion: 0.14
Nodes (8): ActivityFeedPopoverProps, Checkbox, HoverCardContent, PopoverContent, Progress, RadioGroup, RadioGroupItem, Slider

### Community 18 - "Blog & Content"
Cohesion: 0.22
Nodes (11): CompanyProposals(), Proposal, Route, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter() (+3 more)

### Community 19 - "Student Dashboard"
Cohesion: 0.14
Nodes (12): Carousel, CarouselApi, CarouselContent, CarouselContext, CarouselContextProps, CarouselItem, CarouselNext, CarouselOptions (+4 more)

### Community 20 - "Drawer Components"
Cohesion: 0.21
Nodes (10): Event, EventCard(), Product, ProductCard(), Currency, RegionContext, RegionContextType, RegionProvider() (+2 more)

### Community 21 - "Breadcrumbs"
Cohesion: 0.15
Nodes (12): 1. SEO & Trust Infrastructure (Immediate Priority), 2. Content & Authority Strategy, 3. Growth Channels, 4. Email & Lifecycle Marketing, 5. Analytics & Performance Tracking, Campus Ambassador Program (CAP), Legal Pages Implementation, SEO Optimization (+4 more)

### Community 22 - "Navigation Menus"
Cohesion: 0.3
Nodes (9): ensureStudentProfileRow(), getReferralCodeFromUser(), markReferralProcessed(), processReferralAfterLogin(), processReferralIfPending(), ProcessReferralResult, wasReferralProcessedThisSession(), navLinks (+1 more)

### Community 23 - "Toggles & Buttons"
Cohesion: 0.17
Nodes (9): FormControl, FormDescription, FormFieldContext, FormFieldContextValue, FormItem, FormItemContext, FormItemContextValue, FormLabel (+1 more)

### Community 24 - "Card Layouts"
Cohesion: 0.18
Nodes (7): ChartConfig, ChartContainer, ChartContext, ChartContextProps, ChartLegendContent, ChartTooltipContent, THEMES

### Community 25 - "Quick Actions"
Cohesion: 0.24
Nodes (7): EmptyState(), EmptyStateProps, StudentAppLayout(), StudentAppLayoutProps, CATEGORIES, PublicFestPage(), Route

### Community 26 - "Alert Components"
Cohesion: 0.2
Nodes (9): ContextMenuCheckboxItem, ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuRadioItem, ContextMenuSeparator, ContextMenuShortcut(), ContextMenuSubContent (+1 more)

### Community 27 - "OTP Input"
Cohesion: 0.2
Nodes (8): Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut()

### Community 28 - "Admin Layout"
Cohesion: 0.2
Nodes (9): CompositeTypes, Constants, DatabaseWithoutInternals, DefaultSchema, Enums, Json, Tables, TablesInsert (+1 more)

### Community 29 - "Student Layout"
Cohesion: 0.27
Nodes (4): BLOG_POSTS, Route, Route, Route

### Community 30 - "Scripts & Utilities"
Cohesion: 0.31
Nodes (5): inviteTeamMember, inviteTeamMemberInput, requireSupabaseAuth, supabaseAdmin, Database

### Community 31 - "Refund Policy"
Cohesion: 0.25
Nodes (3): CertificateProps, CertificateTemplate(), Route

### Community 32 - "College Directory"
Cohesion: 0.29
Nodes (3): AdBanner(), AdBannerProps, Route

### Community 33 - "Cookie Policy"
Cohesion: 0.25
Nodes (6): DrawerContent, DrawerDescription, DrawerFooter(), DrawerHeader(), DrawerOverlay, DrawerTitle

### Community 34 - "Privacy Policy"
Cohesion: 0.25
Nodes (7): NavigationMenu, NavigationMenuContent, NavigationMenuIndicator, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle, NavigationMenuViewport

### Community 35 - "Terms & Conditions"
Cohesion: 0.25
Nodes (7): Breadcrumb, BreadcrumbEllipsis(), BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator()

### Community 36 - "Performance Snapshot"
Cohesion: 0.29
Nodes (6): CompanyPartner, DirectMessage, OrganizerMessages(), Route, ScrollArea, ScrollBar

### Community 37 - "Student Events"
Cohesion: 0.29
Nodes (5): DashboardSection(), getGreeting(), Route, StatCard(), StudentDashboard()

### Community 38 - "Blog System"
Cohesion: 0.25
Nodes (3): forecastData, revenueData, Route

### Community 39 - "WeFest Vision & Model"
Cohesion: 0.33
Nodes (5): ToggleGroup, ToggleGroupContext, ToggleGroupItem, Toggle, toggleVariants

### Community 40 - "ESLint Config"
Cohesion: 0.4
Nodes (4): marketingNav, SiteFooter(), SiteHeader(), getDashboardRedirect()

### Community 41 - "Vite Config"
Cohesion: 0.33
Nodes (3): getMyReferralInfo, Route, STEPS

### Community 42 - "Aspect Ratio UI"
Cohesion: 0.4
Nodes (3): actions, QuickAction, QuickActionsProps

### Community 43 - "Collapsible UI"
Cohesion: 0.4
Nodes (4): InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot

### Community 44 - "Event Lifecycle"
Cohesion: 0.4
Nodes (4): Alert, AlertDescription, AlertTitle, alertVariants

### Community 45 - "Pass System"
Cohesion: 0.4
Nodes (4): corsHeaders, InviteEmailPayload, payload, supabaseAdmin

### Community 47 - "Sponsor Matching"
Cohesion: 0.5
Nodes (3): AccordionContent, AccordionItem, AccordionTrigger

## Knowledge Gaps
- **427 isolated node(s):** `supabase`, `supabase`, `supabase`, `Register`, `TermsRoute` (+422 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **22 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Organizer Dashboard` to `Routing & Navigation`, `Event & College Cards`, `Supabase & Auth`, `Sidebar & Layout`, `Admin Management`, `Region & Global State`, `UI Primitives`, `Carousel Components`, `Form Controls`, `Command Palette`, `Alert Dialogs`, `Table Components`, `Blog & Content`, `Student Dashboard`, `Navigation Menus`, `Toggles & Buttons`, `Card Layouts`, `Quick Actions`, `Alert Components`, `OTP Input`, `Refund Policy`, `Cookie Policy`, `Privacy Policy`, `Terms & Conditions`, `Performance Snapshot`, `Student Events`, `WeFest Vision & Model`, `Vite Config`, `Aspect Ratio UI`, `Collapsible UI`, `Event Lifecycle`, `Sponsor Matching`?**
  _High betweenness centrality (0.224) - this node is a cross-community bridge._
- **Why does `supabase` connect `Routing & Navigation` to `Event & College Cards`, `Sidebar & Layout`, `Admin Management`, `Region & Global State`, `Organizer Dashboard`, `Carousel Components`, `Form Controls`, `Command Palette`, `Context Menus`, `Blog & Content`, `Navigation Menus`, `Quick Actions`, `Student Layout`, `Refund Policy`, `College Directory`, `Performance Snapshot`, `Student Events`, `Blog System`, `Vite Config`, `QR Ticketing`, `Community 49`, `Community 54`, `Community 55`, `Community 62`, `Community 66`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Why does `Button` connect `Routing & Navigation` to `Event & College Cards`, `Supabase & Auth`, `Sidebar & Layout`, `Admin Management`, `Region & Global State`, `Organizer Dashboard`, `UI Primitives`, `Carousel Components`, `Form Controls`, `Command Palette`, `Blog & Content`, `Student Dashboard`, `Drawer Components`, `Quick Actions`, `Student Layout`, `Refund Policy`, `College Directory`, `Performance Snapshot`, `Student Events`, `Blog System`, `ESLint Config`, `Vite Config`, `Community 48`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **What connects `supabase`, `supabase`, `supabase` to the rest of the system?**
  _427 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Routing & Navigation` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `Forms & User Interface` be split into smaller, more focused modules?**
  _Cohesion score 0.01 - nodes in this community are weakly interconnected._
- **Should `Event & College Cards` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._