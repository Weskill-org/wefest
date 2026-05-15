-- Enable realtime for recent_activity if not already enabled
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'recent_activity'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE recent_activity;
  END IF;
END $$;
