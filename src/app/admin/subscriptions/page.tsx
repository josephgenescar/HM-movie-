import Link from "next/link";

const plans = [
  { name: "Free", price: "0 HTG", users: 812, status: "Actif" },
  { name: "Premium", price: "1499 HTG", users: 412, status: "Actif" },
  { name: "Family", price: "1499 HTG", users: 84, status: "Brouillon" }
];

export default function AdminSubscriptionsPage() {
  return (
    <div className="rounded-2xl border border-hm-border bg-hm-surface/60 p-5">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-hm-text">Abonnements</h2>
        <Link href="/admin" className="text-sm text-hm-gold">Retour dashboard</Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <div key={plan.name} className="rounded-2xl border border-hm-border bg-hm-bg p-4">
            <p className="text-sm uppercase tracking-[0.14em] text-hm-gold">{plan.name}</p>
            <p className="mt-4 text-3xl font-bold text-hm-text">{plan.price}</p>
            <p className="mt-3 text-sm text-hm-muted">{plan.users} utilisateurs</p>
            <span className="mt-5 inline-flex rounded-full bg-hm-gold/10 px-2 py-1 text-xs text-hm-gold">{plan.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
