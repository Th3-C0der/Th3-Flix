import { env } from "./env";

const MAL_API_BASE_URL = "https://api.myanimelist.net/v2";

export interface MALAnime {
  id: number;
  title: string;
  main_picture?: {
    medium: string;
    large: string;
  };
  alternative_titles?: {
    synonyms: string[];
    en: string;
    ja: string;
  };
  start_date?: string;
  end_date?: string;
  synopsis?: string;
  mean?: number;
  rank?: number;
  popularity?: number;
  num_list_users?: number;
  num_scoring_users?: number;
  nsfw?: string;
  media_type?: string;
  status?: string;
  genres?: Array<{ id: number; name: string }>;
  num_episodes?: number;
  start_season?: {
    year: number;
    season: string;
  };
  broadcast?: {
    day_of_the_week: string;
    start_time: string;
  };
  source?: string;
  average_episode_duration?: number;
  rating?: string;
  studios?: Array<{ id: number; name: string }>;
  pictures?: Array<{ medium: string; large: string }>;
  background?: string;
  related_anime?: Array<{
    node: MALAnime;
    relation_type: string;
    relation_type_formatted: string;
  }>;
  recommendations?: Array<{
    node: MALAnime;
    num_recommendations: number;
  }>;
  videos?: Array<{
    id: number;
    title: string;
    url: string;
    thumbnail: string;
  }>;
}

export interface MALAnimeList {
  data: Array<{
    node: MALAnime;
    ranking?: {
      rank: number;
    };
  }>;
  paging: {
    previous?: string;
    next?: string;
  };
}

/**
 * Get MAL API headers with client authentication
 */
export function getMALHeaders(): HeadersInit {
  return {
    "X-MAL-CLIENT-ID": env.NEXT_PUBLIC_MYANIMELIST_CLIENT_ID,
    "Content-Type": "application/json",
  };
}

/**
 * Search anime by query
 */
export async function searchAnime(
  query: string,
  limit: number = 20,
  offset: number = 0,
  fields?: string
): Promise<MALAnimeList> {
  const params = new URLSearchParams({
    q: query,
    limit: limit.toString(),
    offset: offset.toString(),
  });

  if (fields) {
    params.append("fields", fields);
  }

  const response = await fetch(`${MAL_API_BASE_URL}/anime?${params}`, {
    headers: getMALHeaders(),
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!response.ok) {
    throw new Error(`MAL API error: ${response.status}`);
  }

  return response.json();
}

/**
 * Get anime details by ID
 */
export async function getAnimeDetails(
  animeId: number,
  fields?: string
): Promise<MALAnime> {
  const defaultFields =
    "id,title,main_picture,alternative_titles,start_date,end_date,synopsis,mean,rank,popularity,num_list_users,num_scoring_users,nsfw,media_type,status,genres,num_episodes,start_season,broadcast,source,average_episode_duration,rating,pictures,background,related_anime{node{id,title,main_picture,mean,start_date,nsfw}},related_manga,recommendations{node{id,title,main_picture,mean,start_date,nsfw}},studios,statistics,videos";

  const params = new URLSearchParams({
    fields: fields || defaultFields,
  });

  const response = await fetch(
    `${MAL_API_BASE_URL}/anime/${animeId}?${params}`,
    {
      headers: getMALHeaders(),
      next: { revalidate: 3600 },
    }
  );

  if (!response.ok) {
    throw new Error(`MAL API error: ${response.status}`);
  }

  return response.json();
}

/**
 * Get anime ranking
 */
export async function getAnimeRanking(
  rankingType:
    | "all"
    | "airing"
    | "upcoming"
    | "tv"
    | "ova"
    | "movie"
    | "special"
    | "bypopularity"
    | "favorite" = "all",
  limit: number = 20,
  offset: number = 0,
  fields?: string
): Promise<MALAnimeList> {
  const params = new URLSearchParams({
    ranking_type: rankingType,
    limit: limit.toString(),
    offset: offset.toString(),
  });

  if (fields) {
    params.append("fields", fields);
  }

  const response = await fetch(`${MAL_API_BASE_URL}/anime/ranking?${params}`, {
    headers: getMALHeaders(),
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`MAL API error: ${response.status}`);
  }

  return response.json();
}

/**
 * Get seasonal anime
 */
export async function getSeasonalAnime(
  year: number,
  season: "winter" | "spring" | "summer" | "fall",
  sort: "anime_score" | "anime_num_list_users" = "anime_score",
  limit: number = 20,
  offset: number = 0,
  fields?: string
): Promise<MALAnimeList> {
  const params = new URLSearchParams({
    sort,
    limit: limit.toString(),
    offset: offset.toString(),
  });

  if (fields) {
    params.append("fields", fields);
  }

  const response = await fetch(
    `${MAL_API_BASE_URL}/anime/season/${year}/${season}?${params}`,
    {
      headers: getMALHeaders(),
      next: { revalidate: 3600 },
    }
  );

  if (!response.ok) {
    throw new Error(`MAL API error: ${response.status}`);
  }

  return response.json();
}

/**
 * Get current season
 */
export function getCurrentSeason(): { year: number; season: "winter" | "spring" | "summer" | "fall" } {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  let season: "winter" | "spring" | "summer" | "fall";
  if (month >= 1 && month <= 3) {
    season = "winter";
  } else if (month >= 4 && month <= 6) {
    season = "spring";
  } else if (month >= 7 && month <= 9) {
    season = "summer";
  } else {
    season = "fall";
  }

  return { year, season };
}

/**
 * Helper to get image URL (MAL provides direct URLs)
 */
export function getMALImageUrl(
  imagePath?: string,
  size: "medium" | "large" = "large"
): string {
  if (!imagePath) {
    return "/placeholder-anime.jpg"; // You'll need to add a placeholder
  }
  return imagePath;
}

/**
 * Convert MAL anime data to a format compatible with the app
 */
export function convertMALAnimeToAppFormat(malAnime: MALAnime) {
  return {
    id: malAnime.id,
    title: malAnime.title,
    name: malAnime.title,
    poster_path: malAnime.main_picture?.large || malAnime.main_picture?.medium,
    backdrop_path: malAnime.main_picture?.large, // MAL doesn't have backdrops, use poster
    overview: malAnime.synopsis,
    vote_average: malAnime.mean ? malAnime.mean / 10 : 0, // Convert 0-10 to 0-1 scale
    release_date: malAnime.start_date,
    first_air_date: malAnime.start_date,
    media_type: "anime",
    genre_ids: malAnime.genres?.map((g) => g.id) || [],
    popularity: malAnime.popularity,
    adult: malAnime.nsfw === "black" || malAnime.nsfw === "gray",
  };
}

/**
 * Get anime episode count
 */
export function getAnimeEpisodeCount(anime: MALAnime): number {
  return anime.num_episodes || 0;
}

/**
 * Check if anime is currently airing
 */
export function isAnimeAiring(anime: MALAnime): boolean {
  return anime.status === "currently_airing";
}

/**
 * Get anime season and year
 */
export function getAnimeSeason(anime: MALAnime): string {
  if (!anime.start_season) return "Unknown";
  const { season, year } = anime.start_season;
  return `${season.charAt(0).toUpperCase() + season.slice(1)} ${year}`;
}
