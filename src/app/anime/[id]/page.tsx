"use client";

export const runtime = "edge";

import { fetchAnimeById } from "@/actions/anime";
import { Params } from "@/types";
import { Spinner } from "@heroui/react";
import { useScrollIntoView } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { Suspense, use } from "react";
import dynamic from "next/dynamic";
import { NextPage } from "next";
const AnimeRelatedSection = dynamic(() => import("@/components/sections/Anime/Details/Related"));
const AnimeBackdropSection = dynamic(() => import("@/components/sections/Anime/Details/Backdrop"));
const AnimeOverviewSection = dynamic(() => import("@/components/sections/Anime/Details/Overview"));
const AnimeEpisodesSection = dynamic(() => import("@/components/sections/Anime/Details/Episodes"));
const AnimePhotosSection = dynamic(() => import("@/components/sections/Anime/Details/Photos"));

const AnimeDetailPage: NextPage<Params<{ id: number }>> = ({ params }) => {
  const { id } = use(params);
  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
    duration: 500,
  });

  const {
    data: anime,
    isPending,
    error,
  } = useQuery({
    queryFn: () => fetchAnimeById(id),
    queryKey: ["anime-detail", id],
  });

  if (isPending) {
    return (
      <div className="mx-auto max-w-5xl">
        <Spinner size="lg" className="absolute-center" color="success" variant="simple" />
      </div>
    );
  }

  if (error) notFound();

  return (
    <div className="mx-auto max-w-5xl">
      <Suspense
        fallback={
          <Spinner size="lg" className="absolute-center" color="success" variant="simple" />
        }
      >
        <div className="flex flex-col gap-10">
          <AnimeBackdropSection anime={anime} />
          <AnimeOverviewSection
            onViewEpisodesClick={() => scrollIntoView({ alignment: "center" })}
            anime={anime}
          />
          <AnimePhotosSection anime={anime} />
          {anime.media_type !== "movie" && (
            <div ref={targetRef}>
              <AnimeEpisodesSection anime={anime} />
            </div>
          )}
          <AnimeRelatedSection anime={anime} />
        </div>
      </Suspense>
    </div>
  );
};

export default AnimeDetailPage;
