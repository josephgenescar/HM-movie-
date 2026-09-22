"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bot, CheckCircle2, Clock3, Film, ImagePlus, LoaderCircle, Sparkles, Wand2, Zap, Plus, ArrowRight, UploadCloud, VolumeX, X } from "lucide-react";
import { createAiProject, finalizeAiVideo, generateScene, getAiCreditSummary, getAiProjects, getVideoCreditCost, listSavedAiCreations, requestAiGeneration, requestAiRenderStatus, requestAiVideoStatus, saveAiCreation, spendAiCredits, type AiGenerationType, type AiProject, type SavedAiCreation, type AiVideoDuration } from "@/features/ai/ai-service";

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
  const [videoDuration, setVideoDuration] = useState<AiVideoDuration>(180);
  const [generationOutput, setGenerationOutput] = useState<string | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [videoPredictionId, setVideoPredictionId] = useState<string | null>(null);
  const [videoStatus, setVideoStatus] = useState<string | null>(null);
  const [renderId, setRenderId] = useState<string | null>(null);
  const [generationStartedAt, setGenerationStartedAt] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [savedCreations, setSavedCreations] = useState<SavedAiCreation[]>([]);
  const [savingCreation, setSavingCreation] = useState(false);
  const [credits, setCredits] = useState(() => getAiCreditSummary());
  const [projectMessage, setProjectMessage] = useState<string | null>(null);
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [uploadingReference, setUploadingReference] = useState(false);
  const referenceInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    listSavedAiCreations().then(setSavedCreations);
  }, []);

  useEffect(() => {
    if (!generating || !generationStartedAt) return;
    const timer = window.setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - generationStartedAt) / 1000));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [generating, generationStartedAt]);

  useEffect(() => {
    if (!videoPredictionId) return;
    const predictionId = videoPredictionId;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    async function pollVideo() {
      try {
        const result = await requestAiVideoStatus(predictionId);
        if (cancelled) return;
        setVideoStatus(result.status ?? "processing");
        const output = Array.isArray(result.output) ? result.output[0] : result.output;
        if (output) {
          setVideoStatus("audio: ap prepare");
          try {
            const finalVideo = await finalizeAiVideo({ videoUrl: output, prompt, style });
            if (!finalVideo.renderId) throw new Error("Shotstack pa retounen render ID.");
            setRenderId(finalVideo.renderId);
            setVideoStatus("audio: ap melanje");
          } catch (error) {
            setGenerationError(error instanceof Error ? error.message : "Ajout son an pa mache.");
            setGenerating(false);
          }
          setVideoPredictionId(null);
          return;
        }
        if (result.status === "failed" || result.status === "canceled") {
          setGenerationError("Jenerasyon videyo a echwe oswa li anile.");
          setGenerating(false);
          setVideoPredictionId(null);
          return;
        }
        timer = setTimeout(pollVideo, 5000);
      } catch (error) {
        if (!cancelled) {
          setGenerationError(error instanceof Error ? error.message : "Video status pa disponib.");
          setGenerating(false);
          setVideoPredictionId(null);
        }
      }
    }

    pollVideo();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [videoPredictionId]);

  useEffect(() => {
    if (!renderId) return;
    const currentRenderId = renderId;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    async function pollRender() {
      try {
        const result = await requestAiRenderStatus(currentRenderId);
        if (cancelled) return;
        setVideoStatus(`audio: ${result.status ?? "processing"}`);
        if (result.output) {
          setGenerationOutput(result.output);
          setGenerating(false);
          setRenderId(null);
          return;
        }
        if (result.status === "failed" || result.status === "cancelled") {
          setGenerationError("Shotstack pa t kapab ajoute son an.");
          setGenerating(false);
          setRenderId(null);
          return;
        }
        timer = setTimeout(pollRender, 5000);
      } catch (error) {
        if (!cancelled) {
          setGenerationError(error instanceof Error ? error.message : "Render audio a pa disponib.");
          setGenerating(false);
          setRenderId(null);
        }
      }
    }

    pollRender();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [renderId]);

  const handleCreateProject = () => {
    const created = createAiProject("Projet IA", "Action");
    setProjects((current) => [created, ...current]);
    setProjectMessage(`Pwojè « ${created.name} » kreye avèk siksè.`);
    window.setTimeout(() => setProjectMessage(null), 4000);
    window.setTimeout(() => document.getElementById("ai-projects")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  const handleGenerate = async () => {
    const requiredCredits = generationType === "video" ? getVideoCreditCost(videoDuration) : generationType === "image" ? 20 : 5;
    if (credits.available < requiredCredits) {
      setGenerationError(`Ou bezwen ${requiredCredits} credits pou sa. Ou gen ${credits.available} sèlman.`);
      return;
    }
    const job = generateScene(projects[0]?.id ?? "proj-ai", prompt, style);
    setLastJob(`${job.prompt.slice(0, 62)}${job.prompt.length > 62 ? "..." : ""}`);
    setGenerationError(null);
    setGenerationOutput(null);
    setVideoStatus(null);
    setVideoPredictionId(null);
    setRenderId(null);
    setGenerationStartedAt(Date.now());
    setElapsedSeconds(0);
    setGenerating(true);
    try {
      const result = await requestAiGeneration({ type: generationType, prompt, style, duration: videoDuration, imageUrl: referenceImage ?? undefined });
      spendAiCredits(generationType, videoDuration);
      setCredits(getAiCreditSummary());
      const output = Array.isArray(result.output) ? result.output[0] : result.output;
      setGenerationOutput(output ?? null);
      if (generationType === "video" && result.predictionId) {
        setVideoPredictionId(result.predictionId);
        setVideoStatus(result.status ?? "starting");
      }
    } catch (error) {
      setGenerationError(error instanceof Error ? error.message : "AI generation pa mache.");
      setGenerating(false);
    } finally {
      if (generationType !== "video") setGenerating(false);
    }
  };

  async function handleReferenceImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploadingReference(true);
    setGenerationError(null);
    try {
      const { uploadAsset } = await import("@/features/storage/storage-service");
      const result = await uploadAsset(file, "poster", `ai-reference/${Date.now()}-${file.name.replace(/\s+/g, "-")}`);
      setReferenceImage(result.url);
    } catch (error) {
      setGenerationError(error instanceof Error ? error.message : "Image reference la pa ka upload.");
    } finally {
      setUploadingReference(false);
      event.target.value = "";
    }
  }

  const videoStage = videoStatus === "starting" ? 0 : videoStatus === "starting" || videoStatus === "processing" ? 1 : videoStatus === "succeeded" ? 3 : 2;
  const elapsedLabel = `${Math.floor(elapsedSeconds / 60)}:${String(elapsedSeconds % 60).padStart(2, "0")}`;

  async function handleSaveCreation() {
    if (!generationOutput) return;
    setSavingCreation(true);
    try {
      const creation = await saveAiCreation({ title: `Kreyasyon ${new Date().toLocaleDateString("fr-FR")}`, prompt, type: generationType, url: generationOutput });
      setSavedCreations((current) => [creation, ...current.filter((item) => item.id !== creation.id)]);
      setGenerationError(null);
    } catch (error) {
      setGenerationError(error instanceof Error ? error.message : "Kreyasyon an pa t ka sove.");
    } finally {
      setSavingCreation(false);
    }
  }

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
          {projectMessage ? <p role="status" className="mt-4 rounded-xl border border-emerald-400/30 bg-emerald-950/20 px-4 py-3 text-sm text-emerald-300">{projectMessage}</p> : null}
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

            {generationType === "video" ? <label className="mb-4 block text-sm text-hm-muted">Dire videyo<select value={videoDuration} onChange={(event) => setVideoDuration(Number(event.target.value) as AiVideoDuration)} className="mt-2 w-full rounded-2xl border border-hm-border bg-hm-bg px-4 py-3 text-hm-text outline-none transition focus:border-hm-gold"><option value={180}>3 minit · 150 credits</option><option value={300}>5 minit · 250 credits</option><option value={600}>10 minit · 500 credits</option></select></label> : null}

            {generationType === "video" ? <section className="mb-4 rounded-2xl border border-hm-gold/40 bg-hm-gold/5 p-4"><div className="flex items-center justify-between gap-3"><div><p className="flex items-center gap-2 text-base font-semibold text-hm-text"><ImagePlus size={18} className="text-hm-gold" /> Image → Vidéo</p><p className="mt-1 text-xs text-hm-muted">Upload pwòp image ou, epi ekri anba a mouvman ou vle AI fè sou li.</p></div>{referenceImage ? <button type="button" onClick={() => setReferenceImage(null)} aria-label="Retire image" className="grid h-8 w-8 place-items-center rounded-lg text-hm-muted hover:bg-hm-surface hover:text-hm-text"><X size={16} /></button> : null}</div><input ref={referenceInputRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={handleReferenceImage} className="hidden" /><div className="mt-4 flex flex-wrap items-center gap-3"><button type="button" onClick={() => referenceInputRef.current?.click()} disabled={uploadingReference} className="inline-flex items-center gap-2 rounded-lg bg-hm-gold px-4 py-2.5 text-sm font-semibold text-hm-bg hover:brightness-110 disabled:opacity-60"><UploadCloud size={15} />{uploadingReference ? "Upload an kou..." : referenceImage ? "Chanje image" : "Upload pwòp image mwen"}</button>{referenceImage ? <><img src={referenceImage} alt="Image de référence" className="h-16 w-24 rounded-lg border border-hm-gold/40 object-cover" /><span className="text-xs text-emerald-300">Image pare pou anime</span></> : <span className="text-xs text-hm-muted">PNG, JPG oswa WebP</span>}</div><p className="mt-3 text-xs text-hm-muted">Ekri nan chan Prompt la, pa egzanp: “fè moun nan mache dousman, kamera a pwoche, ajoute van nan rad li”.</p></section> : null}

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
                {generating ? `${generationType === "video" ? `Videyo ap prepare (${videoStatus ?? "starting"})...` : "AI ap travay..."}` : lastJob ? `Dernier rendu : ${lastJob}` : "Prêt pour votre prochaine création."}
              </p>

              <button
                type="button"
                onClick={handleGenerate}
                disabled={generating}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-hm-gold px-5 py-3 text-sm font-semibold text-hm-bg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {generating ? "Génération..." : "Générer"} <ArrowRight size={16} />
              </button>
            </div>
            {generating && generationType === "video" ? <div className="mt-5 rounded-2xl border border-hm-gold/30 bg-hm-gold/5 p-4"><div className="flex items-center justify-between gap-3"><div className="flex items-center gap-2 text-sm font-semibold text-hm-text"><LoaderCircle size={17} className="animate-spin text-hm-gold" /> Pwosesis videyo a ap mache</div><span className="inline-flex items-center gap-1 text-sm text-hm-gold"><Clock3 size={14} /> {elapsedLabel}</span></div><div className="mt-4 grid grid-cols-3 gap-2">{["Job kreye", "Sèn ap rann", "Preske fini"].map((label, index) => <div key={label} className={`rounded-lg px-2 py-2 text-center text-xs ${index <= videoStage ? "bg-hm-gold/20 text-hm-gold" : "bg-hm-bg text-hm-muted"}`}>{index < videoStage ? <CheckCircle2 size={14} className="mx-auto mb-1" /> : <span className="mx-auto mb-1 block h-3.5" />}{label}</div>)}</div><p className="mt-3 text-xs text-hm-muted">Replicate ap rann videyo a. Tan an depann de longè prompt la ak chaj sou server yo. Pa fèmen paj la.</p></div> : null}
            {generationType === "video" ? <p className="mt-3 text-xs text-hm-muted">Videyo long yo fèt ak plizyè segman AI. Model aktyèl la rann yon sèn kout pou chak job; rasanbleman 3–10 minit mande etap montage segman yo.</p> : null}
            {generationError ? <div className="mt-4 rounded-xl border border-red-400/30 bg-red-950/20 p-3 text-sm text-red-300"><p>{generationError}</p>{generationError.includes("credits") ? <Link href="/premium" className="mt-3 inline-flex items-center gap-2 rounded-lg bg-hm-gold px-3 py-2 font-semibold text-hm-bg">Upgrade credits <ArrowRight size={14} /></Link> : null}</div> : null}
            {generationOutput ? <div className="mt-4 rounded-xl border border-hm-border bg-hm-bg p-4"><p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-hm-gold">Rezilta AI</p>{generationType === "image" ? <img src={generationOutput} alt="Rezilta AI" className="max-h-96 w-full rounded-lg object-contain" /> : generationType === "video" ? <><video src={generationOutput} controls className="max-h-96 w-full rounded-lg" /><p className="mt-3 flex items-center gap-2 text-xs text-hm-muted"><VolumeX size={14} className="text-hm-gold" /> Videyo sa a ka san son: model video aktyèl la pa garanti audio. Ajoute son oswa voice-over nan yon etap montage apa.</p><button type="button" onClick={handleSaveCreation} disabled={savingCreation} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-hm-text px-4 py-2 text-sm font-semibold text-hm-bg disabled:opacity-60">{savingCreation ? "Sove..." : "Sove nan kreyasyon mwen yo"}</button></> : <p className="whitespace-pre-wrap text-sm leading-6 text-hm-text">{generationOutput}</p>}</div> : null}
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
              <Link href="/premium" className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-hm-gold px-4 py-2.5 text-sm font-semibold text-hm-bg">Upgrade credits <ArrowRight size={15} /></Link>
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

        <section id="ai-projects" className="rounded-3xl border border-hm-border bg-hm-surface/60 p-5">
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
        <section className="rounded-3xl border border-hm-border bg-hm-surface/60 p-5">
          <div className="mb-5 flex items-center justify-between"><h2 className="text-xl font-semibold text-hm-text">Kreyasyon mwen yo</h2><span className="text-sm text-hm-muted">{savedCreations.length} sove</span></div>
          {savedCreations.length === 0 ? <p className="text-sm text-hm-muted">Videyo ou sove yo ap parèt isit la pou ou jwenn yo lè ou retounen.</p> : <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{savedCreations.map((creation) => <article key={creation.id} className="rounded-2xl border border-hm-border bg-hm-bg p-3"><video src={creation.url} controls className="aspect-video w-full rounded-lg object-cover" /><h3 className="mt-3 truncate font-semibold text-hm-text">{creation.title}</h3><p className="mt-1 text-xs text-hm-muted">{new Date(creation.createdAt).toLocaleString("fr-FR")}</p></article>)}</div>}
        </section>
      </div>
    </main>
  );
}
