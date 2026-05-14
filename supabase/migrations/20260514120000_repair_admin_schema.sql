
-- This migration ensures that the admin_users and broadcast_messages tables exist 
-- and have the correct structure, to fix 500 errors caused by broken RLS policies.

DO $$ 
BEGIN
    -- Create admin_users if missing
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'admin_users') THEN
        CREATE TABLE public.admin_users (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
          created_at timestamptz NOT NULL DEFAULT now()
        );
        ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
        CREATE POLICY "admin_users read" ON public.admin_users FOR SELECT TO authenticated USING (true);
    END IF;

    -- Ensure 'rank' column exists in admin_users (from later migrations)
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'admin_users' AND column_name = 'rank') THEN
        -- Create rank enum if missing
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'admin_rank') THEN
            CREATE TYPE public.admin_rank AS ENUM ('Moderator', 'Admin', 'Superadmin');
        END IF;
        ALTER TABLE public.admin_users ADD COLUMN rank public.admin_rank NOT NULL DEFAULT 'Moderator';
    END IF;

    -- Create broadcast_messages if missing
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'broadcast_messages') THEN
        CREATE TABLE public.broadcast_messages (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          message text NOT NULL,
          severity text NOT NULL DEFAULT 'info',
          active boolean NOT NULL DEFAULT true,
          created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
          created_at timestamptz NOT NULL DEFAULT now()
        );
        ALTER TABLE public.broadcast_messages ENABLE ROW LEVEL SECURITY;
        
        -- Policies
        CREATE POLICY "anyone can read active broadcasts" ON public.broadcast_messages FOR SELECT USING (active = true);
        CREATE POLICY "admins can read all broadcasts" ON public.broadcast_messages FOR SELECT TO authenticated
          USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));
        CREATE POLICY "admins can insert broadcasts" ON public.broadcast_messages FOR INSERT TO authenticated
          WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));
        CREATE POLICY "admins can update broadcasts" ON public.broadcast_messages FOR UPDATE TO authenticated
          USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));
    END IF;
END $$;
