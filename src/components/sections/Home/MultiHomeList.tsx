"use client";

import MoviePosterCard from "@/components/sections/Movie/Cards/Poster";
import TvShowPosterCard from "@/components/sections/TV/Cards/Poster";
import AnimePosterCard from "@/components/sections/Anime/Cards/Poster";
import SectionTitle from "@/components/ui/other/SectionTitle";
import Carousel from "@/components/ui/wrapper/Carousel";
import { Link, Skeleton } from "@heroui/react";
import { useInViewport } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { kebabCase } from "string-ts";
import useFetchDiscoverMulti from "@/hooks/useFetchDiscoverMulti";

interface MultiHomeListProps {
    name: string;
    param: string;
}

const MultiHomeList: React.FC<MultiHomeListProps> = ({ name, param }) => {
    const key = kebabCase(name) + "-multi-list";
    const { ref, inViewport } = useInViewport();

    const { data, isPending } = useQuery({
        queryFn: () => useFetchDiscoverMulti({ page: 1, type: param as any }),
        queryKey: [key],
        enabled: inViewport,
    });

    const renderCard = (item: any) => {
        if (item.media_type === "movie") {
            return <MoviePosterCard key={`movie-${item.id}`} movie={item} />;
        }
        if (item.media_type === "tv") {
            return <TvShowPosterCard key={`tv-${item.id}`} tv={item} />;
        }
        if (item.media_type === "anime") {
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
            return <AnimePosterCard key={`anime-${item.id}`} anime={animeProxy as any} />;
        }
        return null;
    };

    return (
        <section id={key} className="min-h-[250px] md:min-h-[300px]" ref={ref}>
            {isPending ? (
                <div className="flex w-full flex-col gap-5">
                    <div className="flex grow items-center justify-between">
                        <Skeleton className="h-7 w-40 rounded-full" />
                        <Skeleton className="h-5 w-20 rounded-full" />
                    </div>
                    <Skeleton className="h-[250px] rounded-lg md:h-[300px]" />
                </div>
            ) : (
                <div className="z-3 flex flex-col gap-2">
                    <div className="flex grow items-center justify-between">
                        <SectionTitle color="danger">{name}</SectionTitle>
                        <Link
                            size="sm"
                            href={`/discover?content=multi&type=${param}`}
                            isBlock
                            color="foreground"
                            className="rounded-full"
                        >
                            See All &gt;
                        </Link>
                    </div>
                    <Carousel>
                        {data?.results.map((item) => {
                            return (
                                <div
                                    key={item.id + item.media_type}
                                    className="embla__slide flex min-h-fit max-w-fit items-center px-1 py-2"
                                >
                                    {renderCard(item)}
                                </div>
                            );
                        })}
                    </Carousel>
                </div>
            )}
        </section>
    );
};

export default MultiHomeList;
