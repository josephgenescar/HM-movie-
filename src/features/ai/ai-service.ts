export type AiProjectStatus = "draft" | "generating" | "ready";

export interface AiProject {
  id: string;
  name: string;
  genre: string;
  status: AiProjectStatus;
  lastUpdated: string;
  scenes: number;
  budget: number;
}

export interface AiGenerationJob {
  id: string;
  projectId: string;
  prompt: string;
  style: string;
  status: "queued" | "rendering" | "done";
  createdAt: string;
}

export type AiGenerationType = "script" | "image" | "video";
export type AiVideoDuration = 180 | 300 | 600;

export function getVideoCreditCost(duration: AiVideoDuration) {
  return duration === 180 ? 150 : duration === 300 ? 250 : 500;
}

export type SavedAiCreation = {
  id: string;
  title: string;
  prompt: string;
  type: AiGenerationType;
  url: string;
  createdAt: string;
};

const localCreationKey = "hm-ai-creations";

function getLocalCreations(): SavedAiCreation[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(localCreationKey) ?? "[]") as SavedAiCreation[];
  } catch {
    return [];
  }
}

export async function saveAiCreation(input: { title: string; prompt: string; type: AiGenerationType; url: string }) {
  const { createClient } = await import("@/lib/supabase/client");
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Konekte sou kont ou pou sove kreyasyon an.");

  const response = await fetch(input.url);
  if (!response.ok) throw new Error("Videyo tanporè a pa disponib ankò.");
  const file = new File([await response.blob()], `${Date.now()}-${input.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.mp4`, { type: "video/mp4" });
  const path = `generated/${user.id}/${file.name}`;
  const { error: uploadError } = await supabase.storage.from("media").upload(path, file, { contentType: "video/mp4", upsert: false });
  if (uploadError) throw new Error(uploadError.message);

  const saved = { title: input.title, prompt: input.prompt, type: input.type, url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${path}`, user_id: user.id };
  const { data, error } = await supabase.from("ai_creations").insert(saved).select().single();
  const creation = data ? { id: data.id, title: data.title, prompt: data.prompt, type: data.type, url: data.url, createdAt: data.created_at } as SavedAiCreation : { ...saved, id: `local-${Date.now()}`, createdAt: new Date().toISOString() } as SavedAiCreation;
  if (error) {
    const local = [creation, ...getLocalCreations()];
    window.localStorage.setItem(localCreationKey, JSON.stringify(local));
  }
  return creation;
}

export async function listSavedAiCreations(): Promise<SavedAiCreation[]> {
  const { createClient } = await import("@/lib/supabase/client");
  const supabase = createClient();
  try {
    const { data, error } = await supabase.from("ai_creations").select("*").order("created_at", { ascending: false });
    if (!error && data) return data.map((item: any) => ({ id: item.id, title: item.title, prompt: item.prompt, type: item.type, url: item.url, createdAt: item.created_at }));
  } catch {
    // Keep local fallback for projects before the database migration is applied.
  }
  return getLocalCreations();
}

export async function requestAiGeneration(input: { type: AiGenerationType; prompt: string; style: string; duration?: AiVideoDuration; imageUrl?: string }) {
  const response = await fetch("/api/ai/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input)
  });
  const data = await response.json() as { error?: string; output?: string | string[] | null; revisedPrompt?: string | null; provider?: string; predictionId?: string; status?: string };
  if (!response.ok) throw new Error(data.error ?? "AI generation pa mache.");
  return data;
}

export async function requestAiVideoStatus(predictionId: string) {
  const response = await fetch("/api/ai/video-status", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ predictionId })
  });
  const data = await response.json() as { error?: string; output?: string | string[] | null; status?: string };
  if (!response.ok) throw new Error(data.error ?? "Video status pa disponib.");
  return data;
}

export async function finalizeAiVideo(input: { videoUrl: string; prompt: string; style: string }) {
  const response = await fetch("/api/ai/finalize-video", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input)
  });
  const data = await response.json() as { error?: string; renderId?: string; status?: string };
  if (!response.ok) throw new Error(data.error ?? "Ajout son an pa mache.");
  return data;
}

export async function requestAiRenderStatus(renderId: string) {
  const response = await fetch("/api/ai/render-status", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ renderId })
  });
  const data = await response.json() as { error?: string; output?: string | null; status?: string };
  if (!response.ok) throw new Error(data.error ?? "Shotstack status pa disponib.");
  return data;
}

export interface AiCreditLedger {
  id: string;
  type: "credit" | "debit";
  amount: number;
  reason: string;
  createdAt: string;
}

const demoProjects: AiProject[] = [
  {
    id: "proj-aurora",
    name: "Aurora Stories",
    genre: "Sci-Fi",
    status: "ready",
    lastUpdated: "Il y a 2h",
    scenes: 12,
    budget: 320
  },
  {
    id: "proj-noir",
    name: "Noir Memories",
    genre: "Thriller",
    status: "generating",
    lastUpdated: "Il y a 18 min",
    scenes: 7,
    budget: 180
  },
  {
    id: "proj-cosmos",
    name: "Cosmos Drift",
    genre: "Fantasy",
    status: "draft",
    lastUpdated: "Hier",
    scenes: 3,
    budget: 95
  }
];

const demoLedger: AiCreditLedger[] = [
  { id: "ledger-1", type: "debit", amount: 120, reason: "Génération de scènes", createdAt: "2026-09-18" },
  { id: "ledger-2", type: "credit", amount: 50, reason: "Bonus de lancement", createdAt: "2026-09-17" },
  { id: "ledger-3", type: "debit", amount: 80, reason: "Rendu vidéo premium", createdAt: "2026-09-16" }
];

const localUsageKey = "hm-ai-credit-ledger";
const localPurchasedCreditsKey = "hm-ai-purchased-credits";

function getPurchasedCredits() {
  if (typeof window === "undefined") return 0;
  return Number(window.localStorage.getItem(localPurchasedCreditsKey) ?? 0);
}

export function addAiCredits(amount: number) {
  if (typeof window !== "undefined") window.localStorage.setItem(localPurchasedCreditsKey, String(getPurchasedCredits() + amount));
}

function getUsageLedger(): AiCreditLedger[] {
  if (typeof window === "undefined") return demoLedger;
  try {
    const stored = JSON.parse(window.localStorage.getItem(localUsageKey) ?? "null") as AiCreditLedger[] | null;
    return stored ?? demoLedger;
  } catch {
    return demoLedger;
  }
}

export function spendAiCredits(type: AiGenerationType, duration: AiVideoDuration = 180): AiCreditLedger {
  const amount = type === "video" ? getVideoCreditCost(duration) : type === "image" ? 20 : 5;
  const entry: AiCreditLedger = {
    id: `ledger-${Date.now()}`,
    type: "debit",
    amount,
    reason: type === "video" ? `Génération vidéo + audio (${duration / 60} min)` : type === "image" ? "Génération d'image" : "Génération de script",
    createdAt: new Date().toISOString()
  };
  if (typeof window !== "undefined") window.localStorage.setItem(localUsageKey, JSON.stringify([entry, ...getUsageLedger()]));
  return entry;
}

export function getAiProjects(): AiProject[] {
  return demoProjects;
}

export function getAiCreditSummary() {
  const totalCredits = 500 + getPurchasedCredits();
  const ledger = getUsageLedger();
  const spent = ledger.filter((entry) => entry.type === "debit").reduce((sum, entry) => sum + entry.amount, 0);
  const available = Math.max(totalCredits - spent, 0);

  return {
    totalCredits,
    spent,
    available,
    plan: "Studio Pro",
    ledger
  };
}

export function createAiProject(name: string, genre: string): AiProject {
  const project: AiProject = {
    id: `proj-${Date.now()}`,
    name: name || "Nouveau projet",
    genre: genre || "Drame",
    status: "draft",
    lastUpdated: "À l’instant",
    scenes: 0,
    budget: 0
  };

  demoProjects.unshift(project);
  return project;
}

export function generateScene(projectId: string, prompt: string, style: string): AiGenerationJob {
  return {
    id: `job-${Date.now()}`,
    projectId,
    prompt: prompt || "Scène de transition lumineuse et dramatique.",
    style: style || "Ciné",
    status: "queued",
    createdAt: new Date().toISOString()
  };
}
