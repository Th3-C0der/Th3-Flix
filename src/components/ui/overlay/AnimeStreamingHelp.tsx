"use client";

import { Button, Card, CardBody, CardHeader, Link } from "@heroui/react";
import { useState } from "react";

interface AnimeStreamingHelpProps {
  malId: number;
  animeName: string;
  episode: number;
}

const AnimeStreamingHelp: React.FC<AnimeStreamingHelpProps> = ({
  malId,
  animeName,
  episode,
}) => {
  const [show, setShow] = useState(false);

  if (!show) {
    return (
      <Button
        size="sm"
        color="warning"
        variant="flat"
        onPress={() => setShow(true)}
        className="fixed bottom-4 right-4 z-50"
      >
        Video not working?
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-96 max-w-[90vw]">
      <CardHeader className="flex justify-between">
        <h4 className="text-lg font-bold">Streaming Help</h4>
        <Button
          size="sm"
          variant="light"
          onPress={() => setShow(false)}
        >
          ✕
        </Button>
      </CardHeader>
      <CardBody className="gap-3">
        <div className="text-sm">
          <p className="font-semibold">If you see "Couldn't find this episode":</p>
          <ul className="ml-4 mt-2 list-disc space-y-1">
            <li>Try switching to a different source (click Sources button)</li>
            <li>Some anime aren't available on all streaming services</li>
            <li>Try both Sub and Dub options</li>
          </ul>
        </div>

        <div className="rounded-lg bg-default-100 p-3 text-xs">
          <p className="font-semibold">Anime Info:</p>
          <p>Name: {animeName}</p>
          <p>MAL ID: {malId}</p>
          <p>Episode: {episode}</p>
        </div>

        <div className="text-xs text-foreground-500">
          <p>Alternative sources:</p>
          <div className="mt-1 flex flex-col gap-1">
            <Link
              href={`https://myanimelist.net/anime/${malId}`}
              target="_blank"
              size="sm"
              isExternal
            >
              View on MyAnimeList
            </Link>
            <Link
              href={`https://gogoanime.consumet.stream/search?keyword=${encodeURIComponent(animeName)}`}
              target="_blank"
              size="sm"
              isExternal
            >
              Search on GogoAnime
            </Link>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default AnimeStreamingHelp;
