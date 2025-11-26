import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_PUBLISHABLE_KEY");
    
    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase credentials:", { 
        hasUrl: !!supabaseUrl, 
        hasKey: !!supabaseKey 
      });
      throw new Error("Supabase configuration missing");
    }

    const supabaseClient = createClient(
      supabaseUrl,
      supabaseKey,
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // Get the authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      throw new Error("Unauthorized");
    }

    console.log("Generating reflection for user:", user.id);

    // Generate a unique reflection using Lovable AI
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not configured");
      throw new Error("LOVABLE_API_KEY not configured");
    }

    console.log("Calling Lovable AI Gateway...");
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are a warm, caring Catholic priest writing short spiritual reflections for Filipino devotees. 
Your style is inspired by "Kape't Pandesal" - warm, reflective, and uplifting.
Write reflections that are:
- Short (2-3 sentences, max 100 words)
- In English but with Filipino devotional warmth
- Focused on faith, hope, love, peace, or daily blessings
- Comforting and encouraging
- Personal and relatable
Each reflection must be completely unique and original. Never repeat themes or phrases from previous reflections.`,
          },
          {
            role: "user",
            content: "Generate a unique spiritual reflection for today.",
          },
        ],
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to continue." }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      const errorText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errorText);
      throw new Error("Failed to generate reflection");
    }

    const aiData = await aiResponse.json();
    const reflectionContent = aiData.choices[0].message.content;

    console.log("Generated reflection:", reflectionContent);

    // Store the reflection
    const { data: newReflection, error: reflectionError } = await supabaseClient
      .from("reflections")
      .insert({ content: reflectionContent })
      .select()
      .single();

    if (reflectionError) {
      console.error("Error storing reflection:", reflectionError);
      throw reflectionError;
    }

    // Mark this reflection as viewed by the user
    const { error: trackError } = await supabaseClient
      .from("user_reflections")
      .insert({
        user_id: user.id,
        reflection_id: newReflection.id,
      });

    if (trackError) {
      console.error("Error tracking reflection:", trackError);
      // Non-critical error, continue anyway
    }

    return new Response(JSON.stringify({ reflection: reflectionContent }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-reflection:", error);
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace");
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error occurred",
        details: error instanceof Error ? error.stack : undefined
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});