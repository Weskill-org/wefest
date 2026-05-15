-- Enable REPLICA IDENTITY FULL for sponsorship_proposals to allow real-time filtering on event_id
ALTER TABLE public.sponsorship_proposals REPLICA IDENTITY FULL;

-- Re-ensure sponsorship_proposals is in the realtime publication
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND tablename = 'sponsorship_proposals'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE sponsorship_proposals;
  END IF;
END $$;
