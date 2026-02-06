"use client";

import { forwardRef, memo, useMemo, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Input,
  ScrollShadow,
  Tabs,
  Tab,
  Tooltip,
  CardFooter,
  Chip,
} from "@heroui/react";
import { Grid, List, Search, SortAlpha, PlayOutline } from "@/utils/icons";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import IconButton from "@/components/ui/button/IconButton";
import SectionTitle from "@/components/ui/other/SectionTitle";
import { titleCase } from "string-ts";
import { MALAnime } from "@/utils/mal";
import Link from "next/link";
import { cn } from "@/utils/helpers";

interface Props {
  anime: MALAnime;
}

const AnimeEpisodesSection = forwardRef<HTMLElement, Props>(({ anime }, ref) => {
  const [sortedByName, { toggle, close }] = useDisclosure(false);
  const [search, setSearch] = useState("");
  const [searchQuery] = useDebouncedValue(search, 300);
  const [layout, setLayout] = useState<"list" | "grid">("list");

  if (!anime.num_episodes) return null;

  const episodes = Array.from({ length: anime.num_episodes }, (_, i) => ({
    number: i + 1,
    title: `Episode ${i + 1}`,
  }));

  const FILTERED_EPISODES = useMemo(() => {
    let filtered = episodes;

    if (searchQuery) {
      filtered = filtered.filter((ep) =>
        ep.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (sortedByName) {
      filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
    }

    return filtered;
  }, [episodes, searchQuery, sortedByName]);

  return (
    <section ref={ref} id="episodes" className="z-3 flex flex-col gap-2">
      <SectionTitle color="success">Episodes</SectionTitle>
      <Card className="sm:p-3">
        <CardHeader className="grid grid-cols-1 grid-rows-[1fr_auto] gap-3 md:grid-cols-[1fr_auto_auto]">
          <Input
            isClearable
            aria-label="Search Episodes"
            placeholder="Search episodes..."
            value={search}
            onValueChange={setSearch}
            startContent={<Search />}
            classNames={{ inputWrapper: "border-2 border-foreground-200" }}
          />
          <Tooltip content={titleCase(layout)}>
            <Tabs
              color="success"
              aria-label="Layout Select"
              size="sm"
              classNames={{ tabList: "border-2 border-foreground-200" }}
              onSelectionChange={(value) => setLayout(value as typeof layout)}
              selectedKey={layout}
            >
              <Tab key="list" title={<List />} />
              <Tab key="grid" title={<Grid />} />
            </Tabs>
          </Tooltip>
          <IconButton
            tooltip="Sort by name"
            className="p-2"
            icon={<SortAlpha />}
            onPress={toggle}
            color={sortedByName ? "success" : undefined}
            variant={sortedByName ? "shadow" : "faded"}
          />
        </CardHeader>
        <CardBody>
          <ScrollShadow className="h-[600px] py-2 pr-2 sm:pr-3">
            {FILTERED_EPISODES.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <p className="text-center">No episodes found.</p>
              </div>
            ) : layout === "grid" ? (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
                {FILTERED_EPISODES.map((episode) => (
                  <EpisodeGridCard
                    key={episode.number}
                    animeId={anime.id}
                    episodeNumber={episode.number}
                    title={episode.title}
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2 sm:gap-4">
                {FILTERED_EPISODES.map((episode, index) => (
                  <EpisodeListCard
                    key={episode.number}
                    animeId={anime.id}
                    episodeNumber={episode.number}
                    title={episode.title}
                    order={index + 1}
                  />
                ))}
              </div>
            )}
          </ScrollShadow>
        </CardBody>
      </Card>
    </section>
  );
});

interface EpisodeCardProps {
  animeId: number;
  episodeNumber: number;
  title: string;
  order?: number;
}

const EpisodeListCard: React.FC<EpisodeCardProps> = ({
  animeId,
  episodeNumber,
  title,
  order = 1,
}) => {
  const isOdd = order % 2 !== 0;
  const href = `/anime/${animeId}/${episodeNumber}/player`;

  return (
    <Card
      isPressable
      as={Link}
      href={href}
      shadow="none"
      className={cn(
        "group motion-preset-blur-right border-foreground-200 bg-foreground-100 motion-duration-300 grid grid-cols-[auto_1fr] gap-3 border-2 transition-colors hover:border-success hover:bg-foreground-200",
        {
          "motion-preset-slide-left": isOdd,
          "motion-preset-slide-right": !isOdd,
        },
      )}
    >
      <div className="relative h-[120px] w-[180px] flex-shrink-0 overflow-hidden rounded-l-lg sm:w-[220px]">
        <div className="flex h-full items-center justify-center bg-success/10">
          <span className="text-4xl font-bold text-success">{episodeNumber}</span>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="z-10 flex h-12 w-12 items-center justify-center rounded-full bg-black/35 opacity-0 backdrop-blur-xs transition-opacity group-hover:opacity-100">
            <PlayOutline className="h-6 w-6 text-white" />
          </div>
        </div>
        <Chip
          size="sm"
          className="absolute bottom-2 left-2 z-20 min-w-9 bg-black/35 text-center text-white backdrop-blur-xs"
        >
          {episodeNumber}
        </Chip>
      </div>
      <div className="flex flex-col justify-center space-y-1 py-3 pr-3">
        <p className="text-xl font-semibold transition-colors group-hover:text-success">
          {title}
        </p>
        <p className="text-xs text-foreground-500">Click to watch</p>
      </div>
    </Card>
  );
};

const EpisodeGridCard: React.FC<EpisodeCardProps> = ({ animeId, episodeNumber, title }) => {
  const href = `/anime/${animeId}/${episodeNumber}/player`;

  return (
    <Card
      isPressable
      as={Link}
      href={href}
      shadow="none"
      className="group motion-preset-focus border-foreground-200 bg-foreground-100 border-2 transition-colors hover:border-success hover:bg-foreground-200"
    >
      <CardBody className="relative aspect-video overflow-visible p-0">
        <div className="flex h-full items-center justify-center bg-success/10">
          <span className="text-4xl font-bold text-success">{episodeNumber}</span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="z-10 flex h-12 w-12 items-center justify-center rounded-full bg-black/35 opacity-0 backdrop-blur-xs transition-opacity group-hover:opacity-100">
              <PlayOutline className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </CardBody>
      <CardFooter className="flex-col items-start">
        <p className="text-sm font-semibold transition-colors group-hover:text-success">{title}</p>
      </CardFooter>
    </Card>
  );
};

AnimeEpisodesSection.displayName = "AnimeEpisodesSection";

export default memo(AnimeEpisodesSection);
