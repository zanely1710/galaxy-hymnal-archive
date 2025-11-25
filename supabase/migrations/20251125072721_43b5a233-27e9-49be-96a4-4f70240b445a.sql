-- Create a function to check if user is a super admin (one of the two specific emails)
CREATE OR REPLACE FUNCTION public.is_super_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = _user_id
      AND (email = 'ejdelrosario.jhs@assumptaseminary.ph.education' 
           OR email = 'eleandrejohn503@gmail.com')
  )
$$;

-- Update role management policies to use super admin check
DROP POLICY IF EXISTS "Admins can insert roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can update roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can delete roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;

-- Only super admins can manage roles
CREATE POLICY "Super admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (is_super_admin(auth.uid()));

CREATE POLICY "Super admins can update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (is_super_admin(auth.uid()));

CREATE POLICY "Super admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (is_super_admin(auth.uid()));

CREATE POLICY "Super admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (is_super_admin(auth.uid()));

-- Create chat messages table
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Everyone can read chat messages
CREATE POLICY "Anyone authenticated can view messages"
ON public.chat_messages
FOR SELECT
TO authenticated
USING (true);

-- Users can insert their own messages
CREATE POLICY "Users can insert own messages"
ON public.chat_messages
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own messages
CREATE POLICY "Users can delete own messages"
ON public.chat_messages
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Enable realtime for chat messages
ALTER TABLE public.chat_messages REPLICA IDENTITY FULL;

-- Add chat messages to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;