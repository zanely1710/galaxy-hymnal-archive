-- Create function to check if event is active and has stock
CREATE OR REPLACE FUNCTION public.is_event_active(event_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    CASE 
      WHEN event_id IS NULL THEN true
      ELSE EXISTS (
        SELECT 1 FROM public.music_events
        WHERE id = event_id
        AND now() BETWEEN start_date AND end_date
        AND (stock_limit IS NULL OR stock_remaining > 0)
      )
    END
$$;

-- Create function to decrement event stock
CREATE OR REPLACE FUNCTION public.decrement_event_stock(event_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.music_events
  SET stock_remaining = stock_remaining - 1
  WHERE id = event_id
  AND stock_remaining > 0;
END;
$$;