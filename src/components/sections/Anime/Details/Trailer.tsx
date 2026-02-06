"use client";

import { useDisclosure } from "@mantine/hooks";
import { Button, Modal, ModalBody, ModalContent, Skeleton } from "@heroui/react";
import { MALAnime } from "@/utils/mal";
import { Youtube } from "@/utils/icons";

interface AnimeTrailerProps {
  anime: MALAnime;
}

const AnimeTrailer: React.FC<AnimeTrailerProps> = ({ anime }) => {
  const [opened, handlers] = useDisclosure(false);
  
  // Check if anime has videos
  const hasVideos = anime.videos && anime.videos.length > 0;
  
  // Get the first video (usually the main trailer)
  const video = hasVideos ? anime.videos![0] : null;
  
  // Extract YouTube video ID from URL
  const getYouTubeId = (url: string): string | null => {
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname.includes('youtube.com')) {
        return urlObj.searchParams.get('v');
      } else if (urlObj.hostname.includes('youtu.be')) {
        return urlObj.pathname.slice(1);
      }
      return null;
    } catch {
      return null;
    }
  };

  const youtubeId = video ? getYouTubeId(video.url) : null;

  // If no video data, search YouTube
  if (!hasVideos || !youtubeId) {
    return (
      <Button
        as="a"
        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(anime.title + " trailer")}`}
        target="_blank"
        rel="noopener noreferrer"
        color="danger"
        variant="shadow"
        startContent={<Youtube size={22} />}
      >
        Trailer
      </Button>
    );
  }

  return (
    <>
      <Button
        color="danger"
        variant="shadow"
        startContent={<Youtube size={22} />}
        onPress={handlers.open}
      >
        Trailer
      </Button>

      <Modal 
        backdrop="blur" 
        size="5xl" 
        isOpen={opened} 
        onClose={handlers.close} 
        placement="center"
      >
        <ModalContent>
          <ModalBody className="p-3 md:p-8">
            <div className="relative aspect-video w-full overflow-hidden rounded-large">
              <iframe
                className="size-full"
                src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
                title={video?.title || anime.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AnimeTrailer;
