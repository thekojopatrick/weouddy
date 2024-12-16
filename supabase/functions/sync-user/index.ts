// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import { createClient } from "npm:@supabase/supabase-js@2.47.8";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

Deno.serve(async (req) => {
  try {
    const payload = await req.json();
    const event = payload.type;
    const record = payload.record;

    // Only proceed if this is a new user signup
    if (event === "INSERT" && record?.id) {
      // Create a new user record in your users table
      const { error: userError } = await supabase
        .from("User")
        .insert([
          {
            id: record.id,
            email: record.email,
            name: record.raw_user_meta_data?.full_name || null,
            avatarUrl: record.raw_user_meta_data?.avatar_url || null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (userError) {
        console.error("User sync failed:", userError);
        throw userError;
      }

      return new Response(
        JSON.stringify({ message: "User synchronized successfully" }),
        {
          headers: { "Content-Type": "application/json" },
          status: 200,
        },
      );
    }

    return new Response(
      JSON.stringify({ message: "Not a user insert event" }),
      {
        headers: { "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }
});
