import { fetchAnimeById } from "@/actions/anime";
import Genres from "@/components/ui/other/Genres";
import { cn } from "@/utils/helpers";
import { Calendar, List, Play } from "@/utils/icons";
import { getMALImageUrl } from "@/utils/mal";
import { Button, Chip, Image, Link, Spinner } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import Rating from "../../../ui/other/Rating";
import { SavedAnimeDetails } from "@/types/anime";
import BookmarkButton from "@/components/ui/button/BookmarkButton";

const AnimeHoverCard: React.FC<{ id: number; fullWidth?: boolean }> = ({ id, fullWidth }) => {
  const { data: anime, isPending } = useQuery({
    queryFn: () => fetchAnimeById(id),
    queryKey: ["get-anime-detail-on-hover-poster", id],
  });

  if (isPending) {
    return (
      <div className="h-96 w-80">
        <Spinner size="lg" color="success" variant="simple" className="absolute-center" />
      </div>
    );
  }

  if (!anime) return null;

  const title = anime.title;
  const releaseYear = anime.start_date ? new Date(anime.start_date).getFullYear() : "N/A";
  const backdropImage = getMALImageUrl(anime.main_picture?.large);
  const isAdult = anime.nsfw === "black" || anime.nsfw === "gray";

  const bookmarkData: SavedAnimeDetails = {
    type: "anime",
    adult: isAdult,
    backdrop_path: anime.main_picture?.large || "",
    id: anime.id,
    poster_path: anime.main_picture?.large || anime.main_picture?.medium,
    release_date: anime.start_date || "",
    title: title,
    vote_average: anime.mean || 0,
    saved_date: new Date().toISOString(),
  };

  return (
    <div
      className={cn("w-80", {
        "w-full": fullWidth,
      })}
    >
      <div className="relative">
        <div className="relative aspect-video h-fit w-full">
          <div className="absolute z-2 h-full w-full bg-linear-to-t from-secondary-background from-1%"></div>
          <Image
            radius="none"
            alt={title}
            className="z-0 aspect-video rounded-t-lg object-cover object-center"
            src={backdropImage}
          />
        </div>
        <div className="flex flex-col gap-2 p-4 *:z-10">
          <Chip
            color="success"
            size="sm"
            variant="faded"
            className="md:text-md text-xs"
            classNames={{ content: "font-bold" }}
          >
            ANIME
          </Chip>
          <h4 className="text-xl font-bold">{title}</h4>
          <div className="md:text-md flex flex-wrap gap-1 text-xs md:gap-2">
            {anime.num_episodes && (
              <>
                <div className="flex items-center gap-1">
                  <List />
                  <span>
                    {anime.num_episodes} Episode{anime.num_episodes > 1 ? "s" : ""}
                  </span>
                </div>
                <p>&#8226;</p>
              </>
            )}
            <div className="flex items-center gap-1">
              <Calendar />
              <span>{releaseYear}</span>
            </div>
            {anime.mean && (
              <>
                <p>&#8226;</p>
                <Rating rate={anime.mean} count={anime.num_scoring_users} />
              </>
            )}
          </div>
          {anime.genres && anime.genres.length > 0 && (
            <Genres
              genres={anime.genres.map(g => ({ id: g.id, name: g.name }))}
              type="anime"
            />
          )}
          <div className="flex w-full justify-between gap-2 py-1">
            <Button
              as={Link}
              href={`/anime/${anime.id}`}
              fullWidth
              color="success"
              variant="shadow"
              startContent={<Play size={24} />}
            >
              View Episodes
            </Button>
            <BookmarkButton data={bookmarkData} isTooltipDisabled />
          </div>
          {anime.synopsis && <p className="text-sm">{anime.synopsis}</p>}
        </div>
      </div>
    </div>
  );
};

export default AnimeHoverCard;
