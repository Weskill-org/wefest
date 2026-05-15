-- Enable realtime for critical operational tables
DO $$
BEGIN
  -- sponsorship_proposals
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'sponsorship_proposals') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE sponsorship_proposals;
  END IF;

  -- volunteers
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'volunteers') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE volunteers;
  END IF;

  -- tickets
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'tickets') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE tickets;
  END IF;

  -- products & orders
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'products') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE products;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'orders') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE orders;
  END IF;

  -- ambassador
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'ambassador_programs') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE ambassador_programs;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'ambassador_applications') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE ambassador_applications;
  END IF;

  -- marketing
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'marketing_campaigns') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE marketing_campaigns;
  END IF;

  -- finance
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'event_budgets') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE event_budgets;
  END IF;
END $$;
