import { createClient } from "@/lib/supabase/client";

export type AdminRole = "user" | "admin" | "moderator" | "editor";

export async function getCurrentUserRole(): Promise<AdminRole> {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return "user";
  }

  const role = (data.user.app_metadata?.role ?? "user") as AdminRole;
  return ["user", "admin", "moderator", "editor"].includes(role) ? role : "user";
}

export async function isAdminUser(): Promise<boolean> {
  return (await getCurrentUserRole()) === "admin";
}

export async function getAdminOverview() {
  return {
    totalUsers: 1284,
    activeSubscriptions: 842,
    premiumUsers: 412,
    adCampaigns: 9,
    aiJobs: 18,
    pendingReviews: 6
  };
}
