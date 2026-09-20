import Link from "next/link";

export default function AdminUsersPage() {
  const users = [
    { name: "Marie R.", email: "marie@example.com", plan: "Premium", role: "user" },
    { name: "Jean A.", email: "jean@example.com", plan: "Free", role: "user" },
    { name: "Admin HM", email: "admin@hm.movie", plan: "Admin", role: "admin" }
  ];

  return (
    <div className="rounded-2xl border border-hm-border bg-hm-surface/60 p-5">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-hm-text">Utilisateurs</h2>
        <Link href="/admin" className="text-sm text-hm-gold">Retour dashboard</Link>
      </div>

      <div className="space-y-3">
        {users.map((user) => (
          <div key={user.email} className="flex items-center justify-between rounded-xl border border-hm-border bg-hm-bg p-4">
            <div>
              <p className="font-medium text-hm-text">{user.name}</p>
              <p className="text-sm text-hm-muted">{user.email}</p>
            </div>
            <div className="flex items-center gap-3 text-sm text-hm-muted">
              <span className="rounded-full bg-hm-gold/10 px-2 py-1 text-hm-gold">{user.plan}</span>
              <span className="uppercase tracking-[0.12em]">{user.role}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
