-- ============================================================================
-- Two-Word Event Slug System
-- Events get addressable URLs like "cosmic.summit" instead of UUIDs
-- ============================================================================

-- 1. Add slug column to events
ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS slug TEXT;

-- 2. Create a unique index for fast slug lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_events_slug_unique ON public.events (slug) WHERE slug IS NOT NULL;

-- 3. Add a check constraint: slug must be two lowercase words separated by a dot
ALTER TABLE public.events
  ADD CONSTRAINT chk_events_slug_format CHECK (
    slug IS NULL OR slug ~ '^[a-z]{2,}\.[a-z]{2,}$'
  );

-- 4. Word pool function for generating random slugs
CREATE OR REPLACE FUNCTION public.generate_event_slug()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  adjectives TEXT[] := ARRAY[
    'vibrant','cosmic','golden','electric','midnight','neon','blazing',
    'crystal','stellar','infinite','phantom','radiant','sonic','lunar',
    'solar','atomic','velvet','crimson','sapphire','emerald','amber',
    'silver','azure','scarlet','ivory','jade','ruby','coral','indigo',
    'violet','turquoise','magenta','copper','bronze','arctic','tropical',
    'mystic','primal','wild','fierce','bold','swift','rapid','brave',
    'noble','grand','royal','epic','supreme','prime','ultra','mega',
    'hyper','mighty','vivid','bright','dazzle','flash','flame','blaze',
    'storm','frost','ocean','desert','forest','urban','metro','retro',
    'future','ancient','modern','classic','digital','cyber','quantum',
    'astral','chrome','pixel','prism','dynamic','kinetic','harmonic',
    'melodic','rhythmic','acoustic','lucid','serene','chaotic','rogue',
    'rebel','shadow','roaring','booming','soaring','rising','rolling',
    'pulsing','glowing','shining','burning','frozen','molten','deep',
    'vast','free','pure','rare','raw','live','fresh','sharp','keen',
    'crisp','clear','loud','fast','cool','warm','dark','rich','calm',
    'lush','teal','aqua'
  ];
  nouns TEXT[] := ARRAY[
    'summit','aurora','festival','horizon','phoenix','rhythm','spark',
    'echo','wave','pulse','vortex','cascade','nexus','ember','zenith',
    'orbit','prism','atlas','titan','forge','reign','realm','arena',
    'stage','encore','anthem','chorus','verse','melody','harmony',
    'tempo','beat','groove','flow','drift','rush','surge','blast',
    'boom','roar','flash','flame','glow','shine','storm','frost',
    'blaze','comet','meteor','nebula','galaxy','cosmos','eclipse',
    'solstice','dawn','dusk','twilight','voyage','quest','odyssey',
    'journey','safari','venture','trail','rally','parade','sprint',
    'marathon','carnival','circus','fiesta','gala','jubilee','bash',
    'rave','concert','showcase','spectacle','bonanza','legend','saga',
    'chronicle','fable','ballad','opus','canvas','mosaic','tapestry',
    'crown','throne','shield','banner','crest','falcon','hawk','eagle',
    'raven','wolf','lion','tiger','panther','dragon','griffin','citadel',
    'bastion','fortress','tower','bridge','gateway','portal','lantern',
    'beacon','torch','flare','compass','anchor','crystal','diamond',
    'pearl','opal','onyx','topaz','quartz','cobalt','platinum','titanium'
  ];
  candidate TEXT;
  attempts INT := 0;
BEGIN
  LOOP
    candidate := adjectives[1 + floor(random() * array_length(adjectives, 1))]
                 || '.'
                 || nouns[1 + floor(random() * array_length(nouns, 1))];
    -- Check uniqueness
    IF NOT EXISTS (SELECT 1 FROM public.events WHERE slug = candidate) THEN
      RETURN candidate;
    END IF;
    attempts := attempts + 1;
    IF attempts > 100 THEN
      -- Fallback: append random chars
      RETURN candidate || floor(random() * 1000)::text;
    END IF;
  END LOOP;
END;
$$;

-- 5. Backfill existing events with auto-generated slugs
DO $$
DECLARE
  evt RECORD;
  new_slug TEXT;
BEGIN
  FOR evt IN SELECT id FROM public.events WHERE slug IS NULL
  LOOP
    new_slug := public.generate_event_slug();
    UPDATE public.events SET slug = new_slug WHERE id = evt.id;
  END LOOP;
END;
$$;

-- 6. Make slug NOT NULL now that all rows have values
ALTER TABLE public.events ALTER COLUMN slug SET NOT NULL;

-- 7. Default for new rows: auto-generate if not provided
ALTER TABLE public.events ALTER COLUMN slug SET DEFAULT public.generate_event_slug();

-- 8. Trigger to auto-set slug on insert if empty/null
CREATE OR REPLACE FUNCTION public.set_event_slug()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := public.generate_event_slug();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_event_slug_auto
  BEFORE INSERT ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.set_event_slug();
