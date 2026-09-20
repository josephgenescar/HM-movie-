"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getAdForPlacement, type AdCampaign } from "@/features/ads/ad-service";

export function AdBanner({ placement = "banner" }: { placement?: AdCampaign["placement"] }) {
  const [ad, setAd] = useState<AdCampaign | null>(null);

  useEffect(() => {
    async function loadAd() {
      const current = await getAdForPlacement(placement);
      setAd(current);
    }

    loadAd();
  }, [placement]);

  if (!ad) return null;

  const targetHref = ad.targetUrl as "/premium" | "/series" | "/movies";

  return (
    <Link href={targetHref} className="group block overflow-hidden rounded-2xl border border-hm-border bg-hm-surface/60">
      <div className="relative h-28 w-full overflow-hidden sm:h-36">
        <img src={ad.image} alt={ad.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <p className="text-[10px] uppercase tracking-[0.18em] text-hm-gold">Publicité</p>
          <p className="mt-1 text-lg font-semibold text-white">{ad.title}</p>
        </div>
      </div>
    </Link>
  );
}
