"use client";

import SectionTitle from "@/components/ui/other/SectionTitle";
import { Image } from "@heroui/react";
import { MALAnime } from "@/utils/mal";
import { getMALImageUrl } from "@/utils/mal";
import { useState } from "react";
import Gallery from "@/components/ui/overlay/Gallery";
import { Slide } from "yet-another-react-lightbox";
import { Eye } from "@/utils/icons";

interface AnimePhotosSectionProps {
  anime: MALAnime;
}

const AnimePhotosSection: React.FC<AnimePhotosSectionProps> = ({ anime }) => {
  const [index, setIndex] = useState<number>(-1);

  // Get all available images
  const images = anime.pictures || [];
  
  // If no pictures, don't show the section
  if (images.length === 0) return null;

  const slides: Slide[] = images.map((picture) => ({
    src: getMALImageUrl(picture.large || picture.medium),
    description: anime.title,
  }));

  return (
    <section id="gallery" className="z-3 flex flex-col gap-2">
      <SectionTitle color="success">Photos</SectionTitle>
      <div className="grid grid-cols-2 place-items-center gap-3 sm:grid-cols-4">
        {images.slice(0, 4).map((picture, idx) => {
          const imageUrl = getMALImageUrl(picture.large || picture.medium);
          return (
            <div key={idx} className="group relative">
              <Image
                onClick={() => setIndex(idx)}
                isBlurred
                isZoomed
                width={300}
                alt={`${anime.title} - Photo ${idx + 1}`}
                src={imageUrl}
                className="aspect-video cursor-pointer"
              />

              {idx === 3 && images.length > 4 ? (
                <div
                  className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-medium bg-black/40 text-xl font-bold text-white backdrop-blur-xs"
                  onClick={() => setIndex(idx)}
                >
                  +{images.length - 4}
                </div>
              ) : (
                <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
                  <div className="z-10 flex h-12 w-12 items-center justify-center rounded-full bg-black/35 opacity-0 backdrop-blur-xs transition-opacity group-hover:opacity-100">
                    <Eye className="h-6 w-6 text-white" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <Gallery open={index >= 0} index={index} close={() => setIndex(-1)} slides={slides} />
    </section>
  );
};

export default AnimePhotosSection;
