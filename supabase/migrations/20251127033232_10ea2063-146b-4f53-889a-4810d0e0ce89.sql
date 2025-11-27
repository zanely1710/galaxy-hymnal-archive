-- Enable realtime for music_comments table
ALTER TABLE public.music_comments REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.music_comments;