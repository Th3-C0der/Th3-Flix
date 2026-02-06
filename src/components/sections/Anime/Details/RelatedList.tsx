import Carousel from "@/components/ui/wrapper/Carousel";
import AnimePosterCard from "@/components/sections/Anime/Cards/Poster";
import { MALAnime } from "@/utils/mal";

interface AnimeRelatedListProps {
  animeList: MALAnime[];
}

const AnimeRelatedList: React.FC<AnimeRelatedListProps> = ({ animeList }) => {
  return (
    <div className="z-3 flex flex-col gap-2">
      <Carousel>
        {animeList.map((anime) => {
          return (
            <div key={anime.id} className="flex min-h-fit max-w-fit items-center px-1 py-2">
              <AnimePosterCard anime={anime} />
            </div>
          );
        })}
      </Carousel>
    </div>
  );
};

export default AnimeRelatedList;
