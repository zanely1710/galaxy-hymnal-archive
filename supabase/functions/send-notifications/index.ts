import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationRequest {
  type: 'promotional' | 'new_song';
  songData?: {
    title: string;
    composer: string;
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { type, songData }: NotificationRequest = await req.json();

    // Get all user profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id');

    if (profilesError) {
      throw profilesError;
    }

    let title = '';
    let message = '';

    if (type === 'promotional') {
      // Random promotional messages
      const promos = [
        {
          title: 'Join Our Community!',
          message: 'Join our Discord and follow us on TikTok for the latest updates and music discussions! 🎵',
        },
        {
          title: 'Stay Connected',
          message: 'Connect with fellow music lovers on Discord and TikTok. Join our growing community today!',
        },
        {
          title: 'Discover More',
          message: 'Follow us on TikTok and join our Discord to discover new sacred music and connect with others!',
        },
      ];
      const randomPromo = promos[Math.floor(Math.random() * promos.length)];
      title = randomPromo.title;
      message = randomPromo.message;
    } else if (type === 'new_song' && songData) {
      title = 'New Music Sheet Available!';
      message = `Check out "${songData.title}" by ${songData.composer || 'Unknown'}. Available now in the archive!`;
    }

    // Create notifications for all users
    const notifications = profiles.map((profile) => ({
      user_id: profile.id,
      title,
      message,
      read: false,
    }));

    const { error: insertError } = await supabase
      .from('notifications')
      .insert(notifications);

    if (insertError) {
      throw insertError;
    }

    console.log(`Sent ${type} notifications to ${profiles.length} users`);

    return new Response(
      JSON.stringify({ success: true, count: profiles.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error sending notifications:', error);
    return new Response(
      JSON.stringify({ error: String(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
