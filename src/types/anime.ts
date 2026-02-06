import { Database } from "@/utils/supabase/types";
import { ContentType } from ".";

export type AnimeHistoryDetail = Database["public"]["Tables"]["histories"]["Row"];

export type SavedAnimeDetails = {
  adult: boolean;
  type: ContentType;
  backdrop_path: string;
  id: number;
  poster_path?: string;
  release_date: string;
  title: string;
  vote_average: number;
  saved_date: string;
};

export const DISCOVER_ANIME_VALID_QUERY_TYPES = [
  "discover",
  "todayTrending",
  "thisWeekTrending",
  "popular",
  "airing",
  "upcoming",
  "topRated",
  "seasonal",
] as const;

export type DiscoverAnimeFetchQueryType = (typeof DISCOVER_ANIME_VALID_QUERY_TYPES)[number];
