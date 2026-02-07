import { fetchAnimeById } from "@/actions/anime";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const animeId = parseInt(id);

    if (isNaN(animeId)) {
        return NextResponse.json({ error: "Invalid anime ID" }, { status: 400 });
    }

    try {
        const data = await fetchAnimeById(animeId);
        return NextResponse.json(data);
    } catch (error) {
        console.error("Anime Detail API error:", error);
        return NextResponse.json({ error: "Failed to fetch anime details" }, { status: 500 });
    }
}
