-- Backfill slugs for existing events that don't have one
-- This uses a simple adjective.noun generator logic in SQL if possible, 
-- or just a fallback to a unique string.

CREATE OR REPLACE FUNCTION generate_random_slug() RETURNS text AS $$
DECLARE
  adjectives text[] := ARRAY['cosmic', 'vibrant', 'mystic', 'golden', 'urban', 'neon', 'echo', 'delta', 'pulse', 'prime', 'stellar', 'sonic', 'wild', 'pure', 'lunar'];
  nouns text[] := ARRAY['summit', 'rhythm', 'oasis', 'fusion', 'pulse', 'nexus', 'wave', 'storm', 'peak', 'valley', 'sphere', 'bridge', 'trail', 'heart', 'spirit'];
  val text;
BEGIN
  LOOP
    val := adjectives[floor(random() * array_length(adjectives, 1) + 1)] || '.' || nouns[floor(random() * array_length(nouns, 1) + 1)];
    -- Check uniqueness
    IF NOT EXISTS (SELECT 1 FROM events WHERE slug = val) THEN
      RETURN val;
    END IF;
    -- If collision, try adding a random suffix
    val := val || floor(random() * 99 + 1)::text;
    IF NOT EXISTS (SELECT 1 FROM events WHERE slug = val) THEN
      RETURN val;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Update existing records
UPDATE events SET slug = generate_random_slug() WHERE slug IS NULL;

-- Ensure the column is now NOT NULL for future safety (if desired)
-- ALTER TABLE events ALTER COLUMN slug SET NOT NULL;
