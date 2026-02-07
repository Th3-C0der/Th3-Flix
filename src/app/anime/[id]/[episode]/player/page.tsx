"use client";

export const runtime = "edge";

import { fetchAnimeById } from "@/actions/anime";
import AnimePlayer from "@/components/sections/Anime/Player/Player";
import { Params } from "@/types";
import { Spinner } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { NextPage } from "next";
import { notFound } from "next/navigation";
import { use } from "react";

const AnimePlayerPage: NextPage<Params<{ id: number; episode: number }>> = ({ params }) => {
  const { id, episode } = use(params);

  const {
    data: anime,
    isPending,
    error,
  } = useQuery({
    queryFn: () => fetchAnimeById(id),
    queryKey: ["anime-player", id],
  });

  if (isPending) {
    return (
      <div className="mx-auto max-w-5xl">
        <Spinner size="lg" className="absolute-center" color="success" variant="simple" />
      </div>
    );
  }

  if (error || !anime) notFound();

  const totalEpisodes = anime.num_episodes || 0;

  // Validate episode number
  if (episode < 1 || (totalEpisodes > 0 && episode > totalEpisodes)) {
    notFound();
  }

  const nextEpisodeNumber = episode < totalEpisodes ? episode + 1 : null;
  const prevEpisodeNumber = episode > 1 ? episode - 1 : null;

  return (
    <AnimePlayer
      malId={id}
      animeName={anime.title}
      episodeNumber={episode}
      totalEpisodes={totalEpisodes}
      nextEpisodeNumber={nextEpisodeNumber}
      prevEpisodeNumber={prevEpisodeNumber}
    />
  );
};

export default AnimePlayerPage;
