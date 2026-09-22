import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/ai/admin-access";

export async function POST(request: Request) {
  try {
    if (!(await isAdminRequest())) return NextResponse.json({ error: "AI Studio rezève pou administratè." }, { status: 403 });
    const { renderId } = await request.json() as { renderId?: string };
    if (!renderId) return NextResponse.json({ error: "renderId manke." }, { status: 400 });
    const key = process.env.SHOTSTACK_API_KEY;
    if (!key) return NextResponse.json({ error: "SHOTSTACK_API_KEY pa configure." }, { status: 500 });

    const baseUrl = process.env.SHOTSTACK_API_URL ?? "https://api.shotstack.io/edit/v1/render";
    const response = await fetch(`${baseUrl}/${encodeURIComponent(renderId)}`, { headers: { "x-api-key": key } });
    const data = await response.json();
    if (!response.ok) return NextResponse.json({ error: data.response?.message ?? "Shotstack status la pa disponib." }, { status: response.status });
    const result = data.response ?? data;
    return NextResponse.json({ status: result.status, output: result.url ?? null, error: result.error ?? null });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Render status pa disponib." }, { status: 500 });
  }
}
