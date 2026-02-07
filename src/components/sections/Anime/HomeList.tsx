"use client";

import AnimePosterCard from "@/components/sections/Anime/Cards/Poster";
import SectionTitle from "@/components/ui/other/SectionTitle";
import Carousel from "@/components/ui/wrapper/Carousel";
import { Link, Skeleton } from "@heroui/react";
import { useInViewport } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { kebabCase } from "string-ts";
import { DiscoverAnimeFetchQueryType } from "@/types/anime";

interface AnimeHomeListProps {
  name: string;
  param: DiscoverAnimeFetchQueryType;
}

const AnimeHomeList: React.FC<AnimeHomeListProps> = ({ name, param }) => {
  const key = kebabCase(name) + "-list";
  const { ref, inViewport } = useInViewport();
  const { data, isPending } = useQuery({
    queryFn: async () => {
      const res = await fetch(`/api/anime/list?type=${param}&page=1&limit=20`);
      if (!res.ok) throw new Error("Failed to fetch anime list");
      return res.json();
    },
    queryKey: [key, param],
    enabled: inViewport,
  });

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
            <SectionTitle color="success">{name}</SectionTitle>
            <Link
              size="sm"
              href={`/discover?type=${param}&content=anime`}
              isBlock
              color="foreground"
              className="rounded-full"
            >
              See All &gt;
            </Link>
          </div>
          <Carousel>
            {data?.data.map((item: any) => (
              <div
                key={item.node.id}
                className="embla__slide flex min-h-fit max-w-fit items-center px-1 py-2"
              >
                <AnimePosterCard anime={item.node} />
              </div>
            ))}
          </Carousel>
        </div>
      )}
    </section>
  );
};

export default AnimeHomeList;
