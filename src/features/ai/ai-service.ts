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

export async function requestAiGeneration(input: { type: AiGenerationType; prompt: string; style: string }) {
  const response = await fetch("/api/ai/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input)
  });
  const data = await response.json() as { error?: string; output?: string | null; revisedPrompt?: string | null; provider?: string };
  if (!response.ok) throw new Error(data.error ?? "AI generation pa mache.");
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

export function getAiProjects(): AiProject[] {
  return demoProjects;
}

export function getAiCreditSummary() {
  const totalCredits = 500;
  const spent = demoLedger.filter((entry) => entry.type === "debit").reduce((sum, entry) => sum + entry.amount, 0);
  const available = Math.max(totalCredits - spent, 0);

  return {
    totalCredits,
    spent,
    available,
    plan: "Studio Pro",
    ledger: demoLedger
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
