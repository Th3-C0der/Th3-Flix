import Rating from "@/components/ui/other/Rating";
import VaulDrawer from "@/components/ui/overlay/VaulDrawer";
import useBreakpoints from "@/hooks/useBreakpoints";
import useDeviceVibration from "@/hooks/useDeviceVibration";
import { getMALImageUrl } from "@/utils/mal";
import { Card, CardBody, CardFooter, CardHeader, Chip, Image, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useDisclosure, useHover } from "@mantine/hooks";
import Link from "next/link";
import { useCallback } from "react";
import { useLongPress } from "use-long-press";
import AnimeHoverCard from "./Hover";

interface AnimePosterCardProps {
  anime: {
    id: number;
    title: string;
    main_picture?: {
      medium: string;
      large: string;
    };
    start_date?: string;
    mean?: number;
    nsfw?: string;
  };
  variant?: "full" | "bordered";
}

const AnimePosterCard: React.FC<AnimePosterCardProps> = ({ anime, variant = "full" }) => {
  const { hovered, ref } = useHover();
  const [opened, handlers] = useDisclosure(false);
  const releaseYear = anime.start_date ? new Date(anime.start_date).getFullYear() : "N/A";
  const posterImage = getMALImageUrl(anime.main_picture?.large || anime.main_picture?.medium);
  const title = anime.title;
  const { mobile } = useBreakpoints();
  const { startVibration } = useDeviceVibration();
  const isAdult = anime.nsfw === "black" || anime.nsfw === "gray";

  const callback = useCallback(() => {
    handlers.open();
    setTimeout(() => startVibration([100]), 300);
  }, []);

  const longPress = useLongPress(mobile ? callback : null, {
    cancelOnMovement: true,
    threshold: 300,
  });

  return (
    <>
      <Tooltip
        isDisabled={mobile}
        showArrow
        className="bg-secondary-background p-0"
        shadow="lg"
        delay={1000}
        placement="right-start"
        content={<AnimeHoverCard id={anime.id} />}
      >
        <Link href={`/anime/${anime.id}`} ref={ref} {...longPress()}>
          {variant === "full" && (
            <div className="group motion-preset-focus relative aspect-2/3 overflow-hidden rounded-lg border-[3px] border-transparent text-white transition-colors hover:border-success">
              {hovered && (
                <Icon
                  icon="line-md:play-filled"
                  width="64"
                  height="64"
                  className="absolute-center z-20 text-white"
                />
              )}
              {isAdult && (
                <Chip
                  color="danger"
                  size="sm"
                  variant="flat"
                  className="absolute left-2 top-2 z-20"
                >
                  18+
                </Chip>
              )}
              <div className="absolute bottom-0 z-2 h-1/2 w-full bg-linear-to-t from-black from-1%"></div>
              <div className="absolute bottom-0 z-3 flex w-full flex-col gap-1 px-4 py-3">
                <h6 className="truncate text-sm font-semibold">{title}</h6>
                <div className="flex justify-between text-xs">
                  <p>{releaseYear}</p>
                  <Rating rate={anime.mean || 0} />
                </div>
              </div>
              <Image
                alt={title}
                src={posterImage}
                radius="none"
                className="z-0 aspect-2/3 h-[250px] object-cover object-center transition group-hover:scale-110 md:h-[300px]"
                classNames={{
                  img: "group-hover:opacity-70",
                }}
              />
            </div>
          )}

          {variant === "bordered" && (
            <Card
              isHoverable
              fullWidth
              shadow="md"
              className="group h-full bg-secondary-background"
            >
              <CardHeader className="flex items-center justify-center pb-0">
                <div className="relative size-full">
                  {hovered && (
                    <Icon
                      icon="line-md:play-filled"
                      width="64"
                      height="64"
                      className="absolute-center z-20 text-white"
                    />
                  )}
                  {isAdult && (
                    <Chip
                      color="danger"
                      size="sm"
                      variant="shadow"
                      className="absolute left-2 top-2 z-20"
                    >
                      18+
                    </Chip>
                  )}
                  <div className="relative overflow-hidden rounded-large">
                    <Image
                      isBlurred
                      alt={title}
                      className="aspect-2/3 rounded-lg object-cover object-center group-hover:scale-110"
                      src={posterImage}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardBody className="justify-end pb-1">
                <p className="text-md truncate font-bold">{title}</p>
              </CardBody>
              <CardFooter className="justify-between pt-0 text-xs">
                <p>{releaseYear}</p>
                <Rating rate={anime.mean || 0} />
              </CardFooter>
            </Card>
          )}
        </Link>
      </Tooltip>

      {mobile && (
        <VaulDrawer
          backdrop="blur"
          open={opened}
          onOpenChange={handlers.toggle}
          title={title}
          hiddenTitle
        >
          <AnimeHoverCard id={anime.id} fullWidth />
        </VaulDrawer>
      )}
    </>
  );
};

export default AnimePosterCard;
