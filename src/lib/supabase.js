import { createClient } from "@supabase/supabase-js";

// ─── SUPABASE ────────────────────────────────────────────────────────────────
export const supabase = createClient(
  "https://maoiguhrcvpxvmgztmqq.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hb2lndWhyY3ZweHZtZ3p0bXFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMzE0NTcsImV4cCI6MjA4OTkwNzQ1N30.Jz1JhnSaTo1z0XYnb4rzbpmG90ceawHx6APkT0gNGI8"
);
