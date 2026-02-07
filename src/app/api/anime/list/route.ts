import { fetchAnimeList } from "@/actions/anime";
import { DiscoverAnimeFetchQueryType } from "@/types/anime";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") as DiscoverAnimeFetchQueryType || "discover";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    try {
        const data = await fetchAnimeList(type, page, limit);
        return NextResponse.json(data);
    } catch (error) {
        console.error("Anime API error:", error);
        return NextResponse.json({ error: "Failed to fetch anime list" }, { status: 500 });
    }
}
