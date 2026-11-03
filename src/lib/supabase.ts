import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mxfaoztqfbhzjcpzkfjf.supabase.co";
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "sb_publishable_rVWrCbSnKm7BP_b2tCTQAg_4_N0yn9f";

export const supabase = createClient(supabaseUrl, supabaseKey);

