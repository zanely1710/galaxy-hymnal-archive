import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.84.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Create client with user's auth for permission checks
    const authClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    )

    // Create service role client for database operations
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get authenticated user
    const { data: { user }, error: userError } = await authClient.auth.getUser()
    if (userError || !user) {
      throw new Error('Unauthorized')
    }

    const { musicSheetId } = await req.json()

    if (!musicSheetId) {
      throw new Error('Music sheet ID is required')
    }

    // Fetch the music sheet with event info
    const { data: sheet, error: sheetError } = await supabaseClient
      .from('music_sheets')
      .select(`
        id,
        file_url,
        event_id,
        music_events!inner (
          id,
          start_date,
          end_date,
          stock_limit,
          stock_remaining
        )
      `)
      .eq('id', musicSheetId)
      .single()

    if (sheetError || !sheet) {
      throw new Error('Music sheet not found')
    }

    // Check if this is an event sheet
    if (sheet.event_id && sheet.music_events) {
      const event = Array.isArray(sheet.music_events) ? sheet.music_events[0] : sheet.music_events
      if (!event) {
        throw new Error('Event not found')
      }

      const now = new Date()
      const endDate = new Date(event.end_date)

      // Check if event is expired or out of stock
      if (now > endDate) {
        throw new Error('Event has ended')
      }

      if (event.stock_limit && event.stock_remaining !== null && event.stock_remaining <= 0) {
        throw new Error('Event is out of stock')
      }

      // Check if user already downloaded this event sheet
      const { data: existingDownload } = await supabaseClient
        .from('event_downloads')
        .select('id')
        .eq('user_id', user.id)
        .eq('music_sheet_id', musicSheetId)
        .eq('event_id', sheet.event_id)
        .maybeSingle()

      if (!existingDownload) {
        // User hasn't downloaded yet, decrement stock
        if (event.stock_limit) {
          const { error: decrementError } = await supabaseClient.rpc(
            'decrement_event_stock',
            { event_id: sheet.event_id }
          )

          if (decrementError) {
            console.error('Error decrementing stock:', decrementError)
            throw new Error('Failed to process download')
          }
        }

        // Record the download
        const { error: insertError } = await supabaseClient
          .from('event_downloads')
          .insert({
            user_id: user.id,
            music_sheet_id: musicSheetId,
            event_id: sheet.event_id,
          })

        if (insertError) {
          console.error('Error recording download:', insertError)
          // Stock was already decremented, but we'll let the download proceed
        }
      }
    }

    // Return the file URL
    return new Response(
      JSON.stringify({ 
        success: true, 
        fileUrl: sheet.file_url,
        message: sheet.event_id ? 'Download recorded' : 'Download ready'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error: unknown) {
    console.error('Error in download-event-sheet:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
