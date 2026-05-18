-- Migration: 20260518000000_portal_alerts_triggers.sql
-- Add triggers for Company and Organizer notifications

-- 1. Notify Organizer when a Sponsorship Proposal is created
CREATE OR REPLACE FUNCTION public.notify_organizer_on_proposal()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_organizer_id uuid;
  v_event_title text;
  v_company_name text;
BEGIN
  -- Get the event details and organizer
  SELECT organizer_user_id, title INTO v_organizer_id, v_event_title
  FROM public.events
  WHERE id = NEW.event_id;

  -- Get the company name
  SELECT company_name INTO v_company_name
  FROM public.company_profiles
  WHERE user_id = NEW.company_user_id;

  IF v_company_name IS NULL THEN
    v_company_name := 'A sponsor company';
  END IF;

  -- Insert notification for the organizer
  IF v_organizer_id IS NOT NULL THEN
    INSERT INTO public.notification_logs (
      user_id,
      title,
      body,
      type,
      metadata
    ) VALUES (
      v_organizer_id,
      'New Sponsorship Proposal',
      v_company_name || ' has submitted a proposal for ' || v_event_title,
      'system',
      jsonb_build_object(
        'event_id', NEW.event_id,
        'proposal_id', NEW.id,
        'company_id', NEW.company_user_id
      )
    );
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_notify_organizer_on_proposal ON public.sponsorship_proposals;
CREATE TRIGGER trigger_notify_organizer_on_proposal
  AFTER INSERT ON public.sponsorship_proposals
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_organizer_on_proposal();


-- 2. Notify Company when their Sponsorship Proposal is accepted
CREATE OR REPLACE FUNCTION public.notify_company_on_proposal_accept()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_event_title text;
BEGIN
  -- Only trigger if status changed to approved/accepted
  IF NEW.status IN ('approved', 'accepted') AND OLD.status NOT IN ('approved', 'accepted') THEN
    
    -- Get the event title
    SELECT title INTO v_event_title
    FROM public.events
    WHERE id = NEW.event_id;

    -- Insert notification for the company
    INSERT INTO public.notification_logs (
      user_id,
      title,
      body,
      type,
      metadata
    ) VALUES (
      NEW.company_user_id,
      'Proposal Accepted! 🎉',
      'Your sponsorship proposal for ' || v_event_title || ' has been accepted by the organizer.',
      'system',
      jsonb_build_object(
        'event_id', NEW.event_id,
        'proposal_id', NEW.id
      )
    );
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_notify_company_on_proposal_accept ON public.sponsorship_proposals;
CREATE TRIGGER trigger_notify_company_on_proposal_accept
  AFTER UPDATE OF status ON public.sponsorship_proposals
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_company_on_proposal_accept();


-- 3. Notify all companies when a new Event (Fest) is posted
CREATE OR REPLACE FUNCTION public.notify_companies_on_new_event()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  company_rec RECORD;
BEGIN
  -- Loop through all verified companies (or all companies if status doesn't matter)
  FOR company_rec IN 
    SELECT user_id FROM public.company_profiles WHERE status = 'approved'
  LOOP
    -- Insert notification for each company
    INSERT INTO public.notification_logs (
      user_id,
      title,
      body,
      type,
      metadata
    ) VALUES (
      company_rec.user_id,
      'New Fest Alert: ' || NEW.title,
      NEW.college_name || ' just posted a new fest. View details to submit a sponsorship proposal.',
      'event',
      jsonb_build_object(
        'event_id', NEW.id,
        'college_id', NEW.college_id
      )
    );
  END LOOP;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_notify_companies_on_new_event ON public.events;
CREATE TRIGGER trigger_notify_companies_on_new_event
  AFTER INSERT ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_companies_on_new_event();
