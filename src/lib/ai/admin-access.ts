import { createClient } from "@/lib/supabase/server";

export async function isAdminRequest() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return Boolean(user && user.app_metadata?.role === "admin");
}
