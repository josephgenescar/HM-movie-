import Link from "next/link";

const content = [
  { title: "The Silent Hour", type: "Film", status: "Publié", premium: true },
  { title: "City of Echoes", type: "Série", status: "Publié", premium: false },
  { title: "Night Shift", type: "Film", status: "Brouillon", premium: true },
  { title: "Red Horizon", type: "Série", status: "En revue", premium: true }
];

export default function AdminContentPage() {
  return (
    <div className="rounded-2xl border border-hm-border bg-hm-surface/60 p-5">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-hm-text">Contenu</h2>
        <Link href="/admin" className="text-sm text-hm-gold">Retour dashboard</Link>
      </div>

      <div className="mb-5 flex gap-3">
        <button className="rounded-full bg-hm-text px-4 py-2 text-sm font-medium text-hm-bg">Ajouter un film</button>
        <button className="rounded-full border border-hm-border px-4 py-2 text-sm text-hm-text">Ajouter une série</button>
      </div>

      <div className="overflow-hidden rounded-xl border border-hm-border">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-hm-bg text-hm-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Titre</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Statut</th>
              <th className="px-4 py-3 font-medium">Premium</th>
            </tr>
          </thead>
          <tbody>
            {content.map((item) => (
              <tr key={item.title} className="border-t border-hm-border bg-hm-surface/30">
                <td className="px-4 py-3 text-hm-text">{item.title}</td>
                <td className="px-4 py-3 text-hm-muted">{item.type}</td>
                <td className="px-4 py-3 text-hm-muted">{item.status}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-1 text-xs ${item.premium ? "bg-hm-gold/10 text-hm-gold" : "bg-hm-bg text-hm-muted"}`}>
                    {item.premium ? "Oui" : "Non"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
