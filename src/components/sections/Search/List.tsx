"use client";

import { tmdb } from "@/api/tmdb";
import { queryClient } from "@/app/providers";
import TvShowHomeCard from "@/components/sections/TV/Cards/Poster";
import BackToTopButton from "@/components/ui/button/BackToTopButton";
import useDiscoverFilters from "@/hooks/useDiscoverFilters";
import { ContentType } from "@/types";
import { isEmpty } from "@/utils/helpers";
import { getLoadingLabel } from "@/utils/movies";
import { Spinner } from "@heroui/react";
import { useInViewport } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Movie, Search, TV } from "tmdb-ts/dist/types";
import MoviePosterCard from "../Movie/Cards/Poster";
import SearchFilter from "./Filter";

import { Person } from "tmdb-ts/dist/types";

type FetchType = {
  page: number;
  type: ContentType;
  query: string;
};

const fetchData = async ({
  page,
  type = "multi",
  query,
}: FetchType): Promise<Search<Movie> | Search<TV> | Search<Movie | TV | Person>> => {
  if (type === "multi") return tmdb.search.multi({ query, page });
  if (type === "movie") return tmdb.search.movies({ query, page });
  return tmdb.search.tvShows({ query, page });
};

const SearchList = () => {
  const { content } = useDiscoverFilters();
  const { ref, inViewport } = useInViewport();
  const [submittedSearchQuery, setSubmittedSearchQuery] = useState("");
  const triggered = !isEmpty(submittedSearchQuery);
  const { data, isFetching, isPending, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery({
      enabled: triggered,
      queryKey: ["search-list", content, submittedSearchQuery],
      queryFn: ({ pageParam: page }) =>
        fetchData({ page, type: content, query: submittedSearchQuery }),
      initialPageParam: 1,
      getNextPageParam: (lastPage) =>
        lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
    });

  useEffect(() => {
    if (inViewport) {
      fetchNextPage();
    }
  }, [inViewport]);

  useEffect(() => {
    queryClient.removeQueries({ queryKey: ["search-list"] });
  }, [content]);

  const renderSearchResults = useMemo(() => {
    return () => {
      if (isEmpty(data?.pages[0].results)) {
        return (
          <h5 className="mt-56 text-center text-xl">
            No {content === "movie" ? "movies" : content === "tv" ? "TV series" : "results"} found with query{" "}
            <span className="text-warning font-semibold">"{submittedSearchQuery}"</span>
          </h5>
        );
      }

      return (
        <>
          <h5 className="text-center text-xl">
            <span className="motion-preset-focus">
              Found{" "}
              <span className="text-success font-semibold">{data?.pages[0].total_results}</span>{" "}
              {content === "movie" ? "movies" : content === "tv" ? "TV series" : "results"} with query{" "}
              <span className="text-warning font-semibold">"{submittedSearchQuery}"</span>
            </span>
          </h5>
          <div className="movie-grid">
            {data?.pages.map((page) =>
              page.results.map((item: any) => {
                if (content === "movie") return <MoviePosterCard key={item.id} movie={item as Movie} variant="bordered" />;
                if (content === "tv") return <TvShowHomeCard key={item.id} tv={item as TV} variant="bordered" />;

                // Multi search handling
                if (item.media_type === "movie") return <MoviePosterCard key={item.id} movie={item as Movie} variant="bordered" />;
                if (item.media_type === "tv") return <TvShowHomeCard key={item.id} tv={item as TV} variant="bordered" />;
                return null;
              })
            )}
          </div>
        </>
      );
    };
  }, [content, data?.pages, submittedSearchQuery]);

  return (
    <div className="flex flex-col items-center gap-8">
      <SearchFilter
        isLoading={isFetching}
        onSearchSubmit={(value) => setSubmittedSearchQuery(value.trim())}
      />
      {triggered && (
        <>
          <div className="relative flex flex-col items-center gap-8">
            {isPending ? (
              <Spinner
                size="lg"
                className="absolute-center mt-56"
                color={content === "movie" ? "primary" : "warning"}
                variant="simple"
              />
            ) : (
              renderSearchResults()
            )}
          </div>
          <div ref={ref} className="flex h-24 items-center justify-center">
            {isFetchingNextPage && (
              <Spinner
                color={content === "movie" ? "primary" : "warning"}
                size="lg"
                variant="wave"
                label={getLoadingLabel()}
              />
            )}
            {!isEmpty(data?.pages[0].results) && !hasNextPage && !isPending && (
              <p className="text-muted-foreground text-center text-base">
                You have reached the end of the list.
              </p>
            )}
          </div>
        </>
      )}

      <BackToTopButton />
    </div>
  );
};

export default SearchList;
