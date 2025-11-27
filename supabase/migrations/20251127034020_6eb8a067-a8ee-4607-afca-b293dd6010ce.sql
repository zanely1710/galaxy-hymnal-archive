-- Add recently viewed tracking
CREATE TABLE IF NOT EXISTS public.recently_viewed (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  music_sheet_id UUID NOT NULL REFERENCES public.music_sheets(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, music_sheet_id)
);

ALTER TABLE public.recently_viewed ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own history"
ON public.recently_viewed FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own history"
ON public.recently_viewed FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own history"
ON public.recently_viewed FOR UPDATE
USING (auth.uid() = user_id);