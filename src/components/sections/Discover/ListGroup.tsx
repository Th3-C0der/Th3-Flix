"use client";

import MovieDiscoverList from "./MovieList";
import useDiscoverFilters from "@/hooks/useDiscoverFilters";
import DiscoverFilters from "./Filters";
import TvShowDiscoverList from "./TvShowList";
import AnimeDiscoverList from "./AnimeList";
import MultiDiscoverList from "./MultiList";

const DiscoverListGroup = () => {
  const { content } = useDiscoverFilters();

  return (
    <div className="flex flex-col gap-10">
      <DiscoverFilters />
      {content === "multi" && <MultiDiscoverList />}
      {content === "movie" && <MovieDiscoverList />}
      {content === "tv" && <TvShowDiscoverList />}
      {content === "anime" && <AnimeDiscoverList />}
    </div>
  );
};

export default DiscoverListGroup;
