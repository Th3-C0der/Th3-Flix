import { Image } from "@heroui/image";
import { useWindowScroll } from "@mantine/hooks";
import { getMALImageUrl } from "@/utils/mal";
import { MALAnime } from "@/utils/mal";

const AnimeBackdropSection: React.FC<{
  anime: MALAnime;
}> = ({ anime }) => {
  const [{ y }] = useWindowScroll();
  const title = anime.title;
  const opacity = Math.min((y / 1000) * 2, 1);
  // MAL doesn't have backdrop images, use main picture
  const backdropImage = getMALImageUrl(anime.main_picture?.large);

  return (
    <section id="backdrop" className="fixed inset-0 h-[35vh] md:h-[50vh] lg:h-[70vh]">
      <div className="absolute inset-0 z-10 bg-background" style={{ opacity: opacity }} />
      <div className="absolute inset-0 z-2 bg-linear-to-b from-background from-1% via-transparent via-30%" />
      <div className="absolute inset-0 z-2 translate-y-px bg-linear-to-t from-background from-1% via-transparent via-55%" />
      <div className="absolute-center z-1">
        <h1 className="text-4xl font-black text-white drop-shadow-2xl md:text-6xl lg:text-8xl">
          {title}
        </h1>
      </div>
      <Image
        radius="none"
        alt={title}
        className="z-0 h-[35vh] w-screen object-cover object-center blur-sm md:h-[50vh] lg:h-[70vh]"
        src={backdropImage}
      />
    </section>
  );
};

export default AnimeBackdropSection;
