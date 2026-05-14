-- Create Brand Assets Table
CREATE TABLE public.brand_assets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID NOT NULL REFERENCES public.company_profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- e.g., 'logo', 'banner', 'poster', 'merchandise'
    file_url TEXT NOT NULL,
    status TEXT DEFAULT 'approved',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Brand Guidelines Table
CREATE TABLE public.brand_guidelines (
    company_id UUID PRIMARY KEY REFERENCES public.company_profiles(id) ON DELETE CASCADE,
    colors JSONB DEFAULT '{}'::jsonb, -- e.g., {"primary": "#ff0000", "secondary": "#00ff00"}
    instructions TEXT,
    typography TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Shared Assets Table
CREATE TABLE public.shared_assets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    asset_id UUID NOT NULL REFERENCES public.brand_assets(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    permissions TEXT DEFAULT 'view',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Policies for brand_assets
ALTER TABLE public.brand_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Companies can manage their own assets"
ON public.brand_assets FOR ALL TO authenticated
USING (company_id IN (SELECT id FROM public.company_profiles WHERE user_id = auth.uid()))
WITH CHECK (company_id IN (SELECT id FROM public.company_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Organizers can view shared assets"
ON public.brand_assets FOR SELECT TO authenticated
USING (
    id IN (
        SELECT asset_id FROM public.shared_assets sa
        JOIN public.events e ON sa.event_id = e.id
        WHERE e.organizer_user_id = auth.uid() OR e.college_id IN (
            SELECT college_id FROM public.college_members WHERE user_id = auth.uid() AND is_approved = true
        )
    )
);

-- RLS Policies for brand_guidelines
ALTER TABLE public.brand_guidelines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Companies can manage their own guidelines"
ON public.brand_guidelines FOR ALL TO authenticated
USING (company_id IN (SELECT id FROM public.company_profiles WHERE user_id = auth.uid()))
WITH CHECK (company_id IN (SELECT id FROM public.company_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Organizers can view guidelines of companies with shared assets"
ON public.brand_guidelines FOR SELECT TO authenticated
USING (
    company_id IN (
        SELECT ba.company_id FROM public.brand_assets ba
        JOIN public.shared_assets sa ON ba.id = sa.asset_id
        JOIN public.events e ON sa.event_id = e.id
        WHERE e.organizer_user_id = auth.uid() OR e.college_id IN (
            SELECT college_id FROM public.college_members WHERE user_id = auth.uid() AND is_approved = true
        )
    )
);

-- RLS Policies for shared_assets
ALTER TABLE public.shared_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Companies can manage their shared assets"
ON public.shared_assets FOR ALL TO authenticated
USING (
    asset_id IN (
        SELECT id FROM public.brand_assets WHERE company_id IN (
            SELECT id FROM public.company_profiles WHERE user_id = auth.uid()
        )
    )
)
WITH CHECK (
    asset_id IN (
        SELECT id FROM public.brand_assets WHERE company_id IN (
            SELECT id FROM public.company_profiles WHERE user_id = auth.uid()
        )
    )
);

CREATE POLICY "Organizers can view their shared assets"
ON public.shared_assets FOR SELECT TO authenticated
USING (
    event_id IN (
        SELECT id FROM public.events WHERE organizer_user_id = auth.uid() OR college_id IN (
            SELECT college_id FROM public.college_members WHERE user_id = auth.uid() AND is_approved = true
        )
    )
);

-- Triggers for updated_at
CREATE TRIGGER handle_updated_at_brand_guidelines
    BEFORE UPDATE ON public.brand_guidelines
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
