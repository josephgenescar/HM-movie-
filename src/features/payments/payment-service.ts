export type PaymentMethod = "card" | "mobile-money" | "wallet";

export interface PaymentResult {
  success: boolean;
  transactionId: string;
  message: string;
  method: PaymentMethod;
}

export async function createCheckoutSession(planCode: string, method: PaymentMethod = "card"): Promise<PaymentResult> {
  const transactionId = `hm-${planCode}-${Date.now()}`;

  return {
    success: true,
    transactionId,
    message: `Paiement confirmé pour ${planCode}.`,
    method
  };
}

export function persistPremiumDemoAccess(active = true, days = 30) {
  if (typeof window === "undefined") return;

  const expiry = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
  window.localStorage.setItem("hm-movie-premium-demo", JSON.stringify({ active, expiry }));
}

export function readPremiumDemoAccess() {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem("hm-movie-premium-demo");
    if (!raw) return null;

    const parsed = JSON.parse(raw) as { active?: boolean; expiry?: string };
    if (!parsed.active || !parsed.expiry) return null;

    const expiryDate = new Date(parsed.expiry);
    if (Number.isNaN(expiryDate.getTime()) || expiryDate <= new Date()) {
      window.localStorage.removeItem("hm-movie-premium-demo");
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}
