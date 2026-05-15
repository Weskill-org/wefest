-- Helper function to check if a user owns a company
CREATE OR REPLACE FUNCTION public.is_company_owner(p_company_id UUID, p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.company_profiles
        WHERE id = p_company_id AND user_id = p_user_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Helper function to check if an asset belongs to a company owned by the user
CREATE OR REPLACE FUNCTION public.check_is_asset_owner(p_asset_id UUID, p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.brand_assets ba
        JOIN public.company_profiles cp ON ba.company_id = cp.id
        WHERE ba.id = p_asset_id AND cp.user_id = p_user_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Helper function to check if an asset is shared with an event organized by the user
CREATE OR REPLACE FUNCTION public.is_asset_shared_with_user(p_asset_id UUID, p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.shared_assets sa
        JOIN public.events e ON sa.event_id = e.id
        WHERE sa.asset_id = p_asset_id AND (
            e.organizer_user_id = p_user_id OR
            EXISTS (
                SELECT 1 FROM public.college_members cm
                WHERE cm.college_id = e.college_id AND cm.user_id = p_user_id AND cm.is_approved = true
            )
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Drop existing recursive policies
DROP POLICY IF EXISTS "Companies can manage their own assets" ON public.brand_assets;
DROP POLICY IF EXISTS "Organizers can view shared assets" ON public.brand_assets;
DROP POLICY IF EXISTS "Companies can manage their own guidelines" ON public.brand_guidelines;
DROP POLICY IF EXISTS "Organizers can view guidelines of companies with shared assets" ON public.brand_guidelines;
DROP POLICY IF EXISTS "Companies can manage their shared assets" ON public.shared_assets;
DROP POLICY IF EXISTS "Organizers can view their shared assets" ON public.shared_assets;

-- Drop new policies if they exist (to make migration idempotent)
DROP POLICY IF EXISTS "brand_assets_owner_all" ON public.brand_assets;
DROP POLICY IF EXISTS "brand_assets_shared_view" ON public.brand_assets;
DROP POLICY IF EXISTS "brand_guidelines_owner_all" ON public.brand_guidelines;
DROP POLICY IF EXISTS "brand_guidelines_shared_view" ON public.brand_guidelines;
DROP POLICY IF EXISTS "shared_assets_owner_all" ON public.shared_assets;
DROP POLICY IF EXISTS "shared_assets_organizer_view" ON public.shared_assets;

-- New Policies for brand_assets
CREATE POLICY "brand_assets_owner_all"
ON public.brand_assets FOR ALL TO authenticated
USING (public.is_company_owner(company_id, auth.uid()))
WITH CHECK (public.is_company_owner(company_id, auth.uid()));

CREATE POLICY "brand_assets_shared_view"
ON public.brand_assets FOR SELECT TO authenticated
USING (public.is_asset_shared_with_user(id, auth.uid()));

-- New Policies for brand_guidelines
CREATE POLICY "brand_guidelines_owner_all"
ON public.brand_guidelines FOR ALL TO authenticated
USING (public.is_company_owner(company_id, auth.uid()))
WITH CHECK (public.is_company_owner(company_id, auth.uid()));

CREATE POLICY "brand_guidelines_shared_view"
ON public.brand_guidelines FOR SELECT TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.brand_assets ba
        WHERE ba.company_id = public.brand_guidelines.company_id
        AND public.is_asset_shared_with_user(ba.id, auth.uid())
    )
);

-- New Policies for shared_assets
CREATE POLICY "shared_assets_owner_all"
ON public.shared_assets FOR ALL TO authenticated
USING (public.check_is_asset_owner(asset_id, auth.uid()))
WITH CHECK (public.check_is_asset_owner(asset_id, auth.uid()));

CREATE POLICY "shared_assets_organizer_view"
ON public.shared_assets FOR SELECT TO authenticated
USING (
    event_id IN (
        SELECT id FROM public.events WHERE organizer_user_id = auth.uid() OR college_id IN (
            SELECT college_id FROM public.college_members WHERE user_id = auth.uid() AND is_approved = true
        )
    )
);
