"use client";

import { getWatchlist, removeAllWatchlist } from "@/actions/library";
import { queryClient } from "@/app/providers";
import BackToTopButton from "@/components/ui/button/BackToTopButton";
import ContentTypeSelection from "@/components/ui/other/ContentTypeSelection";
import useDiscoverFilters from "@/hooks/useDiscoverFilters";
import useSupabaseUser from "@/hooks/useSupabaseUser";
import { isEmpty } from "@/utils/helpers";
import { Trash } from "@/utils/icons";
import { addToast, Button, Select, SelectItem, Spinner } from "@heroui/react";
import { useDisclosure, useInViewport } from "@mantine/hooks";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { Suspense, useEffect, useMemo, useState, useTransition } from "react";
import MoviePosterCard from "../Movie/Cards/Poster";
import TvShowPosterCard from "../TV/Cards/Poster";
import AnimePosterCard from "../Anime/Cards/Poster";
import { getLoadingLabel } from "@/utils/movies";
import { ITEMS_PER_PAGE } from "@/utils/constants";
import ConfirmationModal from "@/components/ui/overlay/ConfirmationModal";

type SortOption = "title" | "release_date" | "vote_average" | "created_at";
type FilterType = "movie" | "tv" | "all";

const SORT_OPTIONS: { key: SortOption; label: string }[] = [
  { key: "title", label: "Title" },
  { key: "release_date", label: "Release Date" },
  { key: "vote_average", label: "Rating" },
  { key: "created_at", label: "Date Added" },
];

const LibraryList = () => {
  const { ref, inViewport } = useInViewport();
  const { content } = useDiscoverFilters();
  const { data: user, isLoading: isUserLoading } = useSupabaseUser();
  const [isPending, startTransition] = useTransition();
  const [sortOption, setSortOption] = useState<SortOption>("created_at");
  const [opened, { open, close }] = useDisclosure(false);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status, refetch } =
    useInfiniteQuery({
      queryKey: ["watchlist", content, user?.id],
      queryFn: async ({ pageParam = 1 }) => {
        if (!user) return { success: true, data: [], hasNextPage: false };
        return await getWatchlist(content as FilterType, pageParam, ITEMS_PER_PAGE);
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.hasNextPage) {
          return pages.length + 1;
        }
        return undefined;
      },
      enabled: !isUserLoading,
      staleTime: 1000 * 60 * 5,
    });

  useEffect(() => {
    if (inViewport && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inViewport]);

  const clearWatchlistMutation = useMutation({
    mutationFn: async (type: "movie" | "tv" | "anime" | "multi" | "all") => {
      if (!user) throw new Error("User not authenticated");
      const mappedType = type === "multi" ? "all" : type;
      const result = await removeAllWatchlist(mappedType);
      if (!result.success) {
        throw new Error(result.error || "Failed to clear watchlist");
      }
      const allItems = data?.pages.flatMap((page) => page.data || []) || [];
      const count = type === "multi" || type === "all"
        ? allItems.length
        : allItems.filter((item) => item.type === type).length;
      return { type, count };
    },
    onSuccess: ({ type, count }) => {
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });

      const typeLabel = type === "multi" || type === "all" ? "items" : type === "movie" ? "movies" : "TV shows";
      addToast({
        title: `Cleared ${count} ${typeLabel} from your watchlist!`,
        color: "success",
        icon: <Trash />,
      });

      close();
    },
    onError: (error) => {
      addToast({
        title: "Error",
        description: "Failed to clear watchlist. Please try again.",
        color: "danger",
      });
      console.error("Clear watchlist error:", error);
    },
  });

  const sortedWatchlist = useMemo(() => {
    if (!data?.pages) return [];

    const allItems = data.pages.flatMap((page) => page.data || []);

    return [...allItems].sort((a, b) => {
      switch (sortOption) {
        case "vote_average":
        case "release_date":
          return b[sortOption] > a[sortOption] ? 1 : -1;
        case "created_at":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "title":
        default:
          return a.title.localeCompare(b.title);
      }
    });
  }, [data?.pages, sortOption]);

  const confirmClearWatchlist = () => {
    startTransition(() => {
      clearWatchlistMutation.mutate(content as any);
    });
  };

  if (status === "error") {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
        <p className="text-danger">Failed to load watchlist</p>
        <Button color="primary" onPress={() => refetch()}>
          Try Again
        </Button>
      </div>
    );
  }

  const hasItems = !isEmpty(sortedWatchlist);

  return (
    <>
      <div className="relative flex flex-col items-center justify-center gap-10">
        <div className="flex w-full flex-col items-center justify-center gap-2">
          <ContentTypeSelection className="justify-center" />
          <Select
            label="Sort by"
            size="sm"
            placeholder="Select sort"
            className="max-w-xs p-4"
            selectedKeys={[sortOption]}
            onChange={({ target }) => setSortOption(target.value as SortOption)}
          >
            {SORT_OPTIONS.map(({ key, label }) => (
              <SelectItem key={key}>{label}</SelectItem>
            ))}
          </Select>
          {hasItems && (
            <Button
              startContent={<Trash />}
              color="danger"
              variant="shadow"
              onPress={() => {
                if (user) open();
              }}
              isLoading={clearWatchlistMutation.isPending || isPending}
            >
              Clear {content === "movie" ? "Movies" : content === "tv" ? "TV Shows" : content === "anime" ? "Anime" : "Everything"} from Watchlist
            </Button>
          )}
        </div>
        {status === "pending" ? (
          <Spinner
            size="lg"
            variant="simple"
            className="absolute-center mt-[30vh]"
            color={content === "movie" ? "primary" : content === "tv" ? "warning" : "success"}
          />
        ) : hasItems ? (
          <>
            <div className="movie-grid">
              {sortedWatchlist.map((data) => {
                if (data.type === "tv") {
                  return (
                    <Suspense key={`tv-${data.id}`}>
                      <TvShowPosterCard
                        variant="bordered"
                        // @ts-expect-error: Type conversion for compatibility
                        tv={{
                          adult: data.adult,
                          backdrop_path: data.backdrop_path,
                          first_air_date: data.release_date,
                          id: data.id,
                          name: data.title,
                          poster_path: data.poster_path || "",
                          vote_average: data.vote_average,
                        }}
                      />
                    </Suspense>
                  );
                }
                if (data.type === "anime") {
                  return (
                    <Suspense key={`anime-${data.id}`}>
                      <AnimePosterCard
                        variant="bordered"
                        anime={{
                          id: data.id,
                          title: data.title,
                          main_picture: {
                            large: data.poster_path || "",
                            medium: data.poster_path || "",
                          },
                          start_date: data.release_date,
                          mean: data.vote_average,
                          nsfw: data.adult ? "black" : "white",
                        }}
                      />
                    </Suspense>
                  );
                }
                return (
                  <Suspense key={`movie-${data.id}`}>
                    <MoviePosterCard
                      variant="bordered"
                      // @ts-expect-error: Type conversion for compatibility
                      movie={{
                        adult: data.adult,
                        backdrop_path: data.backdrop_path,
                        id: data.id,
                        poster_path: data.poster_path || "",
                        release_date: data.release_date,
                        title: data.title,
                        vote_average: data.vote_average,
                      }}
                    />
                  </Suspense>
                );
              })}
            </div>
            <div ref={ref} className="flex h-24 items-center justify-center">
              {isFetchingNextPage && (
                <Spinner
                  size="lg"
                  variant="wave"
                  label={getLoadingLabel()}
                  color={content === "movie" ? "primary" : "warning"}
                />
              )}
              {!hasNextPage && !isFetchingNextPage && sortedWatchlist.length > 0 && (
                <p className="text-muted-foreground text-center text-base">
                  You have reached the end of your watchlist.
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="flex h-[30vh] items-center justify-center">
            <p className="text-default-500">
              No {content === "movie" ? "movies" : content === "tv" ? "TV shows" : content === "anime" ? "anime" : "items"} in your watchlist yet.
            </p>
          </div>
        )}
      </div>

      <BackToTopButton />

      <ConfirmationModal
        title={`Clear ${content === "movie" ? "Movies" : content === "tv" ? "TV Shows" : content === "anime" ? "Anime" : "Everything"}?`}
        isOpen={opened}
        onClose={close}
        onConfirm={confirmClearWatchlist}
        confirmLabel="Clear All"
        isLoading={clearWatchlistMutation.isPending}
      >
        <p>
          Are you sure you want to remove all {content === "movie" ? "movies" : content === "tv" ? "TV shows" : content === "anime" ? "anime" : "items"} from
          your watchlist? This action cannot be undone.
        </p>
        <p className="text-default-500 text-sm">
          {sortedWatchlist.length} {sortedWatchlist.length === 1 ? "item" : "items"} will be
          removed.
        </p>
      </ConfirmationModal>
    </>
  );
};

export default LibraryList;
