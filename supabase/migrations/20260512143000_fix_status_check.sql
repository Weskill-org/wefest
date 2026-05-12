-- Unified migration to fix the event status check constraint collision
-- This drops the old admin-only constraint and replaces it with one that supports both organizer and admin flows.

-- 1. Drop the existing constraint if it exists (it might have the name events_status_check from phase4_admin)
DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'events_status_check') THEN
        ALTER TABLE public.events DROP CONSTRAINT events_status_check;
    END IF;
END $$;

-- 2. Ensure the status column exists and has the correct default
-- (Using 'draft' as default for new events created by organizers)
ALTER TABLE public.events 
  ALTER COLUMN status SET DEFAULT 'draft',
  ALTER COLUMN status SET NOT NULL;

-- 3. Add the expanded check constraint to cover all current and future use cases:
-- Organizer flow: draft, published, archived, cancelled
-- Admin flow: pending, approved, rejected, locked
ALTER TABLE public.events 
ADD CONSTRAINT events_status_check 
CHECK (status IN (
  'draft', 'published', 'archived', 'cancelled', 
  'pending', 'approved', 'rejected', 'locked'
));

-- 4. Clean up any existing data that might be out of sync (optional but safe)
-- If status is null, set to draft
UPDATE public.events SET status = 'draft' WHERE status IS NULL;
