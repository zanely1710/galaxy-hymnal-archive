-- Create table to track event downloads per user
CREATE TABLE IF NOT EXISTS public.event_downloads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  music_sheet_id UUID NOT NULL REFERENCES public.music_sheets(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES public.music_events(id) ON DELETE CASCADE,
  downloaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, music_sheet_id, event_id)
);

-- Enable RLS
ALTER TABLE public.event_downloads ENABLE ROW LEVEL SECURITY;

-- Users can view their own downloads
CREATE POLICY "Users can view own downloads"
ON public.event_downloads
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own downloads (handled by edge function)
CREATE POLICY "Users can insert own downloads"
ON public.event_downloads
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Admins can view all downloads
CREATE POLICY "Admins can view all downloads"
ON public.event_downloads
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for faster lookups
CREATE INDEX idx_event_downloads_user_sheet ON public.event_downloads(user_id, music_sheet_id);