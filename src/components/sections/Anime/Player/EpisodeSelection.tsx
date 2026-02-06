import VaulDrawer from "@/components/ui/overlay/VaulDrawer";
import { HandlerType } from "@/types/component";
import { Button } from "@heroui/react";
import Link from "next/link";

interface AnimePlayerEpisodeSelectionProps extends HandlerType {
  malId: number;
  totalEpisodes: number;
  currentEpisode: number;
}

const AnimePlayerEpisodeSelection: React.FC<AnimePlayerEpisodeSelectionProps> = ({
  opened,
  onClose,
  malId,
  totalEpisodes,
  currentEpisode,
}) => {
  const episodes = Array.from({ length: totalEpisodes }, (_, i) => i + 1);

  return (
    <VaulDrawer
      open={opened}
      onClose={onClose}
      backdrop="blur"
      title="Select Episode"
      direction="right"
      hiddenHandler
      withCloseButton
    >
      <div className="grid grid-cols-3 gap-2 p-2 sm:grid-cols-4 sm:gap-4 sm:p-4 md:grid-cols-5">
        {episodes.map((episodeNumber) => (
          <Button
            key={episodeNumber}
            as={Link}
            href={`/anime/${malId}/${episodeNumber}/player`}
            color={episodeNumber === currentEpisode ? "success" : "default"}
            variant={episodeNumber === currentEpisode ? "solid" : "bordered"}
            className="h-16 w-full"
          >
            <div className="flex flex-col items-center">
              <span className="text-xs">EP</span>
              <span className="text-lg font-bold">{episodeNumber}</span>
            </div>
          </Button>
        ))}
      </div>
    </VaulDrawer>
  );
};

export default AnimePlayerEpisodeSelection;
