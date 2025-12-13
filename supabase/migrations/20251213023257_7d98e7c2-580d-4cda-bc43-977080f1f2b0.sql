-- Add image_url column to chat_messages
ALTER TABLE public.chat_messages 
ADD COLUMN image_url TEXT;

-- Create chat-images storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('chat-images', 'chat-images', true);

-- RLS policies for storage
CREATE POLICY "Users can upload chat images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'chat-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Anyone can view chat images"
ON storage.objects FOR SELECT
USING (bucket_id = 'chat-images');

CREATE POLICY "Users can delete own chat images"
ON storage.objects FOR DELETE
USING (bucket_id = 'chat-images' AND auth.uid()::text = (storage.foldername(name))[1]);