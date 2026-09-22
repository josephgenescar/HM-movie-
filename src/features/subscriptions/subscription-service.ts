import { createClient } from "@/lib/supabase/client";

export type SubscriptionPlan = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  price_monthly: number;
  currency: string;
  is_active: boolean;
  features: string[];
};

export const fallbackPlans: SubscriptionPlan[] = [
  {
    id: "free-plan",
    code: "free",
    name: "Essentiel",
    description: "Pour découvrir HM(Movie)",
    price_monthly: 0,
    currency: "HTG",
    is_active: true,
    features: ["Catalogue de films et séries", "Qualité HD", "Avec publicité"]
  },
  {
    id: "premium-plan",
    code: "premium",
    name: "Premium",
    description: "Pour regarder sans limites",
    price_monthly: 1499,
    currency: "HTG",
    is_active: true,
    features: ["Catalogue complet", "Qualité 4K Ultra HD", "Sans publicité", "Téléchargements hors ligne"]
  }
];

function normalizePlan(row: any): SubscriptionPlan {
  return {
    id: row.id ?? row.code ?? crypto.randomUUID(),
    code: row.code ?? "custom",
    name: row.name ?? "Plan",
    description: row.description ?? null,
    price_monthly: Number(row.price_monthly ?? row.price ?? 0),
    currency: row.currency ?? "HTG",
    is_active: row.is_active ?? true,
    features: Array.isArray(row.features)
      ? row.features
      : typeof row.features === "string"
        ? JSON.parse(row.features)
        : []
  };
}

export async function getPlans(): Promise<SubscriptionPlan[]> {
  const supabase = createClient();

  try {
    const { data, error } = await (supabase as any)
      .from("plans")
      .select("*")
      .eq("is_active", true)
      .order("price_monthly", { ascending: true });

    if (error) {
      console.warn("Impossible de récupérer les plans Supabase:", error.message);
      return fallbackPlans;
    }

    if (!data || !Array.isArray(data) || data.length === 0) {
      return fallbackPlans;
    }

    return data.map(normalizePlan);
  } catch (error) {
    console.warn("Erreur lors du chargement des plans:", error);
    return fallbackPlans;
  }
}

export async function getPlanByCode(code: string): Promise<SubscriptionPlan | null> {
  const plans = await getPlans();
  return plans.find((plan) => plan.code === code) ?? null;
}

export async function getCurrentUserSubscription() {
  const supabase = createClient();

  try {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;

    if (!userId) {
      return null;
    }

    const { data, error } = await (supabase as any)
      .from("user_subscriptions")
      .select("*, plans(*)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.warn("Erreur sur l'abonnement utilisateur:", error.message);
      return null;
    }

    return data;
  } catch (error) {
    console.warn("Erreur abonnement utilisateur:", error);
    return null;
  }
}

export async function hasPremiumAccess(): Promise<boolean> {
  const subscription = await getCurrentUserSubscription();

  if (!subscription) {
    return false;
  }

  const status = subscription.status ?? "";
  const endsAt = subscription.ends_at ? new Date(subscription.ends_at) : null;

  if (status === "active") {
    return !endsAt || endsAt > new Date();
  }

  return false;
}
