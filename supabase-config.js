// Connection details for the natan-site Supabase project.
// The publishable key is safe in client code: it grants only what the
// row-level security policies allow, which is read access to published
// rows. Every write is gated on membership in the `admins` table.
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

export const SUPABASE_URL = "https://fhjkbgbmwbzqxdxwfywi.supabase.co";
export const SUPABASE_KEY = "sb_publishable_b_ZQQr5xsmAUBV44aUV4pA_vMwG6yfF";
export const MEDIA_BUCKET = "media";

/* One client for the whole public site.

   Every block that needed to read a table used to call createClient()
   for itself — nine of them on the home page alone. Each one builds its
   own auth client on the SAME localStorage key, which is what the
   "Multiple GoTrueClient instances detected" warning in the console is
   about: they can race each other over that key. Nothing was broken,
   but nine token refreshers where one will do is nine chances for the
   undefined behaviour the warning is describing.

   The admin panel deliberately keeps its own client — it signs a user
   in, and that session must not be shared with the public pages. */
export const sb = createClient(SUPABASE_URL, SUPABASE_KEY);
