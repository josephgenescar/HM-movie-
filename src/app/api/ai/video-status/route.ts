import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/ai/admin-access";

export async function POST(request: Request) {
  try {
    if (!(await isAdminRequest())) return NextResponse.json({ error: "AI Studio rezève pou administratè." }, { status: 403 });
    const { predictionId } = await request.json() as { predictionId?: string };
    const token = process.env.REPLICATE_API_TOKEN;
    if (!token) return NextResponse.json({ error: "REPLICATE_API_TOKEN pa configure." }, { status: 500 });
    if (!predictionId) return NextResponse.json({ error: "predictionId manke." }, { status: 400 });

    const response = await fetch(`https://api.replicate.com/v1/predictions/${encodeURIComponent(predictionId)}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) return NextResponse.json({ error: data.detail ?? "Replicate pa retounen status la." }, { status: response.status });

    return NextResponse.json({ status: data.status, output: data.output ?? null, error: data.error ?? null });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Video status pa disponib." }, { status: 500 });
  }
}
