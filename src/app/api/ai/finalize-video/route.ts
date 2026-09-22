import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAdminRequest } from "@/lib/ai/admin-access";

function required(value: string | undefined, name: string) {
  if (!value) throw new Error(`${name} pa configure nan .env.local.`);
  return value;
}

export async function POST(request: Request) {
  try {
    if (!(await isAdminRequest())) return NextResponse.json({ error: "AI Studio rezève pou administratè." }, { status: 403 });
    const { videoUrl, prompt, style } = await request.json() as { videoUrl?: string; prompt?: string; style?: string };
    if (!videoUrl || !prompt) return NextResponse.json({ error: "videoUrl ak prompt obligatwa." }, { status: 400 });

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Konekte pou ajoute son nan videyo a." }, { status: 401 });

    const elevenLabsKey = required(process.env.ELEVENLABS_API_KEY, "ELEVENLABS_API_KEY");
    const soundPrompt = `${style ?? "Ciné"}. Create synchronized cinematic sound effects and ambience for this scene: ${prompt}`
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 450);
    const soundResponse = await fetch("https://api.elevenlabs.io/v1/sound-generation", {
      method: "POST",
      headers: { "Content-Type": "application/json", "xi-api-key": elevenLabsKey },
      body: JSON.stringify({ text: soundPrompt, duration_seconds: 8, prompt_influence: 0.4 })
    });
    if (!soundResponse.ok) {
      const error = await soundResponse.text();
      throw new Error(`ElevenLabs pa kreye son an: ${error.slice(0, 180)}`);
    }

    const audioBlob = await soundResponse.blob();
    const audioPath = `generated/${user.id}/${Date.now()}-scene-audio.mp3`;
    const { error: uploadError } = await supabase.storage.from("media").upload(audioPath, audioBlob, { contentType: "audio/mpeg", upsert: false });
    if (uploadError) {
      const detail = uploadError.message.toLowerCase().includes("bucket not found")
        ? "Bucket media a pa egziste. Aplike migration Supabase 202609210001_create_media_items.sql nan SQL Editor la."
        : uploadError.message;
      throw new Error(`Upload audio echwe: ${detail}`);
    }

    const baseUrl = required(process.env.NEXT_PUBLIC_SUPABASE_URL, "NEXT_PUBLIC_SUPABASE_URL").replace(/\/$/, "");
    const audioUrl = `${baseUrl}/storage/v1/object/public/media/${audioPath}`;
    const shotstackKey = required(process.env.SHOTSTACK_API_KEY, "SHOTSTACK_API_KEY");
    const shotstackUrl = process.env.SHOTSTACK_API_URL ?? "https://api.shotstack.io/edit/v1/render";
    const renderResponse = await fetch(shotstackUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": shotstackKey },
      body: JSON.stringify({
        timeline: {
          tracks: [
            { clips: [{ asset: { type: "video", src: videoUrl }, start: 0, length: 8, fit: "crop" }] },
            { clips: [{ asset: { type: "audio", src: audioUrl, volume: 1 }, start: 0, length: 8 }] }
          ]
        },
        output: { format: "mp4", resolution: "hd", fps: 30 }
      })
    });
    const renderData = await renderResponse.json();
    if (!renderResponse.ok) {
      const details = renderData.response?.message ?? renderData.response?.errors?.join(", ") ?? renderData.message ?? JSON.stringify(renderData);
      throw new Error(`Shotstack pa lanse render la: ${details}`);
    }
    return NextResponse.json({ renderId: renderData.response?.id ?? renderData.id, status: "queued" });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Ajout son an echwe." }, { status: 500 });
  }
}
