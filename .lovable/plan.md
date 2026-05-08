## Goal
Replace remaining hardcoded/sample content across every page with live Supabase reads & writes, using existing tables (events, tickets, colleges, cities, products, orders, sponsorship_proposals, ambassador_applications, artist_profiles, broadcast_messages, admin_users, profiles, user_roles, etc.).

## Approach
For each route, use TanStack Query + `supabase` browser client for reads, and `useMutation` + `queryClient.invalidateQueries` for writes. Authenticated mutations rely on existing RLS. Show empty-states & loading skeletons when no rows exist (no fake fallback data).

## Route-by-route changes

### Public discovery
- `events.tsx` — query `events` (filter by category/city/search via URL search params). Remove any remaining mock arrays.
- `events.$eventId.tsx` — fetch single event by id; load related `sponsorship_proposals` count, `tickets` availability; "Buy ticket" inserts into `tickets` (auth required, generates code).
- `colleges.tsx` — query `colleges` + aggregate event count per college.
- `sponsors.tsx` — query `partner_brands` + featured `sponsorship_proposals`.
- `shop.tsx` — query `products`; "Buy" inserts into `orders`.
- `talent.tsx` — query `artist_profiles` + `artist_bookings`.
- `ambassadors.tsx` — query `ambassador_programs`; submit form -> insert `ambassador_applications`.
- `social.tsx` — query `digital_memories` / `testimonials`; follow action -> insert `follows`.

### Auth-scoped
- `tickets.tsx` — already queries; ensure it joins event details and shows QR/code from row.
- `organizer.tsx` — list events where `organizer_user_id = auth.uid()`, with live ticket-sale counts.
- `organizer.new.tsx` — insert into `events` with `organizer_user_id = auth.uid()`.
- `organizer.events.$eventId.tsx` — edit/delete event, list `tickets`, `event_expenses`, `event_budgets`, `volunteers`.
- `organizer.scan.tsx` — replace prefix check with a real lookup against `tickets.code`; mark scanned (insert into `sponsor_booth_visits` or add a `scanned_at` column — use existing `sponsor_booth_visits` pattern, otherwise just verify existence).
- `sponsor.dashboard.tsx` — query `sponsorship_proposals` for current company user + `sponsor_booth_visits` stats.
- `sponsor.pricing.tsx` — wire "Request tier" CTA to insert a `sponsorship_proposals` row (requires event picker from live events list).
- `sponsor.scan.tsx` — same scanning flow against booth visits.

### Admin
- `admin.tsx` / `admin/index.tsx` — aggregate counts from `events`, `tickets`, `orders`, `profiles`.
- `admin.analytics.tsx` — read `institutional_analytics` + derived counts.
- `admin.cities.tsx` — already wired; add insert/edit modal backed by `cities` table.
- `admin.integrations.tsx` — read `webhooks` + `university_api_keys`; toggle + create rows.
- `admin/users.tsx` — list `profiles` + `user_roles`; role assign via `user_roles` insert/delete.
- `admin/events.tsx` — list all events with org/college; admin actions update `events`.
- `admin/broadcasts.tsx` — list & create `broadcast_messages`.

### Schema gaps (one small migration)
- Add `tickets.scanned_at timestamptz` and policy "organizer can update tickets for own events" so the gate scanner can mark them used.
- Add `events.cover_url text` (optional) only if needed; otherwise reuse existing `cover` column.

No other schema changes required — all referenced tables already exist.

## Technical notes
- Use `supabase.from('events').select('*, colleges(name,city)')` style joins where helpful.
- Show `Loader2` spinner while `isLoading`; show empty-state component when `data?.length === 0`.
- Mutations call `toast` from `sonner` for success/error.
- Delete `src/lib/mock.ts` only after every consumer is migrated; otherwise keep it temporarily but unused.
- All protected pages stay on the existing `/_authenticated` pattern (or guard with a `beforeLoad` redirect to `/login` if missing).