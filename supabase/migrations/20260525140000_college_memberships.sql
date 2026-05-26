-- Migration: College Memberships and Fest Limits

-- 1. Create a function to check for expired subscriptions, downgrade them, and pause fests.
CREATE OR REPLACE FUNCTION public.check_and_downgrade_subscriptions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  expired_record RECORD;
BEGIN
  -- Find expired premium subscriptions
  FOR expired_record IN 
    SELECT user_id, id FROM public.subscriptions 
    WHERE plan_type != 'free' 
      AND current_period_end IS NOT NULL 
      AND current_period_end < now()
  LOOP
    -- Downgrade subscription
    UPDATE public.subscriptions 
    SET plan_type = 'free', current_period_end = NULL, status = 'active'
    WHERE id = expired_record.id;

    -- Pause their fests (update status to 'draft' where status = 'published')
    UPDATE public.events
    SET status = 'draft'
    WHERE organizer_user_id = expired_record.user_id 
      AND status = 'published';
  END LOOP;
END;
$$;

-- 2. Schedule the function using pg_cron (runs daily at midnight)
-- Wrapping in DO block to handle cases where pg_cron might not be available
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    PERFORM cron.schedule('check-subscriptions', '0 0 * * *', 'SELECT public.check_and_downgrade_subscriptions()');
  END IF;
END $$;
