"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, BellRing } from "lucide-react";
import { markAllNotificationsRead, readNotifications, type AppNotification } from "@/features/notifications/notification-service";

export default function NotificationsPage() {
  const [items, setItems] = useState<AppNotification[]>([]);

  useEffect(() => {
    setItems(readNotifications());
    markAllNotificationsRead();
  }, []);

  return (
    <main className="min-h-screen bg-hm-bg px-5 py-6 sm:px-8 lg:px-10">
      <header className="mx-auto flex max-w-5xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-sm text-hm-muted transition hover:text-hm-text"><ArrowLeft size={17} /> Accueil</Link>
        <Link href="/" className="font-display text-2xl font-bold tracking-tight text-hm-text">HM<span className="text-hm-accent">(Movie)</span></Link>
        <span className="text-xs uppercase tracking-[0.2em] text-hm-muted">Notifications</span>
      </header>

      <section className="mx-auto max-w-5xl pb-20 pt-20">
        <div className="mb-8 flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-hm-gold/10 text-hm-gold"><BellRing size={20} /></div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-hm-gold">Centre d’alertes</p>
            <h1 className="mt-2 text-4xl font-bold text-hm-text">Notifications</h1>
          </div>
        </div>

        <div className="space-y-4">
          {items.map((item) => (
            <article key={item.id} className={`rounded-2xl border p-4 ${item.read ? "border-hm-border bg-hm-surface/40" : "border-hm-gold/30 bg-hm-gold/5"}`}>
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-hm-text">{item.title}</p>
                {!item.read && <span className="rounded-full bg-hm-gold/10 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-hm-gold">Nouveau</span>}
              </div>
              <p className="mt-2 text-sm leading-6 text-hm-muted">{item.message}</p>
              <p className="mt-3 text-[11px] uppercase tracking-[0.14em] text-hm-muted">{new Date(item.createdAt).toLocaleDateString("fr-FR")}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
