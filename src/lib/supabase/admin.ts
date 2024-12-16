import { createClient } from "@supabase/supabase-js";
import { env } from "@/env";
const supabaseUrl = "https://vihoxbserssgqmwcemla.supabase.co";
const supabaseKey = env.SUPABASE_KEY;
export const supabase = createClient(
  supabaseUrl,
  supabaseKey,
);
