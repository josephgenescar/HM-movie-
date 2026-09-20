"use client";

import { CirclePlay, Crown, Lock } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { WatchlistButton } from "@/components/watchlist-button";
import type { DemoTitle } from "@/lib/demo-content";
import { hasPremiumAccess } from "@/features/subscriptions/subscription-service";

function slugify(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function MediaGrid({ items }: { items: DemoTitle[] }) {
  const [premiumUnlocked, setPremiumUnlocked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function syncAccess() {
      const allowed = await hasPremiumAccess();
      setPremiumUnlocked(allowed);
      setLoading(false);
    }

    syncAccess();
  }, []);

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((item) => {
        const isLocked = Boolean(item.premium) && !premiumUnlocked;
        const watchHref = `/watch/${slugify(item.title)}` as const;

        return (
          <article className="group" key={item.title}>
            <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-hm-surface">
              <img src={item.image} alt={item.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
              {item.premium && (
                <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-hm-gold/90 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-hm-bg">
                  <Crown size={10} /> Premium
                </span>
              )}
              {isLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/55 backdrop-blur-[2px]">
                  <div className="flex flex-col items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3 py-2 text-center text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
                    <Lock size={15} />
                    {loading ? "Vérification..." : "Premium"}
                  </div>
                </div>
              )}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between opacity-0 transition group-hover:opacity-100">
                <Link href={isLocked ? "/premium" : watchHref} aria-label={isLocked ? `Voir le plan Premium pour ${item.title}` : `Lire ${item.title}`} className="grid h-9 w-9 place-items-center rounded-full bg-hm-text text-hm-bg">
                  <CirclePlay size={16} fill="currentColor" />
                </Link>
                <WatchlistButton item={item} />
              </div>
            </div>
            <h2 className="mt-3 truncate font-medium text-hm-text">{item.title}</h2>
            <p className="mt-1 text-xs text-hm-muted">{item.meta} · {item.genre}</p>
          </article>
        );
      })}
    </div>
  );
}
