-- ============================================================
-- Memories Feature: AI Face-Recognition Photo Delivery
-- ============================================================

-- 1. event_memory_photos — organizer-uploaded event photos
CREATE TABLE IF NOT EXISTS public.event_memory_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  uploaded_by uuid NOT NULL,
  storage_path text NOT NULL,
  file_url text NOT NULL,
  file_name text,
  file_size_bytes bigint DEFAULT 0,
  width int,
  height int,
  face_descriptors jsonb DEFAULT '[]'::jsonb,
  faces_processed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_event_memory_photos_event_id ON public.event_memory_photos(event_id);
CREATE INDEX idx_event_memory_photos_uploaded_by ON public.event_memory_photos(uploaded_by);

-- 2. face_scan_requests — student face scan sessions per event
CREATE TABLE IF NOT EXISTS public.face_scan_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  face_descriptor jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'processing'
    CHECK (status IN ('processing', 'completed', 'no_matches', 'error')),
  matched_photo_ids uuid[] DEFAULT '{}',
  error_message text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (user_id, event_id)
);

CREATE INDEX idx_face_scan_requests_user_id ON public.face_scan_requests(user_id);
CREATE INDEX idx_face_scan_requests_event_id ON public.face_scan_requests(event_id);

-- 3. Storage bucket for event memory photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'event-memories',
  'event-memories',
  true,
  10485760,  -- 10MB per file
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic']
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- RLS Policies
-- ============================================================

ALTER TABLE public.event_memory_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.face_scan_requests ENABLE ROW LEVEL SECURITY;

-- event_memory_photos: organizers can manage photos for their events
CREATE POLICY "organizer_insert_memory_photos"
  ON public.event_memory_photos FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.events e
      WHERE e.id = event_id
        AND (e.organizer_user_id = auth.uid()
             OR EXISTS (
               SELECT 1 FROM public.college_members cm
               WHERE cm.college_id = e.college_id
                 AND cm.user_id = auth.uid()
                 AND cm.is_approved = true
                 AND cm.role IN ('admin', 'coordinator')
             ))
    )
  );

CREATE POLICY "organizer_select_memory_photos"
  ON public.event_memory_photos FOR SELECT
  TO authenticated
  USING (
    -- Organizer / team can see all photos
    EXISTS (
      SELECT 1 FROM public.events e
      WHERE e.id = event_id
        AND (e.organizer_user_id = auth.uid()
             OR EXISTS (
               SELECT 1 FROM public.college_members cm
               WHERE cm.college_id = e.college_id
                 AND cm.user_id = auth.uid()
                 AND cm.is_approved = true
             ))
    )
    OR
    -- Students with tickets can see photos for completed events
    EXISTS (
      SELECT 1 FROM public.events e
      JOIN public.tickets t ON t.event_id = e.id AND t.user_id = auth.uid()
      WHERE e.id = event_id
        AND e.status = 'completed'
    )
  );

CREATE POLICY "organizer_delete_memory_photos"
  ON public.event_memory_photos FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.events e
      WHERE e.id = event_id
        AND (e.organizer_user_id = auth.uid()
             OR EXISTS (
               SELECT 1 FROM public.college_members cm
               WHERE cm.college_id = e.college_id
                 AND cm.user_id = auth.uid()
                 AND cm.is_approved = true
                 AND cm.role IN ('admin', 'coordinator')
             ))
    )
  );

-- face_scan_requests: students manage their own scans only
CREATE POLICY "student_insert_face_scan"
  ON public.face_scan_requests FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "student_select_own_face_scan"
  ON public.face_scan_requests FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "student_update_own_face_scan"
  ON public.face_scan_requests FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "student_delete_own_face_scan"
  ON public.face_scan_requests FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Storage policies for event-memories bucket
CREATE POLICY "authenticated_upload_event_memories"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'event-memories');

CREATE POLICY "public_read_event_memories"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'event-memories');

CREATE POLICY "owner_delete_event_memories"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'event-memories' AND (storage.foldername(name))[1] = auth.uid()::text);
