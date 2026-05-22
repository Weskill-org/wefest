# Graph Report - wefest  (2026-05-22)

## Corpus Check
- 293 files · ~1,226,211 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1399 nodes · 2635 edges · 99 communities (78 shown, 21 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7ed2db0d`
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
- [[_COMMUNITY_Community 69|Community 69]]
- [[_COMMUNITY_Community 70|Community 70]]
- [[_COMMUNITY_Community 71|Community 71]]
- [[_COMMUNITY_Community 72|Community 72]]
- [[_COMMUNITY_Community 73|Community 73]]
- [[_COMMUNITY_Community 74|Community 74]]
- [[_COMMUNITY_Community 75|Community 75]]
- [[_COMMUNITY_Community 76|Community 76]]
- [[_COMMUNITY_Community 77|Community 77]]
- [[_COMMUNITY_Community 78|Community 78]]
- [[_COMMUNITY_Community 79|Community 79]]
- [[_COMMUNITY_Community 80|Community 80]]
- [[_COMMUNITY_Community 81|Community 81]]
- [[_COMMUNITY_Community 82|Community 82]]
- [[_COMMUNITY_Community 83|Community 83]]
- [[_COMMUNITY_Community 84|Community 84]]
- [[_COMMUNITY_Community 85|Community 85]]
- [[_COMMUNITY_Community 86|Community 86]]
- [[_COMMUNITY_Community 87|Community 87]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 140 edges
2. `supabase` - 80 edges
3. `Button` - 78 edges
4. `Input` - 45 edges
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

## Communities (99 total, 21 thin omitted)

### Community 0 - "Routing & Navigation"
Cohesion: 0.05
Nodes (64): QRScanner(), QRScannerProps, EventsHeroProps, ShareEventDialogProps, TimePickerProps, Rank, RANKS, College (+56 more)

### Community 1 - "Forms & User Interface"
Cohesion: 0.01
Nodes (140): Route, Route, Route, Route, Route, Route, Route, Route (+132 more)

### Community 2 - "Event & College Cards"
Cohesion: 0.05
Nodes (31): acceptCollegeJoinRequest(), CollegeJoinRequest, declineCollegeJoinRequest(), fetchCollegeJoinRequests(), fetchStudentJoinRequests(), StudentJoinRequest, submitCollegeJoinRequest(), AcceptTeamInvitationResult (+23 more)

### Community 3 - "Supabase & Auth"
Cohesion: 0.06
Nodes (34): EmptyState(), EmptyStateProps, ShareEventDialog(), StudentAppLayout(), StudentAppLayoutProps, capacityFromDb(), capacityToDb(), formatEventCapacity() (+26 more)

### Community 4 - "Sidebar & Layout"
Cohesion: 0.06
Nodes (36): ActivityFeedPopover(), ActivityFeedPopoverProps, AuthSession, canAccessOrganizerPortal(), getAuthSession(), getSupabaseAuthHeaders(), UserRole, ensureStudentProfileRow() (+28 more)

### Community 5 - "Admin Management"
Cohesion: 0.06
Nodes (26): LoadingScreen(), AdBanner(), AdBannerProps, Event, EventCard(), Product, ProductCard(), marketingNav (+18 more)

### Community 6 - "Region & Global State"
Cohesion: 0.05
Nodes (37): useIsMobile(), Separator, SheetContent, SheetContentProps, SheetDescription, SheetFooter(), SheetHeader(), SheetOverlay (+29 more)

### Community 7 - "Organizer Dashboard"
Cohesion: 0.05
Nodes (39): AI Image Generation Prompts, Article Schema, ARTICLE STRUCTURE (5000 WORDS), CALLS-TO-ACTION, Content Quality Standards, CORE IDENTITY, CTA Placement (5-6 per article), Engagement Techniques (+31 more)

### Community 8 - "Stat Tiles & Pagination"
Cohesion: 0.08
Nodes (22): OrganizerEmptyState(), OrganizerEventCard(), OrganizerEventCardProps, Activity, iconMap, RecentActivity(), RecentActivityData, Route (+14 more)

### Community 9 - "UI Primitives"
Cohesion: 0.12
Nodes (21): loadRazorpayScript(), OpenCheckoutOptions, openRazorpayCheckout(), Window, Coupon, Route, Route, Card (+13 more)

### Community 10 - "Menubar & Toolbars"
Cohesion: 0.11
Nodes (23): cn(), DashboardStatTile(), DashboardStatTileProps, CompanyDashboard(), KpiCard(), CompanyMessages(), Signup(), MemoriesPage() (+15 more)

### Community 11 - "Carousel Components"
Cohesion: 0.08
Nodes (22): admin, corsHeaders, currentPeriodEnd, discountAmount, eventId, expected, notes, organizerId (+14 more)

### Community 12 - "Form Controls"
Cohesion: 0.09
Nodes (19): applyReferralCode, applyReferralCodeInput, createGiftCard, createGiftCardInput, getAllGiftCards, getMyWithdrawals, payForProductInput, payForProductWithWallet (+11 more)

### Community 13 - "Charting & Data Viz"
Cohesion: 0.09
Nodes (20): a, admin, balance, Body, corsHeaders, currentPeriodEnd, keyId, keySecret (+12 more)

### Community 14 - "Command Palette"
Cohesion: 0.13
Nodes (11): BlogContentRenderer(), BlogContentRendererProps, BLOG_POSTS, BlogPost, Route, Route, Route, duplicates (+3 more)

### Community 15 - "Context Menus"
Cohesion: 0.11
Nodes (11): CapacityFieldProps, AccordionContent, AccordionItem, AccordionTrigger, Checkbox, HoverCardContent, Progress, RadioGroup (+3 more)

### Community 16 - "Alert Dialogs"
Cohesion: 0.1
Nodes (19): code:bash (git clone https://github.com/Weskill-org/wefest.git), code:bash (bun install), code:env (VITE_SUPABASE_URL=your_supabase_url), code:bash (bun run dev), code:text (src/), 🛡️ For Admins, 🏢 For Organizers, 🤝 For Sponsors (+11 more)

### Community 17 - "Table Components"
Cohesion: 0.12
Nodes (11): Menubar, MenubarCheckboxItem, MenubarContent, MenubarItem, MenubarLabel, MenubarRadioItem, MenubarSeparator, MenubarShortcut() (+3 more)

### Community 18 - "Blog & Content"
Cohesion: 0.22
Nodes (11): CompanyProposals(), Proposal, Route, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter() (+3 more)

### Community 19 - "Student Dashboard"
Cohesion: 0.14
Nodes (12): Carousel, CarouselApi, CarouselContent, CarouselContext, CarouselContextProps, CarouselItem, CarouselNext, CarouselOptions (+4 more)

### Community 20 - "Drawer Components"
Cohesion: 0.15
Nodes (12): batchFiles, content, existingSlugs, filePath, files, fileText, matches1, matches2 (+4 more)

### Community 21 - "Breadcrumbs"
Cohesion: 0.17
Nodes (11): BLOG_FILE, blogs, closingIndex, content, escaped, existingContent, existingSlugs, fileContent (+3 more)

### Community 22 - "Navigation Menus"
Cohesion: 0.17
Nodes (11): BLOG_FILE, blogs, closingIndex, content, escaped, existingContent, existingSlugs, fileContent (+3 more)

### Community 23 - "Toggles & Buttons"
Cohesion: 0.15
Nodes (9): BLOG_FILE, blogs, closingIndex, content, escaped, existingContent, existingSlugs, fileContent (+1 more)

### Community 24 - "Card Layouts"
Cohesion: 0.15
Nodes (9): BLOG_FILE, blogs, closingIndex, content, escaped, existingContent, existingSlugs, fileContent (+1 more)

### Community 25 - "Quick Actions"
Cohesion: 0.21
Nodes (8): useWalletTransactions(), Route, Route, Route, RedeemGiftCardDialog(), TYPE_LABEL, WalletPanel(), WalletTopupDialog()

### Community 26 - "Alert Components"
Cohesion: 0.15
Nodes (12): 1. SEO & Trust Infrastructure (Immediate Priority), 2. Content & Authority Strategy, 3. Growth Channels, 4. Email & Lifecycle Marketing, 5. Analytics & Performance Tracking, Campus Ambassador Program (CAP), Legal Pages Implementation, SEO Optimization (+4 more)

### Community 27 - "OTP Input"
Cohesion: 0.18
Nodes (11): BLOG_FILE, blogs, closingIndex, content, escaped, existingContent, existingSlugs, fileContent (+3 more)

### Community 28 - "Admin Layout"
Cohesion: 0.18
Nodes (11): BLOG_FILE, blogs, closingIndex, content, escaped, existingContent, existingSlugs, fileContent (+3 more)

### Community 29 - "Student Layout"
Cohesion: 0.18
Nodes (11): BLOG_FILE, blogs, closingIndex, content, escaped, existingContent, existingSlugs, fileContent (+3 more)

### Community 30 - "Scripts & Utilities"
Cohesion: 0.18
Nodes (11): BLOG_FILE, blogs, closingIndex, content, escaped, existingContent, existingSlugs, fileContent (+3 more)

### Community 31 - "Refund Policy"
Cohesion: 0.18
Nodes (11): BLOG_FILE, blogs, closingIndex, content, escaped, existingContent, existingSlugs, fileContent (+3 more)

### Community 32 - "College Directory"
Cohesion: 0.18
Nodes (11): BLOG_FILE, blogs, closingIndex, content, escaped, existingContent, existingSlugs, fileContent (+3 more)

### Community 33 - "Cookie Policy"
Cohesion: 0.18
Nodes (11): BLOG_FILE, blogs, closingIndex, content, escaped, existingContent, existingSlugs, fileContent (+3 more)

### Community 34 - "Privacy Policy"
Cohesion: 0.18
Nodes (11): BLOG_FILE, blogs, closingIndex, content, escaped, existingContent, existingSlugs, fileContent (+3 more)

### Community 35 - "Terms & Conditions"
Cohesion: 0.18
Nodes (11): BLOG_FILE, blogs, closingIndex, content, escaped, existingContent, existingSlugs, fileContent (+3 more)

### Community 36 - "Performance Snapshot"
Cohesion: 0.18
Nodes (11): BLOG_FILE, blogs, closingIndex, content, escaped, existingContent, existingSlugs, fileContent (+3 more)

### Community 37 - "Student Events"
Cohesion: 0.18
Nodes (11): BLOG_FILE, blogs, closingIndex, content, escaped, existingContent, existingSlugs, fileContent (+3 more)

### Community 38 - "Blog System"
Cohesion: 0.18
Nodes (11): BLOG_FILE, blogs, closingIndex, content, escaped, existingContent, existingSlugs, fileContent (+3 more)

### Community 39 - "WeFest Vision & Model"
Cohesion: 0.18
Nodes (11): BLOG_FILE, blogs, closingIndex, content, escaped, existingContent, existingSlugs, fileContent (+3 more)

### Community 40 - "ESLint Config"
Cohesion: 0.18
Nodes (11): BLOG_FILE, blogs, closingIndex, content, escaped, existingContent, existingSlugs, fileContent (+3 more)

### Community 41 - "Vite Config"
Cohesion: 0.18
Nodes (11): BLOG_FILE, blogs, closingIndex, content, escaped, existingContent, existingSlugs, fileContent (+3 more)

### Community 42 - "Aspect Ratio UI"
Cohesion: 0.18
Nodes (11): BLOG_FILE, blogs, closingIndex, content, escaped, existingContent, existingSlugs, fileContent (+3 more)

### Community 43 - "Collapsible UI"
Cohesion: 0.17
Nodes (9): FormControl, FormDescription, FormFieldContext, FormFieldContextValue, FormItem, FormItemContext, FormItemContextValue, FormLabel (+1 more)

### Community 44 - "Event Lifecycle"
Cohesion: 0.18
Nodes (7): ChartConfig, ChartContainer, ChartContext, ChartContextProps, ChartLegendContent, ChartTooltipContent, THEMES

### Community 45 - "Pass System"
Cohesion: 0.2
Nodes (9): ContextMenuCheckboxItem, ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuRadioItem, ContextMenuSeparator, ContextMenuShortcut(), ContextMenuSubContent (+1 more)

### Community 46 - "QR Ticketing"
Cohesion: 0.2
Nodes (8): Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut()

### Community 47 - "Sponsor Matching"
Cohesion: 0.2
Nodes (9): CompositeTypes, Constants, DatabaseWithoutInternals, DefaultSchema, Enums, Json, Tables, TablesInsert (+1 more)

### Community 48 - "Community 48"
Cohesion: 0.22
Nodes (8): blogBlocks, content, __dirname, __filename, filePath, hasContent, slugMatch, withoutContentSlugs

### Community 49 - "Community 49"
Cohesion: 0.22
Nodes (7): BLOG_FILE, blogs, closingIndex, content, escaped, existingContent, fileContent

### Community 50 - "Community 50"
Cohesion: 0.25
Nodes (3): CertificateProps, CertificateTemplate(), Route

### Community 51 - "Community 51"
Cohesion: 0.36
Nodes (7): useWallet(), coinsToInr(), getMyWallet, getMyWalletTransactions, PaymentDialog(), PaymentDialogProps, PurchaseIntent

### Community 52 - "Community 52"
Cohesion: 0.31
Nodes (5): inviteTeamMember, inviteTeamMemberInput, requireSupabaseAuth, supabaseAdmin, Database

### Community 53 - "Community 53"
Cohesion: 0.25
Nodes (7): blogBlocks, checks, content, incomplete, missing, slugMatch, slugMatches

### Community 54 - "Community 54"
Cohesion: 0.25
Nodes (3): forecastData, revenueData, Route

### Community 55 - "Community 55"
Cohesion: 0.25
Nodes (6): DrawerContent, DrawerDescription, DrawerFooter(), DrawerHeader(), DrawerOverlay, DrawerTitle

### Community 56 - "Community 56"
Cohesion: 0.25
Nodes (7): NavigationMenu, NavigationMenuContent, NavigationMenuIndicator, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle, NavigationMenuViewport

### Community 57 - "Community 57"
Cohesion: 0.25
Nodes (7): Breadcrumb, BreadcrumbEllipsis(), BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator()

### Community 58 - "Community 58"
Cohesion: 0.29
Nodes (6): content, __dirname, __filename, filePath, matches, slugs

### Community 59 - "Community 59"
Cohesion: 0.33
Nodes (5): ToggleGroup, ToggleGroupContext, ToggleGroupItem, Toggle, toggleVariants

### Community 60 - "Community 60"
Cohesion: 0.33
Nodes (5): content, __dirname, __filename, filePath, matches

### Community 61 - "Community 61"
Cohesion: 0.33
Nodes (3): getMyReferralInfo, Route, STEPS

### Community 62 - "Community 62"
Cohesion: 0.4
Nodes (3): actions, QuickAction, QuickActionsProps

### Community 63 - "Community 63"
Cohesion: 0.4
Nodes (4): Alert, AlertDescription, AlertTitle, alertVariants

### Community 64 - "Community 64"
Cohesion: 0.4
Nodes (4): InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot

### Community 65 - "Community 65"
Cohesion: 0.4
Nodes (4): corsHeaders, InviteEmailPayload, payload, supabaseAdmin

### Community 69 - "Community 69"
Cohesion: 0.5
Nodes (3): InviteAcceptPage(), InviteSearch, Route

## Knowledge Gaps
- **694 isolated node(s):** `supabase`, `content`, `existingSlugs`, `files`, `batchFiles` (+689 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **21 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Menubar & Toolbars` to `Routing & Navigation`, `Event & College Cards`, `Supabase & Auth`, `Sidebar & Layout`, `Region & Global State`, `Stat Tiles & Pagination`, `UI Primitives`, `Form Controls`, `Context Menus`, `Table Components`, `Blog & Content`, `Student Dashboard`, `Quick Actions`, `Collapsible UI`, `Event Lifecycle`, `Pass System`, `QR Ticketing`, `Community 50`, `Community 51`, `Community 55`, `Community 56`, `Community 57`, `Community 59`, `Community 61`, `Community 62`, `Community 63`, `Community 64`, `Community 69`?**
  _High betweenness centrality (0.107) - this node is a cross-community bridge._
- **Why does `Button` connect `Routing & Navigation` to `Event & College Cards`, `Supabase & Auth`, `Sidebar & Layout`, `Admin Management`, `Region & Global State`, `Community 69`, `Stat Tiles & Pagination`, `UI Primitives`, `Menubar & Toolbars`, `Community 68`, `Form Controls`, `Command Palette`, `Blog & Content`, `Student Dashboard`, `Community 50`, `Community 54`, `Quick Actions`, `Community 61`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Why does `supabase` connect `Routing & Navigation` to `Event & College Cards`, `Supabase & Auth`, `Sidebar & Layout`, `Admin Management`, `Stat Tiles & Pagination`, `UI Primitives`, `Menubar & Toolbars`, `Command Palette`, `Blog & Content`, `Quick Actions`, `Community 50`, `Community 51`, `Community 54`, `Community 61`, `Community 66`, `Community 67`, `Community 69`, `Community 72`, `Community 78`, `Community 86`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **What connects `supabase`, `content`, `existingSlugs` to the rest of the system?**
  _694 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Routing & Navigation` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `Forms & User Interface` be split into smaller, more focused modules?**
  _Cohesion score 0.01 - nodes in this community are weakly interconnected._
- **Should `Event & College Cards` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._