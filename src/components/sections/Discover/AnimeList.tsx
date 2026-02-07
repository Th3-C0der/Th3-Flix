"use client";

import AnimePosterCard from "@/components/sections/Anime/Cards/Poster";
import useDiscoverFilters from "@/hooks/useDiscoverFilters";
import { Spinner } from "@heroui/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

const AnimeDiscoverList = () => {
  const { queryType } = useDiscoverFilters();
  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } = useInfiniteQuery({
    queryKey: ["discover-anime", queryType],
    queryFn: async ({ pageParam }) => {
      const res = await fetch(`/api/anime/list?type=${queryType}&page=${pageParam}&limit=20`);
      if (!res.ok) throw new Error("Failed to fetch anime list");
      return res.json();
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      if (!lastPage.paging.next) return undefined;
      return lastPageParam + 1;
    },
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (isPending) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spinner size="lg" color="success" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {data?.pages.map((page) =>
          page.data.map((item: any) => (
            <AnimePosterCard key={item.node.id} anime={item.node} variant="bordered" />
          )),
        )}
      </div>

      <div ref={ref} className="flex justify-center py-4">
        {isFetchingNextPage && <Spinner size="lg" color="success" />}
      </div>
    </div>
  );
};

export default AnimeDiscoverList;
