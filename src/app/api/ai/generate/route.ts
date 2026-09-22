import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/ai/admin-access";

type GenerationType = "script" | "image" | "video";
type VideoDuration = 180 | 300 | 600;

type RequestBody = {
  type?: GenerationType;
  prompt?: string;
  style?: string;
  duration?: VideoDuration;
  imageUrl?: string;
};

function requireValue(value: string | undefined, name: string) {
  if (!value) {
    throw new Error(`${name} pa configure. Ajoute li nan .env.local.`);
  }
  return value;
}

async function generateScript(prompt: string, style: string) {
  const provider = process.env.AI_TEXT_PROVIDER ?? "openai";

  if (provider === "gemini") {
    const key = requireValue(process.env.GOOGLE_AI_API_KEY, "GOOGLE_AI_API_KEY");
    const model = process.env.GOOGLE_AI_MODEL ?? "gemini-2.5-flash";
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: `Style: ${style}\n\n${prompt}` }] }] })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message ?? "Gemini pa reponn.");
    return { provider, output: data.candidates?.[0]?.content?.parts?.[0]?.text ?? "Gemini pa retounen tèks." };
  }

  if (provider === "anthropic") {
    const key = requireValue(process.env.ANTHROPIC_API_KEY, "ANTHROPIC_API_KEY");
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: process.env.ANTHROPIC_MODEL ?? "claude-3-5-sonnet-latest", max_tokens: 1200, messages: [{ role: "user", content: `Style: ${style}\n\n${prompt}` }] })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message ?? "Claude pa reponn.");
    return { provider, output: data.content?.[0]?.text ?? "Claude pa retounen tèks." };
  }

  const key = requireValue(process.env.OPENAI_API_KEY, "OPENAI_API_KEY");
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({ model: process.env.OPENAI_TEXT_MODEL ?? "gpt-4o-mini", messages: [{ role: "user", content: `Style: ${style}\n\n${prompt}` }] })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message ?? "OpenAI pa reponn.");
  return { provider, output: data.choices?.[0]?.message?.content ?? "OpenAI pa retounen tèks." };
}

async function generateImage(prompt: string, style: string) {
  const key = requireValue(process.env.OPENAI_API_KEY, "OPENAI_API_KEY");
  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({ model: process.env.OPENAI_IMAGE_MODEL ?? "gpt-image-1", prompt: `${style}: ${prompt}`, size: "1024x1024", quality: "medium", n: 1 })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message ?? "OpenAI image API pa reponn.");
  return { provider: "openai", output: data.data?.[0]?.url ?? null, revisedPrompt: data.data?.[0]?.revised_prompt ?? null };
}

async function generateVideo(prompt: string, style: string, duration: VideoDuration, imageUrl?: string) {
  const token = requireValue(process.env.REPLICATE_API_TOKEN, "REPLICATE_API_TOKEN");
  const model = imageUrl ? (process.env.REPLICATE_IMAGE_VIDEO_MODEL ?? "stability-ai/stable-video-diffusion") : (process.env.REPLICATE_VIDEO_MODEL ?? "minimax/video-01");
  const input = imageUrl
    ? { input_image: imageUrl, motion_bucket_id: 127, cond_aug: 0.02 }
    : { prompt: `${style}: ${prompt}` };
  const response = await fetch(`https://api.replicate.com/v1/models/${model}/predictions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ input })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail ?? data.title ?? "Replicate video API pa reponn.");
  return { provider: "replicate", output: null, predictionId: data.id, status: data.status, statusUrl: data.urls?.get ?? null, requestedDuration: duration, hasReferenceImage: Boolean(imageUrl) };
}

export async function POST(request: Request) {
  try {
    if (!(await isAdminRequest())) return NextResponse.json({ error: "AI Studio rezève pou administratè." }, { status: 403 });
    const body = await request.json() as RequestBody;
    const prompt = body.prompt?.trim();
    const type = body.type ?? "script";
    if (!prompt) return NextResponse.json({ error: "Ekri yon prompt avan ou jenere." }, { status: 400 });
    const duration = body.duration === 300 || body.duration === 600 ? body.duration : 180;
    const result = type === "video" ? await generateVideo(prompt, body.style ?? "Ciné", duration, body.imageUrl) : type === "image" ? await generateImage(prompt, body.style ?? "Ciné") : await generateScript(prompt, body.style ?? "Ciné");
    return NextResponse.json({ type, ...result });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "AI generation pa mache." }, { status: 500 });
  }
}
