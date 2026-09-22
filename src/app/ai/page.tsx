"use client";

import { useMemo, useState } from "react";
import { Bot, Film, Sparkles, Wand2, Zap, Plus, ArrowRight } from "lucide-react";
import { createAiProject, generateScene, getAiCreditSummary, getAiProjects, requestAiGeneration, type AiGenerationType, type AiProject } from "@/features/ai/ai-service";

const promptTemplates = [
  "Scène de poursuite intense dans une ville nocturne, éclairage bleu, caméra dynamique.",
  "Plan large romantique sur une plage au coucher du soleil avec des reflets dorés.",
  "Superposition futuriste avec des hologrammes et une ambiance cyberpunk sombre."
];

export default function AiStudioPage() {
  const [projects, setProjects] = useState<AiProject[]>(() => getAiProjects());
  const [prompt, setPrompt] = useState<string>(promptTemplates[0] ?? "");
  const [style, setStyle] = useState("Ciné");
  const [lastJob, setLastJob] = useState<string | null>(null);
  const [generationType, setGenerationType] = useState<AiGenerationType>("script");
  const [generationOutput, setGenerationOutput] = useState<string | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const credits = useMemo(() => getAiCreditSummary(), []);

  const handleCreateProject = () => {
    const created = createAiProject("Projet IA", "Action");
    setProjects((current) => [created, ...current]);
  };

  const handleGenerate = async () => {
    const job = generateScene(projects[0]?.id ?? "proj-ai", prompt, style);
    setLastJob(`${job.prompt.slice(0, 62)}${job.prompt.length > 62 ? "..." : ""}`);
    setGenerationError(null);
    setGenerationOutput(null);
    setGenerating(true);
    try {
      const result = await requestAiGeneration({ type: generationType, prompt, style });
      setGenerationOutput(result.output ?? null);
    } catch (error) {
      setGenerationError(error instanceof Error ? error.message : "AI generation pa mache.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <main className="min-h-screen bg-hm-bg px-4 py-6 text-hm-text sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="rounded-3xl border border-hm-border bg-hm-surface/70 p-6 shadow-[0_10px_40px_rgba(0,0,0,0.2)]">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.23em] text-hm-gold">AI Studio</p>
              <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Créez des scènes et des mondes visuels</h1>
            </div>
            <button
              type="button"
              onClick={handleCreateProject}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-hm-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-hm-accent-hover"
            >
              <Plus size={16} /> Nouveau projet
            </button>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Crédits disponibles", value: `${credits.available} cr`, icon: Zap },
            { label: "Projets actifs", value: `${projects.length}`, icon: Film },
            { label: "Jobs IA", value: "18", icon: Bot },
            { label: "Rendus this week", value: "96", icon: Sparkles }
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-2xl border border-hm-border bg-hm-surface/60 p-5">
              <div className="mb-4 inline-flex rounded-full bg-hm-gold/10 p-2 text-hm-gold">
                <Icon size={18} />
              </div>
              <p className="text-sm text-hm-muted">{label}</p>
              <p className="mt-3 text-3xl font-bold text-hm-text">{value}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
          <div className="rounded-3xl border border-hm-border bg-hm-surface/60 p-5">
            <div className="mb-5 flex items-center gap-3">
              <div className="inline-flex rounded-full bg-hm-gold/10 p-2 text-hm-gold">
                <Wand2 size={18} />
              </div>
              <h2 className="text-xl font-semibold text-hm-text">Générateur de scène</h2>
            </div>

            <label className="mb-4 block text-sm text-hm-muted">
              Style visuel
              <select
                value={style}
                onChange={(event) => setStyle(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-hm-border bg-hm-bg px-4 py-3 text-hm-text outline-none ring-0 transition focus:border-hm-gold"
              >
                <option>Ciné</option>
                <option>Anime</option>
                <option>Cyberpunk</option>
                <option>Documentaire</option>
              </select>
            </label>

            <label className="block text-sm text-hm-muted">
              Prompt
              <textarea
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                rows={6}
                className="mt-2 w-full rounded-2xl border border-hm-border bg-hm-bg px-4 py-3 text-hm-text outline-none transition focus:border-hm-gold"
              />
            </label>

            <label className="mb-4 block text-sm text-hm-muted">
              Jenere
              <select
                value={generationType}
                onChange={(event) => setGenerationType(event.target.value as AiGenerationType)}
                className="mt-2 w-full rounded-2xl border border-hm-border bg-hm-bg px-4 py-3 text-hm-text outline-none transition focus:border-hm-gold"
              >
                <option value="script">Script / tèks</option>
                <option value="image">Imaj</option>
                <option value="video">Videyo</option>
              </select>
            </label>

            <div className="mt-4 flex flex-wrap gap-2">
              {promptTemplates.map((template) => (
                <button
                  key={template}
                  type="button"
                  onClick={() => setPrompt(template)}
                  className="rounded-full border border-hm-border bg-hm-bg px-3 py-2 text-xs text-hm-muted transition hover:border-hm-gold hover:text-hm-text"
                >
                  Template
                </button>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-hm-muted">
                {generating ? "AI ap travay..." : lastJob ? `Dernier rendu : ${lastJob}` : "Prêt pour votre prochaine création."}
              </p>

              <button
                type="button"
                onClick={handleGenerate}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-hm-gold px-5 py-3 text-sm font-semibold text-hm-bg transition hover:opacity-90"
              >
                {generating ? "Génération..." : "Générer"} <ArrowRight size={16} />
              </button>
            </div>
            {generationError ? <p className="mt-4 rounded-xl border border-red-400/30 bg-red-950/20 p-3 text-sm text-red-300">{generationError}</p> : null}
            {generationOutput ? <div className="mt-4 rounded-xl border border-hm-border bg-hm-bg p-4"><p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-hm-gold">Rezilta AI</p>{generationType === "image" ? <img src={generationOutput} alt="Rezilta AI" className="max-h-96 w-full rounded-lg object-contain" /> : <p className="whitespace-pre-wrap text-sm leading-6 text-hm-text">{generationOutput}</p>}</div> : null}
          </div>

          <aside className="rounded-3xl border border-hm-border bg-hm-surface/60 p-5">
            <h3 className="text-lg font-semibold text-hm-text">Crédits & forfait</h3>
            <div className="mt-5 rounded-2xl bg-hm-bg p-4">
              <div className="flex items-center justify-between text-sm text-hm-muted">
                <span>Forfait</span>
                <span className="font-medium text-hm-text">{credits.plan}</span>
              </div>
              <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-hm-border">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-hm-gold to-hm-accent"
                  style={{ width: `${Math.max((credits.available / credits.totalCredits) * 100, 12)}%` }}
                />
              </div>
              <div className="mt-4 flex items-center justify-between text-sm text-hm-muted">
                <span>Utilisés</span>
                <span className="text-hm-text">{credits.spent} cr</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm text-hm-muted">
                <span>Disponibles</span>
                <span className="text-hm-text">{credits.available} cr</span>
              </div>
            </div>

            <ul className="mt-5 space-y-3 text-sm text-hm-muted">
              {credits.ledger.slice(0, 3).map((entry) => (
                <li key={entry.id} className="flex items-center justify-between rounded-xl bg-hm-bg p-3">
                  <span>{entry.reason}</span>
                  <span className={entry.type === "debit" ? "text-hm-gold" : "text-emerald-400"}>
                    {entry.type === "debit" ? "-" : "+"}
                    {entry.amount}
                  </span>
                </li>
              ))}
            </ul>
          </aside>
        </section>

        <section className="rounded-3xl border border-hm-border bg-hm-surface/60 p-5">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-hm-text">Projets récents</h2>
            <span className="text-sm text-hm-muted">{projects.length} actifs</span>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <article key={project.id} className="rounded-2xl border border-hm-border bg-hm-bg p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-hm-text">{project.name}</h3>
                  <span className="rounded-full bg-hm-gold/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-hm-gold">
                    {project.status}
                  </span>
                </div>
                <p className="mt-3 text-sm text-hm-muted">{project.genre}</p>
                <div className="mt-5 flex items-center justify-between text-sm text-hm-muted">
                  <span>{project.scenes} scènes</span>
                  <span>{project.budget} cr</span>
                </div>
                <p className="mt-5 text-xs uppercase tracking-[0.18em] text-hm-muted">{project.lastUpdated}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
