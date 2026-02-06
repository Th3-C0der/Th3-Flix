"use client";

import { tmdb } from "@/api/tmdb";
import { fetchAnimeList } from "@/actions/anime";
import { convertMALAnimeToAppFormat } from "@/utils/mal";
import { DiscoverMoviesFetchQueryType } from "@/types/movie";

interface FetchDiscoverMulti {
    page?: number;
    type?: DiscoverMoviesFetchQueryType;
    genres?: string;
}

const useFetchDiscoverMulti = async ({
    page = 1,
    type = "discover",
    genres,
}: FetchDiscoverMulti) => {
    const fetchTMDB = async () => {
        if (type === "todayTrending") {
            const res = await tmdb.trending.trending("all", "day", { page });
            return res.results.map((item: any) => ({
                ...item,
                media_type: item.media_type || (('title' in item) ? 'movie' : 'tv')
            }));
        }

        if (type === "thisWeekTrending") {
            const res = await tmdb.trending.trending("all", "week", { page });
            return res.results.map((item: any) => ({
                ...item,
                media_type: item.media_type || (('title' in item) ? 'movie' : 'tv')
            }));
        }

        // Default discover or popular/upcoming etc
        const moviePromise = tmdb.discover.movie({ page, with_genres: genres });
        const tvPromise = tmdb.discover.tvShow({ page, with_genres: genres });

        const [movies, tvs] = await Promise.all([moviePromise, tvPromise]);

        const mixed = [];
        const maxLen = Math.max(movies.results.length, tvs.results.length);
        for (let i = 0; i < maxLen; i++) {
            if (movies.results[i]) mixed.push({ ...movies.results[i], media_type: "movie" as const });
            if (tvs.results[i]) mixed.push({ ...tvs.results[i], media_type: "tv" as const });
        }

        return mixed;
    };

    const fetchAnime = async () => {
        // Only fetch anime if we are in discover/trending and no specific TMDB genres are applied 
        // OR if we want to include anime regardless.
        // TMDB genres don't easily map to MAL without a large mapping table.
        // For now, let's include trending/popular anime if genres are empty.
        if (genres) return [];

        try {
            const animeTypeMap: any = {
                discover: "discover",
                todayTrending: "popular",
                thisWeekTrending: "popular",
                popular: "popular",
                topRated: "topRated",
            };

            const animeRes = await fetchAnimeList(animeTypeMap[type] || "discover", page, 10);
            return animeRes.data.map(item => convertMALAnimeToAppFormat(item.node));
        } catch (e) {
            console.error("Anime fetch failed in multi", e);
            return [];
        }
    };

    const [tmdbResults, animeResults] = await Promise.all([fetchTMDB(), fetchAnime()]);

    // Merge and interleave
    const finalResults: any[] = [];
    const totalCount = tmdbResults.length + animeResults.length;

    let tIdx = 0;
    let aIdx = 0;

    while (finalResults.length < totalCount) {
        // Take 2 TMDB for 1 Anime to keep it balanced since TMDB has more content
        if (tIdx < tmdbResults.length) {
            finalResults.push(tmdbResults[tIdx++]);
        }
        if (tIdx < tmdbResults.length) {
            finalResults.push(tmdbResults[tIdx++]);
        }
        if (aIdx < animeResults.length) {
            finalResults.push(animeResults[aIdx++]);
        }

        if (tIdx >= tmdbResults.length && aIdx >= animeResults.length) break;
    }

    return {
        page,
        results: finalResults,
        total_pages: 500, // Default limit for discovery
    };
};

export default useFetchDiscoverMulti;
