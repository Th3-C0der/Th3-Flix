import { PlayersProps } from "@/types";

/**
 * Generates a list of movie players with their respective titles and source URLs.
 * Each player is constructed using the provided movie ID.
 *
 * @param {string | number} id - The ID of the movie to be embedded in the player URLs.
 * @param {number} [startAt] - The start position in seconds to be embedded in the player URLs. Optional.
 * @returns {PlayersProps[]} - An array of objects, each containing
 * the title of the player and the corresponding source URL.
 */
export const getMoviePlayers = (id: string | number, startAt?: number): PlayersProps[] => {
  return [
    {
      title: "VidSrc",
      source: `https://vidsrc.cc/v2/embed/movie/${id}?autoplay=false&startAt=${startAt}`,
      ads: false,
      fast: true,
      recommended: true,
      resumable: true,
    },
    {
      title: "VidLink",
      source: `https://vidlink.pro/movie/${id}?primaryColor=7bfb76&autoplay=false&startAt=${startAt}`,
      recommended: true,
      fast: true,
      ads: true,
      resumable: true,
    },
    {
      title: "AutoEmbed 1",
      source: `https://autoembed.co/movie/tmdb/${id}`,
      fast: true,
      ads: false,
      recommended: true,
      resumable: true,
    },
    {
      title: "VidKing",
      // NOTE: VidKing has a known issue with the `progress` query parameter where it stuck at that timestamp.
      // Currently, this player can save playback progress but cannot resume from a specific timestamp.
      // The `progress` parameter is commented out in the source URL until this is resolved.
      source: `https://www.vidking.net/embed/movie/${id}?color=006fee&autoplay=false`, //&progress=${startAt || ""}`,
      recommended: true,
      fast: true,
      resumable: true,
    },
    {
      title: "<Embed>",
      source: `https://embed.su/embed/movie/${id}`,
      ads: true,
    },
    {
      title: "SuperEmbed",
      source: `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1`,
      fast: true,
      ads: true,
    },
    {
      title: "FilmKu",
      source: `https://filmku.stream/embed/${id}`,
      ads: true,
    },
    {
      title: "NontonGo",
      source: `https://www.nontongo.win/embed/movie/${id}`,
      ads: true,
    },
    {
      title: "AutoEmbed 2",
      source: `https://player.autoembed.cc/embed/movie/${id}`,
      ads: true,
    },
    {
      title: "2Embed",
      source: `https://www.2embed.cc/embed/${id}`,
      ads: true,
    },
    {
      title: "VidSrc 1",
      source: `https://vidsrc.xyz/embed/movie/${id}`,
      ads: true,
    },
    {
      title: "VidSrc 2",
      source: `https://vidsrc.to/embed/movie/${id}`,
      ads: true,
    },
    {
      title: "VidSrc 3",
      source: `https://vidsrc.icu/embed/movie/${id}`,
      ads: true,
    },
    {
      title: "VidSrc 4",
      source: `https://vidsrc.cc/v2/embed/movie/${id}?autoPlay=false`,
      ads: true,
    },
    {
      title: "VidSrc 5",
      source: `https://vidsrc.cc/v3/embed/movie/${id}?autoPlay=false`,
      recommended: true,
      fast: true,
      ads: true,
    },
    {
      title: "MoviesAPI",
      source: `https://moviesapi.club/movie/${id}`,
      ads: true,
    },
  ];
};

/**
 * Generates a list of anime players with their respective titles and source URLs.
 * Each player is constructed using the provided MAL (MyAnimeList) ID and episode number.
 *
 * @param {string | number} malId - The MyAnimeList ID of the anime to be embedded in the player URLs.
 * @param {number} episode - The episode number of the anime to be embedded.
 * @param {string} [type] - The audio type: 'sub' (subtitle) or 'dub' (dubbed). Defaults to 'sub'.
 * @param {number} [startAt] - The start position in seconds to be embedded in the player URLs. Optional.
 * @returns {PlayersProps[]} - An array of objects, each containing
 * the title of the player and the corresponding source URL.
 */
export const getAnimePlayers = (
  malId: string | number,
  episode: number,
  type: "sub" | "dub" = "sub",
  startAt?: number,
): PlayersProps[] => {
  return [
    {
      title: "VidSrc Sub",
      source: `https://vidsrc.cc/v2/embed/anime/${malId}/${episode}/sub?autoPlay=false&autoSkipIntro=true`,
      fast: true,
      ads: true,
    },
    {
      title: "VidSrc Dub",
      source: `https://vidsrc.cc/v2/embed/anime/${malId}/${episode}/dub?autoPlay=false&autoSkipIntro=true`,
      fast: true,
      ads: true,
    },
    {
      title: "VidLink Sub",
      source: `https://vidlink.pro/anime/${malId}/${episode}/sub?primaryColor=7bfb76&secondaryColor=a2a2a2&iconColor=eefdec&autoplay=false&startAt=${startAt || ""}`,
      recommended: true,
      fast: true,
      ads: true,
      resumable: true,
    },
    {
      title: "VidLink Dub",
      source: `https://vidlink.pro/anime/${malId}/${episode}/dub?fallback=true&primaryColor=7bfb76&secondaryColor=a2a2a2&iconColor=eefdec&autoplay=false&startAt=${startAt || ""}`,
      recommended: true,
      fast: true,
      ads: true,
      resumable: true,
    },
    {
      title: "2Anime Sub",
      source: `https://2anime.xyz/embed/${malId}-${episode}`,
      ads: true,
    },
    {
      title: "AllAnime",
      source: `https://allanime.day/anime/${malId}/${episode}`,
      ads: true,
    },
  ];
};

/**
 * Generates a list of TV show players with their respective titles and source URLs.
 * Each player is constructed using the provided TV show ID, season, and episode.
 *
 * @param {string | number} id - The ID of the TV show to be embedded in the player URLs.
 * @param {string | number} [season] - The season number of the TV show episode to be embedded.
 * @param {string | number} [episode] - The episode number of the TV show episode to be embedded.
 * @param {number} [startAt] - The start position in seconds to be embedded in the player URLs. Optional.
 * @returns {PlayersProps[]} - An array of objects, each containing
 * the title of the player and the corresponding source URL.
 */
export const getTvShowPlayers = (
  id: string | number,
  season: number,
  episode: number,
  startAt?: number,
): PlayersProps[] => {
  return [
    {
      title: "VidSrc",
      source: `https://vidsrc.cc/v2/embed/tv/${id}/${season}/${episode}?autoplay=true&startAt=${startAt}`,
      ads: false,
      fast: true,
      recommended: true,
      resumable: true,
    },
    {
      title: "VidLink",
      source: `https://vidlink.pro/tv/${id}/${season}/${episode}?player=jw&primaryColor=7bfb76&secondaryColor=a2a2a2&iconColor=eefdec&autoplay=false&startAt=${startAt || ""}`,
      recommended: true,
      fast: true,
      ads: true,
      resumable: true,
    },
    {
      title: "AutoEmbed 1",
      source: `https://autoembed.co/tv/tmdb/${id}-${season}-${episode}`,
      fast: true,
      ads: false,
      recommended: true,
      resumable: true,
    },
    {
      title: "VidKing",
      // NOTE: VidKing has a known issue with the `progress` query parameter where it stuck at that timestamp.
      // Currently, this player can save playback progress but cannot resume from a specific timestamp.
      // The `progress` parameter is commented out in the source URL until this is resolved.
      source: `https://www.vidking.net/embed/tv/${id}/${season}/${episode}?color=f5a524&autoplay=false`, //&progress=${startAt || ""}`,
      recommended: true,
      fast: true,
      resumable: true,
    },
    {
      title: "VidLink 2",
      source: `https://vidlink.pro/tv/${id}/${season}/${episode}?primaryColor=7bfb76&autoplay=false&startAt=${startAt}`,
      recommended: true,
      fast: true,
      ads: true,
      resumable: true,
    },
    {
      title: "<Embed>",
      source: `https://embed.su/embed/tv/${id}/${season}/${episode}`,
      ads: true,
    },
    {
      title: "SuperEmbed",
      source: `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1&s=${season}&e=${episode}`,
      fast: true,
      ads: true,
    },
    {
      title: "FilmKu",
      source: `https://filmku.stream/embed/series?tmdb=${id}&sea=${season}&epi=${episode}`,
      ads: true,
    },
    {
      title: "NontonGo",
      source: `https://www.NontonGo.win/embed/tv/${id}/${season}/${episode}`,
      ads: true,
    },
    {
      title: "AutoEmbed 2",
      source: `https://player.autoembed.cc/embed/tv/${id}/${season}/${episode}`,
      ads: true,
    },
    {
      title: "2Embed",
      source: `https://www.2embed.cc/embedtv/${id}&s=${season}&e=${episode}`,
      ads: true,
    },
    {
      title: "VidSrc 1",
      source: `https://vidsrc.xyz/embed/tv/${id}/${season}/${episode}`,
      ads: true,
    },
    {
      title: "VidSrc 2",
      source: `https://vidsrc.to/embed/tv/${id}/${season}/${episode}`,
      ads: true,
    },
    {
      title: "VidSrc 3",
      source: `https://vidsrc.icu/embed/tv/${id}/${season}/${episode}`,
      ads: true,
    },
    {
      title: "VidSrc 4",
      source: `https://vidsrc.cc/v2/embed/tv/${id}/${season}/${episode}?autoPlay=false`,
      ads: true,
    },
    {
      title: "VidSrc 5",
      source: `https://vidsrc.cc/v3/embed/tv/${id}/${season}/${episode}?autoPlay=false`,
      recommended: true,
      fast: true,
      ads: true,
    },
    {
      title: "MoviesAPI",
      source: `https://moviesapi.club/tv/${id}-${season}-${episode}`,
      ads: true,
    },
  ];
};
