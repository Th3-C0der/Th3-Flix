import { siteConfig } from "@/config/site";
import { cn } from "@/utils/helpers";
import { getAnimePlayers } from "@/utils/players";
import { Card, Skeleton } from "@heroui/react";
import { useDisclosure, useDocumentTitle, useIdle } from "@mantine/hooks";
import dynamic from "next/dynamic";
import { parseAsInteger, parseAsStringLiteral, useQueryState } from "nuqs";
import { memo, useMemo } from "react";
import useBreakpoints from "@/hooks/useBreakpoints";
import { SpacingClasses } from "@/utils/constants";
import { usePlayerEvents } from "@/hooks/usePlayerEvents";
const AnimePlayerHeader = dynamic(() => import("./Header"));
const AnimePlayerSourceSelection = dynamic(() => import("./SourceSelection"));
const AnimePlayerEpisodeSelection = dynamic(() => import("./EpisodeSelection"));


export interface AnimePlayerProps {
  malId: number;
  animeName: string;
  episodeNumber: number;
  totalEpisodes: number;
  nextEpisodeNumber: number | null;
  prevEpisodeNumber: number | null;
  startAt?: number;
}

const AnimePlayer: React.FC<AnimePlayerProps> = ({
  malId,
  animeName,
  episodeNumber,
  totalEpisodes,
  startAt,
  ...props
}) => {
  const { mobile } = useBreakpoints();
  const [audioType, setAudioType] = useQueryState<"sub" | "dub">(
    "audio",
    parseAsStringLiteral(["sub", "dub"] as const).withDefault("sub"),
  );
  const players = getAnimePlayers(malId, episodeNumber, audioType, startAt);
  const idle = useIdle(3000);
  const [sourceOpened, sourceHandlers] = useDisclosure(false);
  const [episodeOpened, episodeHandlers] = useDisclosure(false);
  const [selectedSource, setSelectedSource] = useQueryState<number>(
    "src",
    parseAsInteger.withDefault(0),
  );

  usePlayerEvents({
    saveHistory: true,
    metadata: { episode: episodeNumber },
  });
  useDocumentTitle(
    `Play ${animeName} - Episode ${episodeNumber} | ${siteConfig.name}`,
  );

  const PLAYER = useMemo(() => players[selectedSource] || players[0], [players, selectedSource]);

  return (
    <>

      <div className={cn("relative", SpacingClasses.reset)}>
        <AnimePlayerHeader
          id={malId}
          animeName={animeName}
          episodeNumber={episodeNumber}
          hidden={idle && !mobile}
          selectedSource={selectedSource}
          audioType={audioType}
          onOpenSource={sourceHandlers.open}
          onOpenEpisode={episodeHandlers.open}
          onToggleAudio={() => setAudioType(audioType === "sub" ? "dub" : "sub")}
          {...props}
        />

        <Card shadow="md" radius="none" className="relative h-screen">
          <Skeleton className="absolute h-full w-full" />
          <iframe
            allowFullScreen
            key={PLAYER.title}
            src={PLAYER.source}
            className={cn("z-10 h-full", { "pointer-events-none": idle && !mobile })}
          />
        </Card>
      </div>

      <AnimePlayerSourceSelection
        opened={sourceOpened}
        onClose={sourceHandlers.close}
        players={players}
        selectedSource={selectedSource}
        setSelectedSource={setSelectedSource}
      />
      <AnimePlayerEpisodeSelection
        malId={malId}
        opened={episodeOpened}
        onClose={episodeHandlers.close}
        totalEpisodes={totalEpisodes}
        currentEpisode={episodeNumber}
      />
    </>
  );
};

export default memo(AnimePlayer);
