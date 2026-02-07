"use client";

import ContentTypeSelection from "@/components/ui/other/ContentTypeSelection";
import { siteConfig } from "@/config/site";
import { Spinner, Card, CardBody, Chip } from "@heroui/react";
import dynamic from "next/dynamic";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import { Suspense } from "react";
import { Icon } from "@iconify/react";
const MovieHomeList = dynamic(() => import("@/components/sections/Movie/HomeList"));
const TvShowHomeList = dynamic(() => import("@/components/sections/TV/HomeList"));
const AnimeHomeList = dynamic(() => import("@/components/sections/Anime/HomeList"));
const MultiHomeList = dynamic(() => import("@/components/sections/Home/MultiHomeList"));

const HomePageList: React.FC = () => {
  const { movies, tvShows, anime } = siteConfig.queryLists;
  const [content] = useQueryState(
    "content",
    parseAsStringLiteral(["multi", "movie", "tv", "anime"]).withDefault("multi"),
  );

  const multiRows = [
    { name: "Trending Today", param: "todayTrending" },
    { name: "Trending This Week", param: "thisWeekTrending" },
    { name: "Popular Choice", param: "popular" },
    { name: "Top Rated", param: "topRated" },
    { name: "Comedy Hits", param: "discover", genres: "35" },
    { name: "Animated Adventures", param: "discover", genres: "16" },
    { name: "New Arrivals", param: "upcoming" },
  ];

  const getSpinnerColor = () => {
    if (content === "multi") return "danger";
    if (content === "movie") return "primary";
    if (content === "tv") return "warning";
    return "success";
  };

  return (
    <div className="flex flex-col gap-12">
      <ContentTypeSelection className="justify-center" />

      {/* Beta Warning for Anime */}
      {content === "anime" && (
        <Card className="border-2 border-warning bg-warning/10">
          <CardBody className="flex flex-row items-center gap-3 p-4">
            <Icon icon="mdi:beta" className="text-4xl text-warning" />
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-warning">Anime Section - Beta Phase</h3>
                <Chip color="warning" size="sm" variant="flat">
                  BETA
                </Chip>
              </div>
              <p className="text-sm text-foreground-600">
                The anime section is in early development, so some features or content may not work yet. We’re improving it actively!
                For now, you can use the Movies/Series section to watch anime.
              </p>
            </div>
          </CardBody>
        </Card>
      )}

      <div className="relative flex min-h-32 flex-col gap-12">
        <Suspense
          fallback={
            <Spinner
              size="lg"
              variant="simple"
              className="absolute-center"
              color={getSpinnerColor()}
            />
          }
        >
          {content === "multi" &&
            multiRows.map((row) => <MultiHomeList key={row.name} {...row} />)}
          {content === "movie" &&
            movies.map((movie) => <MovieHomeList key={movie.name} {...movie} />)}
          {content === "tv" &&
            tvShows.map((tv) => <TvShowHomeList key={tv.name} {...tv} />)}
          {content === "anime" &&
            anime.map((item) => <AnimeHomeList key={item.name} {...item} />)}
        </Suspense>
      </div>
    </div>
  );
};

export default HomePageList;
