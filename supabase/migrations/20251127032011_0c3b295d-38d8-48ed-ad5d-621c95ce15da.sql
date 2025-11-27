-- Song Request System: Add status tracking and admin notes
ALTER TABLE song_requests 
ADD COLUMN status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
ADD COLUMN admin_notes text,
ADD COLUMN updated_at timestamp with time zone DEFAULT now();

-- User Profiles: Add profile picture and appearance settings
ALTER TABLE profiles
ADD COLUMN profile_picture_url text,
ADD COLUMN appearance_mode text DEFAULT 'light' CHECK (appearance_mode IN ('light', 'dark'));

-- Favorites/Bookmarks System
CREATE TABLE favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  music_sheet_id uuid NOT NULL REFERENCES music_sheets(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, music_sheet_id)
);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own favorites"
  ON favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own favorites"
  ON favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
  ON favorites FOR DELETE
  USING (auth.uid() = user_id);

-- Music Sheets: Add searchable fields and difficulty
ALTER TABLE music_sheets
ADD COLUMN difficulty text CHECK (difficulty IN ('easy', 'intermediate', 'advanced')),
ADD COLUMN arranger text;

-- Activity Log (Admin only)
CREATE TABLE activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  details jsonb,
  ip_address text,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view activity log"
  ON activity_log FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Music Sheet Versioning
ALTER TABLE music_sheets
ADD COLUMN version_number integer DEFAULT 1,
ADD COLUMN parent_id uuid REFERENCES music_sheets(id) ON DELETE CASCADE,
ADD COLUMN is_latest boolean DEFAULT true;

-- Events System for Limited-Time Music Sheets
CREATE TABLE music_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  start_date timestamp with time zone NOT NULL,
  end_date timestamp with time zone NOT NULL,
  stock_limit integer,
  stock_remaining integer,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE music_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view events"
  ON music_events FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage events"
  ON music_events FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

ALTER TABLE music_sheets
ADD COLUMN event_id uuid REFERENCES music_events(id) ON DELETE SET NULL;

-- Comments System
CREATE TABLE music_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  music_sheet_id uuid NOT NULL REFERENCES music_sheets(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  comment text NOT NULL,
  is_moderated boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE music_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view approved comments"
  ON music_comments FOR SELECT
  USING (is_moderated = true OR auth.uid() = user_id);

CREATE POLICY "Users can create comments"
  ON music_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments"
  ON music_comments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can moderate all comments"
  ON music_comments FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Update trigger for song_requests updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_song_requests_updated_at
  BEFORE UPDATE ON song_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();