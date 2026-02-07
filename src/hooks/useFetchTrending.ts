import { tmdb } from "@/api/tmdb";
import { useQuery } from "@tanstack/react-query";

const useFetchTrending = (mediaType: "all" | "movie" | "tv" = "all", timeWindow: "day" | "week" = "day") => {
    return useQuery({
        queryKey: ["trending-hero", mediaType, timeWindow],
        queryFn: async () => {
            const res = await tmdb.trending.trending(mediaType, timeWindow);
            // Fetch images for the first few items to get logos
            const enhancedResults = await Promise.all(
                res.results.slice(0, 10).map(async (item: any) => {
                    try {
                        const type = item.media_type || (('title' in item) ? 'movie' : 'tv');
                        const details = type === 'movie'
                            ? await tmdb.movies.details(item.id, ["images"])
                            : await tmdb.tvShows.details(item.id, ["images"]);

                        return {
                            ...item,
                            media_type: type,
                            images: details.images,
                            genres: details.genres
                        };
                    } catch {
                        return { ...item, media_type: item.media_type || (('title' in item) ? 'movie' : 'tv') };
                    }
                })
            );
            return enhancedResults;
        },
    });
};

export default useFetchTrending;
