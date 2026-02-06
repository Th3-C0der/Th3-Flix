import { cn } from "@/utils/helpers";
import { ArrowLeft, List, Next, Prev, Server } from "@/utils/icons";
import { Button } from "@heroui/react";
import ActionButton from "./ActionButton";

interface AnimePlayerHeaderProps {
  id: number;
  animeName: string;
  episodeNumber: number;
  hidden?: boolean;
  selectedSource: number;
  audioType: "sub" | "dub";
  nextEpisodeNumber: number | null;
  prevEpisodeNumber: number | null;
  onOpenSource: () => void;
  onOpenEpisode: () => void;
  onToggleAudio: () => void;
}

const AnimePlayerHeader: React.FC<AnimePlayerHeaderProps> = ({
  id,
  animeName,
  episodeNumber,
  hidden,
  selectedSource,
  audioType,
  nextEpisodeNumber,
  prevEpisodeNumber,
  onOpenSource,
  onOpenEpisode,
  onToggleAudio,
}) => {
  return (
    <div
      aria-hidden={hidden ? true : undefined}
      className={cn(
        "absolute top-0 z-40 flex h-28 w-full items-start justify-between gap-4",
        "bg-linear-to-b from-black/80 to-transparent p-2 text-white transition-opacity md:p-4",
        { "opacity-0": hidden },
      )}
    >
      <ActionButton label="Back" href={`/anime/${id}`}>
        <ArrowLeft size={42} />
      </ActionButton>
      <div className="absolute left-1/2 hidden -translate-x-1/2 flex-col justify-center text-center sm:flex">
        <p className="text-sm text-white text-shadow-lg sm:text-lg lg:text-xl">{animeName}</p>
        <p className="text-xs text-gray-200 text-shadow-lg sm:text-sm lg:text-base">
          Episode {episodeNumber} - {audioType.toUpperCase()}
        </p>
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        <Button
          size="sm"
          color="success"
          variant="flat"
          onClick={onToggleAudio}
          className="hidden sm:flex"
        >
          {audioType.toUpperCase()}
        </Button>
        <ActionButton
          disabled={!prevEpisodeNumber}
          label="Previous Episode"
          tooltip="Previous Episode"
          href={`/anime/${id}/${prevEpisodeNumber}/player?src=${selectedSource}`}
        >
          <Prev size={42} />
        </ActionButton>
        <ActionButton
          disabled={!nextEpisodeNumber}
          label="Next Episode"
          tooltip="Next Episode"
          href={`/anime/${id}/${nextEpisodeNumber}/player?src=${selectedSource}`}
        >
          <Next size={42} />
        </ActionButton>
        <ActionButton label="Sources" tooltip="Sources" onClick={onOpenSource}>
          <Server size={34} />
        </ActionButton>
        <ActionButton label="Episodes" tooltip="Episodes" onClick={onOpenEpisode}>
          <List size={34} />
        </ActionButton>
      </div>
    </div>
  );
};

export default AnimePlayerHeader;
