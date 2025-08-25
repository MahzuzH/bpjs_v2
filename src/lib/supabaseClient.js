// src/lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const url = process.env.REACT_APP_SUPABASE_PROJ_URL;
const anon = process.env.REACT_APP_SUPABASE_PROJ_KEY;

// Bantuan debug aman (hanya log panjang key, bukan seluruhnya)
if (!url || !anon) {
    // Ini membuat error-nya jelas sejak awal
    throw new Error(
        "[supabaseClient] Missing env. Pastikan REACT_APP_SUPABASE_URL dan REACT_APP_SUPABASE_ANON_KEY terisi di .env (lalu restart dev server)."
    );
} else {
    // eslint-disable-next-line no-console
    console.log("[supabaseClient] URL OK:", url);
}

const supabase = createClient(url, anon, {
    auth: { persistSession: true, autoRefreshToken: true },
});

export default supabase;
