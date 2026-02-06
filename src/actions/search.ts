"use server";

import { tmdb } from "@/api/tmdb";
import { ActionResponse } from "@/types";
import { isEmpty } from "@/utils/helpers";

export type SearchSuggestion = {
  id: number;
  title: string;
  type: "movie" | "tv";
  poster?: string;
  year?: string;
};

export const getSearchSuggestions = async (
  query: string,
  limit: number = 10,
): Promise<ActionResponse<SearchSuggestion[] | null>> => {
  try {
    if (isEmpty(query)) {
      return {
        success: true,
        message: "No search suggestions",
        data: null,
      };
    }

    const searchResults = await tmdb.search.multi({ query, page: 1 });

    const suggestions: SearchSuggestion[] = searchResults.results
      .filter((item: any) => item.media_type === "movie" || item.media_type === "tv")
      .map((item: any) => ({
        id: item.id,
        title: item.media_type === "movie" ? item.title : item.name,
        type: item.media_type as "movie" | "tv",
        poster: item.poster_path,
        year: (item.media_type === "movie" ? item.release_date : item.first_air_date)?.split("-")[0],
      }));

    if (isEmpty(suggestions)) {
      return {
        success: true,
        message: "No search suggestions",
        data: null,
      };
    }

    // Filter duplicates by both type and title/year to avoid removing different items with same title
    const uniqueSuggestions = suggestions.filter(
      (data, index, self) =>
        index ===
        self.findIndex(
          (t) =>
            t.title.toLowerCase() === data.title.toLowerCase() &&
            t.type === data.type &&
            t.year === data.year,
        ),
    );

    return {
      success: true,
      message: "Search suggestions fetched",
      data: uniqueSuggestions.slice(0, limit),
    };
  } catch (error) {
    console.error("Search suggestions error:", error);

    return {
      success: false,
      message: "Error fetching search suggestions",
      data: null,
    };
  }
};
