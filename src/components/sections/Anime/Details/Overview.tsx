"use client";

import { Image, Chip, Button, Link } from "@heroui/react";
import NextLink from "next/link";
import { getMALImageUrl, getAnimeSeason } from "@/utils/mal";
import BookmarkButton from "@/components/ui/button/BookmarkButton";
import ShareButton from "@/components/ui/button/ShareButton";
import { useDocumentTitle } from "@mantine/hooks";
import { siteConfig } from "@/config/site";
import { FaCirclePlay } from "react-icons/fa6";
import Genres from "@/components/ui/other/Genres";
import { Calendar, List } from "@/utils/icons";
import Rating from "@/components/ui/other/Rating";
import SectionTitle from "@/components/ui/other/SectionTitle";
import { SavedAnimeDetails } from "@/types/anime";
import { MALAnime } from "@/utils/mal";
import AnimeTrailer from "./Trailer";

export interface AnimeOverviewSectionProps {
  anime: MALAnime;
  onViewEpisodesClick: () => void;
}

export const AnimeOverviewSection: React.FC<AnimeOverviewSectionProps> = ({
  anime,
  onViewEpisodesClick,
}) => {
  const releaseYear = anime.start_date ? new Date(anime.start_date).getFullYear() : "N/A";
  const posterImage = getMALImageUrl(anime.main_picture?.large);
  const title = anime.title;
  const isAdult = anime.nsfw === "black" || anime.nsfw === "gray";
  const season = getAnimeSeason(anime);

  const bookmarkData: SavedAnimeDetails = {
    type: "anime",
    adult: isAdult,
    backdrop_path: anime.main_picture?.large || "",
    id: anime.id,
    poster_path: anime.main_picture?.large || anime.main_picture?.medium,
    release_date: anime.start_date || "",
    title: title,
    vote_average: anime.mean || 0,
    saved_date: new Date().toISOString(),
  };

  useDocumentTitle(`${title} | ${siteConfig.name}`);

  return (
    <section id="overview" className="relative z-3 flex flex-col gap-8 pt-[20vh] md:pt-[40vh]">
      <div className="md:grid md:grid-cols-[auto_1fr] md:gap-6">
        <Image
          isBlurred
          shadow="md"
          alt={title}
          classNames={{
            wrapper: "w-52 max-h-min aspect-2/3 hidden md:block",
          }}
          className="object-cover object-center"
          src={posterImage}
        />

        <div className="flex flex-col gap-8">
          <div id="title" className="flex flex-col gap-1 md:gap-2">
            <Chip
              color="success"
              variant="faded"
              className="md:text-md text-xs"
              classNames={{ content: "font-bold" }}
            >
              ANIME
            </Chip>
            <h2 className="text-2xl font-black md:text-4xl">{title}</h2>
            {anime.alternative_titles?.en && anime.alternative_titles.en !== title && (
              <p className="text-sm text-foreground-500">{anime.alternative_titles.en}</p>
            )}
            <div className="md:text-md flex flex-wrap gap-1 text-xs md:gap-2">
              {anime.num_episodes && (
                <>
                  <div className="flex items-center gap-1">
                    <List />
                    <span>
                      {anime.num_episodes} Episode{anime.num_episodes > 1 ? "s" : ""}
                    </span>
                  </div>
                  <p>&#8226;</p>
                </>
              )}
              <div className="flex items-center gap-1">
                <Calendar />
                <span>{season}</span>
              </div>
              {anime.mean && (
                <>
                  <p>&#8226;</p>
                  <Rating rate={anime.mean} count={anime.num_scoring_users} />
                </>
              )}
              {anime.status && (
                <>
                  <p>&#8226;</p>
                  <span className="capitalize">{anime.status.replace(/_/g, " ")}</span>
                </>
              )}
            </div>
            {anime.genres && anime.genres.length > 0 && (
              <Genres
                genres={anime.genres.map(g => ({ id: g.id, name: g.name }))}
                type="anime"
              />
            )}
          </div>

          <div id="action" className="flex w-full flex-wrap justify-between gap-4 md:gap-0">
            <div className="flex flex-wrap gap-2">
              <Button
                color="success"
                variant="shadow"
                as={anime.media_type === "movie" ? NextLink : Button}
                href={anime.media_type === "movie" ? `/anime/${anime.id}/1/player` : undefined}
                onPress={anime.media_type === "movie" ? undefined : onViewEpisodesClick}
                startContent={<FaCirclePlay size={22} />}
              >
                {anime.media_type === "movie" ? "Watch Now" : "View Episodes"}
              </Button>
              <AnimeTrailer anime={anime} />
            </div>
            <div className="flex flex-wrap gap-2">
              <ShareButton id={anime.id} title={title} type="anime" />
              <BookmarkButton data={bookmarkData} />
            </div>
          </div>

          {anime.synopsis && (
            <div id="story" className="flex flex-col gap-2">
              <SectionTitle color="success">Synopsis</SectionTitle>
              <p className="text-sm">{anime.synopsis}</p>
            </div>
          )}

          {anime.studios && anime.studios.length > 0 && (
            <div id="studios" className="flex flex-col gap-2">
              <SectionTitle color="success">Studios</SectionTitle>
              <div className="flex flex-wrap gap-2">
                {anime.studios.map((studio) => (
                  <Chip key={studio.id} color="success" variant="flat">
                    {studio.name}
                  </Chip>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AnimeOverviewSection;
