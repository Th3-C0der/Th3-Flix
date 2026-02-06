"use client";

import BackToTopButton from "@/components/ui/button/BackToTopButton";
import { Spinner } from "@heroui/react";
import { useInViewport } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { memo, useEffect } from "react";
import useDiscoverFilters from "@/hooks/useDiscoverFilters";
import useFetchDiscoverMulti from "@/hooks/useFetchDiscoverMulti";
import Loop from "@/components/ui/other/Loop";
import PosterCardSkeleton from "@/components/ui/other/PosterCardSkeleton";
import { getLoadingLabel } from "@/utils/movies";
import MoviePosterCard from "../Movie/Cards/Poster";
import TvShowPosterCard from "../TV/Cards/Poster";
import AnimePosterCard from "../Anime/Cards/Poster";

const MultiDiscoverList = () => {
    const { ref, inViewport } = useInViewport();
    const { genresString, queryType } = useDiscoverFilters();

    const { data, isPending, status, fetchNextPage, isFetchingNextPage, hasNextPage } =
        useInfiniteQuery({
            queryKey: ["discover-multi", queryType, genresString],
            queryFn: ({ pageParam }) =>
                useFetchDiscoverMulti({
                    page: pageParam,
                    type: queryType as any,
                    genres: genresString,
                }),
            initialPageParam: 1,
            getNextPageParam: (lastPage) =>
                lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
        });

    useEffect(() => {
        if (inViewport && !isPending && hasNextPage) {
            fetchNextPage();
        }
    }, [inViewport, isPending, hasNextPage, fetchNextPage]);

    if (status === "error") return notFound();

    if (isPending) {
        return (
            <div className="flex flex-col items-center justify-center gap-10">
                <div className="movie-grid">
                    <Loop count={20} prefix="SkeletonDiscoverPosterCard">
                        <PosterCardSkeleton variant="bordered" />
                    </Loop>
                </div>
            </div>
        );
    }

    const renderCard = (item: any) => {
        if (item.media_type === "movie") {
            return <MoviePosterCard key={`movie-${item.id}`} movie={item} variant="bordered" />;
        }
        if (item.media_type === "tv") {
            return <TvShowPosterCard key={`tv-${item.id}`} tv={item} variant="bordered" />;
        }
        if (item.media_type === "anime") {
            // Map back to what AnimePosterCard expects
            const animeProxy = {
                id: item.id,
                title: item.title,
                main_picture: {
                    large: item.poster_path,
                    medium: item.poster_path,
                },
                start_date: item.release_date,
                mean: item.vote_average * 10,
                nsfw: item.adult ? "black" : "white",
            };
            return <AnimePosterCard key={`anime-${item.id}`} anime={animeProxy as any} variant="bordered" />;
        }
        return null;
    };

    return (
        <div className="flex flex-col items-center justify-center gap-10">
            <div className="movie-grid">
                {data.pages.map((page) => {
                    return page.results.map((item) => renderCard(item));
                })}
            </div>
            <div ref={ref} className="flex h-24 items-center justify-center">
                {isFetchingNextPage && <Spinner size="lg" variant="wave" label={getLoadingLabel()} />}
                {!hasNextPage && !isPending && (
                    <p className="text-muted-foreground text-center text-base">
                        You have reached the end of the list.
                    </p>
                )}
            </div>
            <BackToTopButton />
        </div>
    );
};

export default memo(MultiDiscoverList);
