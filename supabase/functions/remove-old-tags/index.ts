import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Calculate date 1 week ago
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    console.log('Checking for sheets older than:', oneWeekAgo.toISOString());

    // This function runs periodically to track "old" sheets
    // The "NEW" badge is displayed in the frontend based on created_at being less than 7 days old
    // This function just logs for monitoring purposes
    const { data: oldSheets, error } = await supabase
      .from('music_sheets')
      .select('id, title, created_at')
      .lt('created_at', oneWeekAgo.toISOString());

    if (error) {
      throw error;
    }

    console.log(`Found ${oldSheets?.length || 0} sheets older than 1 week`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Checked ${oldSheets?.length || 0} old sheets`,
        count: oldSheets?.length || 0
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error checking old sheets:', error);
    return new Response(
      JSON.stringify({ error: String(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
