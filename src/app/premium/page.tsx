"use client";

import Link from "next/link";
import { ArrowLeft, Check, Crown } from "lucide-react";
import { useEffect, useState } from "react";
import { createCheckoutSession } from "@/features/payments/payment-service";
import { getPlans, type SubscriptionPlan } from "@/features/subscriptions/subscription-service";

export default function PremiumPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPlans() {
      setLoading(true);
      const data = await getPlans();
      setPlans(data);
      setLoading(false);
    }

    loadPlans();
  }, []);

  const handleCheckout = async (plan: SubscriptionPlan) => {
    try {
      const result = await createCheckoutSession(plan.code, "card");
      if (result.success) {
        localStorage.setItem("hm-premium-access", JSON.stringify({ active: true, plan: plan.code, updatedAt: new Date().toISOString() }));
      }
      window.alert(`${result.message} (${result.transactionId})`);
    } catch {
      window.alert("Le paiement n’a pas pu être finalisé.");
    }
  };

  return (
    <main className="min-h-screen bg-hm-bg px-5 py-6 sm:px-8 lg:px-10">
      <header className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-sm text-hm-muted transition hover:text-hm-text"><ArrowLeft size={17} /> Accueil</Link>
        <Link href="/" className="font-display text-2xl font-bold tracking-tight text-hm-text">HM<span className="text-hm-accent">(Movie)</span></Link>
        <Link href="/login" className="text-sm text-hm-muted transition hover:text-hm-text">Se connecter</Link>
      </header>
      <section className="mx-auto max-w-5xl pb-20 pt-20 text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-hm-gold/15 text-hm-gold"><Crown size={22} /></div>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-hm-gold">Choisissez votre expérience</p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-hm-text sm:text-6xl">Regardez plus.<br /><span className="text-hm-accent">Attendez moins.</span></h1>
        <p className="mx-auto mt-5 max-w-lg text-base leading-7 text-hm-muted">Une offre simple, sans surprise, pensée pour vous laisser profiter de chaque histoire.</p>

        {loading ? (
          <div className="mx-auto mt-12 grid max-w-3xl gap-5 text-left sm:grid-cols-2">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="h-72 animate-pulse rounded-2xl border border-hm-border bg-hm-surface/50" />
            ))}
          </div>
        ) : (
          <div className="mx-auto mt-12 grid max-w-3xl gap-5 text-left sm:grid-cols-2">
            {plans.map((plan) => {
              const isFeatured = plan.code === "premium";

              return (
                <article key={plan.id} className={`relative rounded-2xl border p-6 sm:p-8 ${isFeatured ? "border-hm-gold bg-hm-gold/10" : "border-hm-border bg-hm-surface/50"}`}>
                  {isFeatured && <span className="absolute right-5 top-5 rounded-full bg-hm-gold px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-hm-bg">Populaire</span>}
                  <h2 className="text-xl font-semibold text-hm-text">{plan.name}</h2>
                  <p className="mt-2 text-sm text-hm-muted">{plan.description}</p>
                  <p className="mt-7 text-4xl font-semibold text-hm-text">
                    {plan.price_monthly === 0 ? "0" : `${(plan.price_monthly / 100).toFixed(2)}`}
                    <span className="text-base font-normal text-hm-muted"> {plan.currency} / mois</span>
                  </p>
                  <button
                    type="button"
                    onClick={() => handleCheckout(plan)}
                    className={`mt-7 h-11 w-full rounded-lg text-sm font-semibold transition ${isFeatured ? "bg-hm-gold text-hm-bg hover:brightness-110" : "border border-hm-border text-hm-text hover:border-hm-text"}`}
                  >
                    {isFeatured ? "Commencer Premium" : "Commencer gratuitement"}
                  </button>
                  <ul className="mt-8 space-y-4 border-t border-hm-border/70 pt-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-sm text-hm-muted"><Check size={16} className="shrink-0 text-hm-gold" />{feature}</li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
