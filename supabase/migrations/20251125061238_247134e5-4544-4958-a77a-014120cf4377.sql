-- Create table to store generated reflections
CREATE TABLE public.reflections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table to track which reflections users have seen
CREATE TABLE public.user_reflections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reflection_id UUID NOT NULL REFERENCES public.reflections(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, reflection_id)
);

-- Enable RLS on both tables
ALTER TABLE public.reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_reflections ENABLE ROW LEVEL SECURITY;

-- Reflections policies - all users can read
CREATE POLICY "Anyone can view reflections"
ON public.reflections
FOR SELECT
USING (true);

-- User reflections policies - users can only see their own
CREATE POLICY "Users can view own reflection history"
ON public.user_reflections
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reflection history"
ON public.user_reflections
FOR INSERT
WITH CHECK (auth.uid() = user_id);