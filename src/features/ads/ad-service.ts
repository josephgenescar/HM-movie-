export type AdCampaign = {
  id: string;
  title: string;
  image: string;
  targetUrl: string;
  active: boolean;
  placement: "pre-roll" | "mid-roll" | "banner";
};

export const fallbackAds: AdCampaign[] = [
  {
    id: "ad-1",
    title: "HM Plus",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    targetUrl: "/premium",
    active: true,
    placement: "banner"
  },
  {
    id: "ad-2",
    title: "Nouvelle saison",
    image: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=1200&q=80",
    targetUrl: "/series",
    active: true,
    placement: "pre-roll"
  }
];

export async function getAds(): Promise<AdCampaign[]> {
  return fallbackAds;
}

export async function getAdForPlacement(placement: AdCampaign["placement"]): Promise<AdCampaign | null> {
  const ads = await getAds();
  return ads.find((ad) => ad.active && ad.placement === placement) ?? null;
}
