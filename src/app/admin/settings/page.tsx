import Link from "next/link";

const settings = [
  { label: "Platforme visible", value: "Oui" },
  { label: "Publicités actives", value: "Oui" },
  { label: "Mode maintenance", value: "Non" },
  { label: "Paiements natifs", value: "Oui" }
];

export default function AdminSettingsPage() {
  return (
    <div className="rounded-2xl border border-hm-border bg-hm-surface/60 p-5">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-hm-text">Paramètres</h2>
        <Link href="/admin" className="text-sm text-hm-gold">Retour dashboard</Link>
      </div>

      <div className="space-y-4">
        {settings.map((item) => (
          <div key={item.label} className="flex items-center justify-between rounded-xl border border-hm-border bg-hm-bg p-4">
            <span className="text-sm text-hm-muted">{item.label}</span>
            <span className="rounded-full bg-hm-gold/10 px-2 py-1 text-xs text-hm-gold">{item.value}</span>
          </div>
        ))}
      </div>

      <button className="mt-6 rounded-full bg-hm-text px-5 py-3 text-sm font-semibold text-hm-bg">Sauvegarder les paramètres</button>
    </div>
  );
}
