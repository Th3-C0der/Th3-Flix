"use server";

import {
  getAnimeDetails,
  getAnimeRanking,
  getCurrentSeason,
  getSeasonalAnime,
  searchAnime,
} from "@/utils/mal";
import { DiscoverAnimeFetchQueryType } from "@/types/anime";

const DEFAULT_FIELDS =
  "id,title,main_picture,alternative_titles,start_date,synopsis,mean,rank,popularity,num_episodes,media_type,status,genres,rating,nsfw";

/**
 * Fetch anime list based on query type
 */
export async function fetchAnimeList(
  queryType: DiscoverAnimeFetchQueryType,
  page: number = 1,
  limit: number = 20
) {
  const offset = (page - 1) * limit;

  try {
    switch (queryType) {
      case "topRated":
        return await getAnimeRanking("all", limit, offset, DEFAULT_FIELDS);

      case "popular":
        return await getAnimeRanking("bypopularity", limit, offset, DEFAULT_FIELDS);

      case "airing":
        return await getAnimeRanking("airing", limit, offset, DEFAULT_FIELDS);

      case "upcoming":
        return await getAnimeRanking("upcoming", limit, offset, DEFAULT_FIELDS);

      case "seasonal":
      case "discover":
      default: {
        const { year, season } = getCurrentSeason();
        return await getSeasonalAnime(year, season, "anime_score", limit, offset, DEFAULT_FIELDS);
      }
    }
  } catch (error) {
    console.error("Error fetching anime list:", error);
    throw error;
  }
}

/**
 * Search anime by query
 */
export async function searchAnimeByQuery(
  query: string,
  page: number = 1,
  limit: number = 20
) {
  const offset = (page - 1) * limit;

  try {
    return await searchAnime(query, limit, offset, DEFAULT_FIELDS);
  } catch (error) {
    console.error("Error searching anime:", error);
    throw error;
  }
}

/**
 * Get anime details by ID
 */
export async function fetchAnimeById(animeId: number) {
  try {
    return await getAnimeDetails(animeId);
  } catch (error) {
    console.error("Error fetching anime details:", error);
    throw error;
  }
}
